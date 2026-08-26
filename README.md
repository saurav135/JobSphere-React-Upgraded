# JobSphere

A production-style full-stack recruitment management system built with Java, Spring Boot, Spring Security, JWT, MySQL, and React.

JobSphere provides separate workflows for candidates, recruiters, and administrators, including job discovery, job applications, recruiter hiring management, authentication, and dashboards.

## 🚀 Technology Stack

- Java 17
- Spring Boot
- Spring Security
- JWT Authentication
- BCrypt Password Encryption
- Spring Data JPA / Hibernate
- MySQL
- REST API
- React
- Vite
- Responsive CSS

## ✨ Main Features

### 👤 Candidate

- Candidate registration and login
- Secure BCrypt password storage
- JWT-based authentication
- Browse and search jobs
- Apply for jobs
- Duplicate application prevention
- Track application status
- View application history
- Manage candidate profile
- Resume management

### 🏢 Recruiter

- Recruiter registration and login
- Secure authentication
- Create jobs
- Update jobs
- Close jobs
- Manage candidate applications
- Hiring pipeline management
- Recruiter dashboard

### 🛡️ Admin

- Admin authentication
- Role-based authorization
- Application management
- Administrative statistics dashboard

## 🔐 Security

- Spring Security
- JWT-based authentication
- Role-based authorization
- BCrypt password hashing
- Protected REST endpoints
- Secure authentication workflow

## 📁 Project Structure

```text
JobSphere/
├── frontend/
│   ├── src/
│   ├── package.json
│   └── package-lock.json
│
├── src/
│   └── main/
│       ├── java/
│       │   └── com/jobSphere/
│       │       ├── config/
│       │       ├── controller/
│       │       ├── dto/
│       │       ├── entity/
│       │       ├── repository/
│       │       └── service/
│       │
│       └── resources/
│           ├── static/
│           └── application.properties
│
├── pom.xml
├── README.md
└── .gitignore
