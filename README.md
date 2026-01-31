📝 Task Management Web Application

A full-stack Task Management Web Application built as part of the Global Trend – Full Stack Development Internship Skill Assessment.
The application allows users to securely manage their personal tasks with authentication, status tracking, and filtering.

🚀 Features
🔐 Authentication

User Registration

User Login & Logout
Session-based authentication
Access protection (unauthenticated users are redirected)

✅ Task Management

Create tasks
View tasks
Update task status (Pending ↔ Done)
Delete tasks
Tasks are user-specific (data isolation)

🔍 Filters

View All tasks
View Pending tasks
View Done tasks

🎨 UI

Clean and responsive UI
Separate pages for Login, Register, and Task Dashboard
JavaScript-based dynamic updates (no page reloads)

🛠️ Tech Stack
Frontend

HTML
CSS
JavaScript (Vanilla JS)

Backend

Python
Flask
Flask-CORS
Flask-SQLAlchemy
Database
SQLite 



Project Structure
<img width="370" height="460" alt="1" src="https://github.com/user-attachments/assets/d8c867bd-a445-4c10-8f94-b1e5f1bae752" />


⚙️ Setup Instructions (Local)
1️⃣ Clone the Repository
git clone <your-github-repo-url>
cd Todo

2️⃣ Backend Setup
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
python app.py


Backend runs at:
http://127.0.0.1:5000

3️⃣ Frontend Setup

Open:

frontend/login.html
in your browser
(or use Live Server in VS Code)

🌍 Deployment

The application is deployed on Render using Flask and Gunicorn.

SQLite is used for demonstration purposes.
On the free tier, database data may reset on redeployment.

🔗 Deployed URL:
<your-render-link>

🧪 Testing
Testing Approach

Manual testing was performed for all core features.
Authentication, CRUD operations, filters, and access control were tested.

🎥 Demo / Testing Video

A Loom video demonstrates:

User registration & login
Task creation, update, deletion

Status toggling

Filters (All / Pending / Done)
User-specific task isolation

🔗 Loom Video Link:
https://www.loom.com/share/b948afef8f8b43e5a3e0bf67fb4a6c12

🔐 Security Notes

Passwords are hashed using Werkzeug
Session-based authentication is implemented
Users cannot access tasks belonging to other users

📌 Assignment Alignment

This project fulfills the following requirements from the assignment:

Frontend using HTML, CSS, JavaScript
Backend using Python (Flask)
RESTful CRUD operations
Database integration
Authentication 
Filters 
Deployment 
Documentation & Testing 

👤 Author

Sania Parveen
BS Data Science & Applications – IIT Madras


