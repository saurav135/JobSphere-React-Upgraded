# JobSphere

Production-style full-stack recruitment management system built with Java, Spring Boot, Spring Security, JWT, MySQL and React.

## Technology
- Java 17
- Spring Boot
- Spring Security + JWT + BCrypt
- Spring Data JPA / Hibernate
- MySQL
- REST API
- React + Vite
- Responsive CSS

## Main Features
- Candidate and recruiter registration/login
- Secure BCrypt password storage
- JWT authentication and role-based authorization
- Responsive React job search experience
- Recruiter job create/update/close
- Candidate job applications
- Duplicate application prevention
- Application status workflow
- Candidate application history
- Recruiter application management
- Recruiter dashboard and hiring pipeline
- Admin statistics dashboard

## Run the Spring Boot application
1. Open this `JobSphere` folder in IntelliJ IDEA.
2. Open `src/main/resources/application.properties`.
3. Replace `CHANGE_ME` with your local MySQL root password.
4. Run `JobSphereApplication.java`.
5. Open `http://localhost:8080`.

## React frontend development
The React source is in `frontend/`. To run it separately during development:

```bash
cd frontend
npm install
npm run dev
```

For the integrated Spring Boot app, build React and copy the generated `frontend/dist/` contents into `src/main/resources/static/`. The repository currently includes the React source so the frontend can be developed and rebuilt cleanly.

## Default admin
Email: `admin@jobsphere.com`
Password: `Admin@123`

Change the default admin password before real deployment.
