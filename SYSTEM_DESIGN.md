
# System Design Document

## Project Overview
The **Academic Management Platform (Excel CRM for Education)** is a web application designed to manage student enrollments, course management, assignments, and role-based access to various system features. The system supports multiple roles: **Admin**, **Lecturer**, and **Student**. Each role has different permissions and access to various features of the platform. The system integrates AI features for course recommendations and syllabus generation.

## High-Level Architecture

### 1. **Frontend**
- **Technology**: React (Next.js)
  - **Pages**: Login, Dashboard (role-specific), Courses, AI Assistant, etc.
  - **UI**: MUI (Material UI) for components like buttons, forms, modals, etc.
  - **Authentication**: JWT (JSON Web Token) based authentication for secure access control.

### 2. **Backend**
- **Technology**: Node.js with Express
- **Database**: MySQL for persistent data storage
- **Authentication**: JWT-based authentication for secure access
- **APIs**: RESTful APIs to handle student enrollments, course management, assignments, and AI integrations.

### 3. **AI Integration**
- **AI Features**:
  - **Course Recommendations**: Suggests courses based on student interests and previous enrollments.
  - **Syllabus Generation**: Uses OpenAI or similar APIs to generate course syllabi based on provided course topics.

### 4. **Database Design**
The system uses a **MySQL** database to store all necessary data. The schema consists of several tables, each with distinct relationships and functionalities.

### Tables:

#### **Users Table**:
- `id` (Primary Key): Unique identifier for each user.
- `email`: User's email (unique).
- `password`: Encrypted password.
- `role_id` (Foreign Key): References the Role table to associate each user with a role (Student, Lecturer, Admin).
- `name`: Full name of the user.
- `created_at`: Timestamp.
- `updated_at`: Timestamp.

#### **Roles Table**:
- `id` (Primary Key): Unique identifier for each role.
- `name`: Role name (Student, Lecturer, Admin).
- `permissions`: Specific permissions associated with the role (e.g., "manage_courses", "enroll_students").

#### **Courses Table**:
- `id` (Primary Key): Unique identifier for each course.
- `title`: Name of the course.
- `description`: Detailed description of the course.
- `credits`: Number of credit hours for the course.
- `lecturer_id` (Foreign Key): References the users table, representing the lecturer of the course.
- `created_at`: Timestamp.
- `updated_at`: Timestamp.

#### **Enrollments Table**:
- `id` (Primary Key): Unique identifier for each enrollment.
- `course_id` (Foreign Key): References the courses table.
- `student_id` (Foreign Key): References the users table.
- `status`: Enrollment status (e.g., "pending", "approved", "rejected").
- `created_at`: Timestamp.
- `updated_at`: Timestamp.

#### **Syllabi Table**:
- `id` (Primary Key): Unique identifier for each syllabus.
- `course_id` (Foreign Key): References the courses table.
- `file_url`: URL or file path for the syllabus (PDF, DOCX, etc.).
- `created_at`: Timestamp.
- `updated_at`: Timestamp.

#### **Assignments Table**:
- `id` (Primary Key): Unique identifier for each assignment.
- `course_id` (Foreign Key): References the courses table.
- `title`: Title of the assignment.
- `due_date`: Date when the assignment is due.
- `created_at`: Timestamp.
- `updated_at`: Timestamp.

#### **AuditLogs Table**:
- `id` (Primary Key): Unique identifier for each audit log.
- `user_id` (Foreign Key): References the users table.
- `action`: Description of the action taken (e.g., "enrolled in course", "created course").
- `target`: The target of the action (e.g., "Course A").
- `created_at`: Timestamp when the action occurred.

## Key Components

### 1. **Authentication**
- **JWT Authentication**:
  - **Login Flow**: User logs in with email and password. Upon successful authentication, a JWT token is generated and sent to the client.
  - **Token Storage**: JWT token is stored in the browser's local storage.
  - **Authorization**: Every API request requires a valid JWT token in the `Authorization` header.

### 2. **Role-based Access Control (RBAC)**
- **Roles**: Admin, Lecturer, Student
  - **Admin**: Manages users, courses, enrollments, and approves/rejects student enrollments.
  - **Lecturer**: Manages courses, uploads syllabi, and interacts with student submissions.
  - **Student**: Browses courses, enrolls, and submits assignments.

### 3. **Course Management**
- **Course Creation/Management**: Lecturers can create and update courses with syllabus uploads.
- **Student Enrollment**: Students can enroll and drop courses. Admins can approve or reject enrollments.
- **Assignments**: Students can submit assignments, which are then graded by lecturers.

### 4. **AI Integration**
- **Course Recommendations**: An AI-based recommendation system that suggests courses based on students' academic history and interests.
- **Syllabus Generation**: Uses AI to generate course syllabi dynamically, based on topics entered by lecturers.

## Technologies

### 1. **Frontend**
- **Next.js** (React Framework)
- **MUI (Material UI)** for UI components
- **Axios** for making API requests
- **JWT** for authentication

### 2. **Backend**
- **Node.js** with **Express** for building RESTful APIs
- **MySQL** for data storage and relational database management
- **JWT** for user authentication and role-based access control

### 3. **AI Services**
- **OpenAI API** or similar services for course recommendations and syllabus generation

### 4. **Deployment**
- **Docker** for containerization
- **AWS** or **Heroku** for deployment

## API Endpoints

### 1. **Authentication**
- **POST** `/api/auth/login`: Login and receive a JWT token.
- **POST** `/api/auth/logout`: Logout and invalidate the JWT token.

### 2. **Courses**
- **GET** `/api/courses`: Fetch all courses.
- **POST** `/api/courses`: Create a new course (Lecturer/Admin).
- **PUT** `/api/courses/:id`: Update an existing course (Lecturer/Admin).
- **DELETE** `/api/courses/:id`: Delete a course (Admin).

### 3. **Enrollments**
- **POST** `/api/enrollments`: Enroll a student in a course.
- **DELETE** `/api/enrollments`: Drop a student from a course.
- **GET** `/api/enrollments`: Fetch student enrollments.

### 4. **AI Integration**
- **POST** `/api/ai/recommend`: Get course recommendations for a student.
- **POST** `/api/ai/syllabus`: Generate a syllabus based on input topics.

## Performance Considerations
1. **Caching**: Cache frequently accessed data, such as course lists, to reduce the load on the server and improve response times.
2. **Pagination**: Implement pagination for large data sets (e.g., courses, enrollments).
3. **Load Balancing**: Use load balancing for handling high traffic and ensuring the availability of the system.

## Security Considerations
1. **Authentication**: Use JWT tokens for authentication and ensure the tokens are stored securely in local storage or cookies.
2. **Authorization**: Ensure role-based access control (RBAC) is enforced at both the API and UI levels.
3. **Data Validation**: Ensure all incoming data is validated to prevent SQL injection and other attacks.
4. **SSL**: Use SSL/TLS encryption for all data transmitted between the client and server.

## Conclusion
The **Academic Management Platform** provides a comprehensive solution for managing student enrollments, course content, and assignments while integrating AI features for enhanced user experience. The system follows industry best practices for security, scalability, and performance, making it robust enough for both educational institutions and individual users.
