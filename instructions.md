✅ Test_School Competency Assessment Platform – Specification Document

1. 🧾 Introduction
This document outlines the functional and technical specifications for developing a multi-stage digital competency assessment platform based on the Test_School(quiz test). The system will allow users to test and certify their digital competencies through a secure, structured 3-step process.

2. 🎯 Platform Objectives
Assess users' digital skills based on predefined Test_School levels (A1 → C2).


Provide a 3-step progressive evaluation pathway.


Automate the assignment of certification levels based on score.


Prevent retests on failure at Step 1.


Implement test timers, secure browser control, and test integrity measures.



3. 📌 Must-Have Functional Features
✅ 3-Step Assessment Flow
Step 1 → Levels A1 & A2


Score <25% → Fail, no retake allowed


25–49.99% → A1 certified


50–74.99% → A2 certified


≥75% → A2 certified + Proceed to Step 2


Step 2 → Levels B1 & B2


<25% → Remain at A2


25–49.99% → B1 certified


50–74.99% → B2 certified


≥75% → B2 certified + Proceed to Step 3


Step 3 → Levels C1 & C2


<25% → Remain at B2


25–49.99% → C1 certified


≥50% → C2 certified


⏱ Timer System
Countdown timer per test step.


Auto-submit on time expiration.


Default: 1 minute per question, configurable.


📚 Question Pool
Total: 22 competencies × 6 levels = 132 questions.


Each step has 44 questions from 2 relevant levels.


Questions must be categorized by competency and level.

📜 Certification
Automatically generate a digital certificate based on the highest level achieved.


Optional: Include downloadable PDF + email delivery.



4. 🔐 Authentication & User Management
👤 User Roles
Admin


Student


Supervisor


🔑 Authentication Features
User Registration (with email verification)


Login / Logout (JWT access & refresh tokens)


Secure Token Flow


Access Token (short-lived)


Refresh Token (long-lived, secure storage)


OTP Verification System


Send OTP (email/SMS)


Resend OTP support


Forgot Password


Reset Password


Secure password hashing (bcrypt)



Bonus Task:
Secure Exam Environment
Integrate with Safe Exam Browser (SEB).


Restrict navigation, input methods, external tab access.


 Enable live video recording during exams.

5. 🧑‍💻 Tech Stack
⚙️ Frontend
TypeScript
React.js


Redux, RTK Query,Axios
In Every CRUD Operations Use: Redux, RTK Query with Axios


Tailwind CSS (responsive design)


Redux Persist


⚙️ Backend
Node.js + Express


TypeScript


Mongoose + MongoDB


JWT (for auth)


Nodemailer / Twilio (for email/SMS OTP)



6. 📈 Future Enhancements
Admin dashboard for managing users, reports, and analytics.


Advanced test analytics (per competency and performance trends).


Email notifications for results and certification.


Mobile-optimized, responsive UI.


Note: 
1. Pagination should be used on all admin dashboard tables and product pages 
2. 100% error handling on all functions and pages 
3. Component must be reusable 
4. Industry standard code 
5. Industry standard file structure
 6. This task should reflect best practices regarding code organization, security, and user experience. It should demonstrate proficiency in using the specified technologies 
7. Meaningful comment 
8. All variables must use types 
9. All state management use redux

Submission: Send your completed job tasks to zamirulkabir75@gmail.com
 • Provide the GitHub repository links of the code,
 ensuring there is a README file with explicit instructions for running the application locally
. • Live deployment link
. • Database design PDF file
Admin Credentials
Please provide valid admin login credentials for testing purpose

 Deadline • August 10, 2025, 11:59 PM 
Submission Rule:
 • Task Related Assistance: Asking for task-related help from any team members of EForgeIT. is strictly prohibited. Such behavior will result in immediate rejection of your assessment.
 Please ensure that you adhere to the submission deadline and rules mentioned above.We eagerly anticipate reviewing your submissions and assessing your skills for the Full stack developer at EForgeIT

