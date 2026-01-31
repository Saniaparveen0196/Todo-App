from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app, supports_credentials=True)

app.config["SECRET_KEY"] = "secret-key-change-later"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

# ---------------- MODELS ----------------

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255))
    status = db.Column(db.String(20), default="pending")
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))

with app.app_context():
    db.create_all()

# ---------------- AUTH ----------------

@app.route("/register", methods=["POST"])
def register():
    data = request.json
    if User.query.filter_by(username=data["username"]).first():
        return jsonify({"message": "User already exists"}), 400

    user = User(
        username=data["username"],
        password=generate_password_hash(data["password"])
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "Registered successfully"}), 201


@app.route("/login", methods=["POST"])
def login():
    data = request.json
    user = User.query.filter_by(username=data["username"]).first()

    if not user or not check_password_hash(user.password, data["password"]):
        return jsonify({"message": "Invalid credentials"}), 401

    session["user_id"] = user.id
    return jsonify({"message": "Login successful"})


@app.route("/logout", methods=["POST"])
def logout():
    session.pop("user_id", None)
    return jsonify({"message": "Logged out"})


def login_required():
    if "user_id" not in session:
        return False
    return True

# ---------------- TASK ROUTES ----------------

@app.route("/tasks", methods=["GET"])
def get_tasks():
    if not login_required():
        return jsonify({"message": "Unauthorized"}), 401

    tasks = Task.query.filter_by(user_id=session["user_id"]).all()
    return jsonify([
        {
            "id": t.id,
            "title": t.title,
            "description": t.description,
            "status": t.status
        } for t in tasks
    ])


@app.route("/tasks", methods=["POST"])
def create_task():
    if not login_required():
        return jsonify({"message": "Unauthorized"}), 401

    data = request.json
    task = Task(
        title=data["title"],
        description=data.get("description", ""),
        status="pending",
        user_id=session["user_id"]
    )
    db.session.add(task)
    db.session.commit()
    return jsonify({"message": "Task created"}), 201


@app.route("/tasks/<int:id>", methods=["PUT"])
def update_task(id):
    if not login_required():
        return jsonify({"message": "Unauthorized"}), 401

    task = Task.query.get_or_404(id)
    task.status = request.json.get("status", task.status)
    db.session.commit()
    return jsonify({"message": "Task updated"})


@app.route("/tasks/<int:id>", methods=["DELETE"])
def delete_task(id):
    if not login_required():
        return jsonify({"message": "Unauthorized"}), 401

    task = Task.query.get_or_404(id)
    db.session.delete(task)
    db.session.commit()
    return jsonify({"message": "Task deleted"})


if __name__ == "__main__":
    app.run(debug=True)
