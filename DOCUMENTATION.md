# Online Learning Platform (LMS) - Comprehensive Project Documentation

---

## 1. Project Abstract
The **EduPulse Online Learning Platform (LMS)** is a full-stack, next-generation web application designed to democratize high-quality technical education through interactive video learning, automated knowledge evaluation, real-time AI tutoring, and verifiable course completion certificates. Developed using modern web standards—React 18 on the frontend and Node.js with Express on the backend—the platform bridges the gap between passive video viewing and active skill acquisition. Learners can register secure accounts, explore categorized course catalogs, track their video watch positions automatically, take auto-graded quizzes (supporting multiple-choice, true/false, and fill-in-the-blanks format), participate in course discussion Q&A forums, earn XP points and achievement badges on a global leaderboard, and download official PDF certificates upon 100% course completion. Instructors are provided with a specialized Studio dashboard to author courses, manage student enrollments, and track course sales metrics. Built with a responsive, high-aesthetic glassmorphic design system featuring native dark and light mode support, EduPulse provides an intuitive, accessible learning experience across all devices.

---

## 2. Problem Statement
Traditional online learning environments often suffer from severe engagement degradation, high dropout rates, and lack of real-time academic assistance. Key operational problems in current learning management systems include:
1. **Passive Content Consumption**: Students watch pre-recorded videos without structured checkpoints or automated mechanism to verify active retention.
2. **Delayed Academic Assistance**: Learners who encounter conceptual roadblocks during late-night study sessions have no immediate channel to ask clarifying questions, leading to frustration and abandoned courses.
3. **Static & Uninspiring Progress Metrics**: Generic completion checkboxes fail to motivate learners or celebrate incremental milestones.
4. **Manual & Unverified Certification**: Course administrators waste time manually issuing completion credentials that lack tamper-proof verification IDs.
5. **Complex Infrastructure Overhead**: Many LMS platforms require complex local database configurations that increase onboarding friction for developers and self-hosted deployments.

---

## 3. Proposed Solution
The **EduPulse LMS** resolves these challenges by combining gamification, responsive video streaming, automated grading, and an interactive AI Learning Assistant into an integrated full-stack architecture:
1. **Interactive Video Learning Workspace**: Video watch time is automatically tracked per user. Lessons are marked complete when 90% of content is viewed, with automatic position saving across sessions.
2. **Real-time AI Learning Tutor**: An integrated AI assistant endpoint powered by EduPulse AI offers 24/7 instant answers to technical questions, code debugging advice, and suggested review topics.
3. **Automated Assessment & Gamification**: Module quizzes evaluate student understanding instantly with detailed answer breakdowns, awarding Experience Points (XP) and achievement badges (e.g. *Fast Learner*, *Quiz Master*, *Course Master*) visible on a global Leaderboard.
4. **Instant PDF Certificate Generation**: Reaching 100% completion unlocks an automated, printable completion certificate complete with candidate name, issue date, instructor signature, and unique credential verification ID (`EDU-XXXXXX`).
5. **Zero-Setup Database Architecture**: A persistent JSON database store (`LocalStore`) operates out-of-the-box without requiring local database setup while maintaining 100% MongoDB query syntax compatibility.

---

## 4. System Architecture

### Textual Description
The platform follows a decoupled, client-server REST API architecture:
- **Client Tier**: Single Page Application (SPA) built with React 18 and Vite. State is managed via React Context (`AuthContext` for JWT session state and user profile, `ThemeContext` for Light/Dark mode). Styled using Vanilla CSS design tokens with glassmorphism effects.
- **API Gateway & Business Logic Tier**: Express.js server on Node.js. Enforces route protection via JWT authentication middleware (`authMiddleware.js`), input validation, and business logic controllers.
- **Database Tier**: Persistent JSON Database Store (`LocalStore` in `config/db.js`) providing ACID-like file synchronization and query capabilities (`find`, `findOne`, `findById`, `insertOne`, `updateOne`, `deleteOne`), with seamless upgrade path to MongoDB Atlas.

### ASCII Architecture Diagram
```text
  +-----------------------------------------------------------------------+
  |                           CLIENT TIER (React 18)                       |
  |                                                                       |
  |  +-------------------+   +--------------------+   +----------------+  |
  |  |  React Components |   |   Context State    |   |  API Service   |  |
  |  | (Navbar, Pages,   | <-> (AuthContext,      | <-> (api.js Fetch  |  |
  |  |  VideoPlayer, etc)|   |  ThemeContext)     |   |   Client)      |  |
  |  +-------------------+   +--------------------+   +-------+--------+  |
  +-----------------------------------------------------------|-----------+
                                                              | HTTP/REST
                                                              v
  +-----------------------------------------------------------------------+
  |                       SERVER TIER (Node.js & Express)                 |
  |                                                                       |
  |  +-------------------+   +--------------------+   +----------------+  |
  |  | Router Middleware |   | controllers/       |   | authMiddleware |  |
  |  | (/api/auth, etc)  | --> (authController,   | <-- (JWT Verify,   |  |
  |  |                   |   |  courseController) |   |  Role Check)   |  |
  |  +-------------------+   +---------+----------+   +----------------+  |
  +------------------------------------|----------------------------------+
                                       | Database Abstraction Layer
                                       v
  +-----------------------------------------------------------------------+
  |                     DATABASE TIER (JSON / MongoDB)                    |
  |                                                                       |
  |  +---------------+  +---------------+  +---------------+              |
  |  |  users.json   |  |  courses.json |  | progress.json |              |
  |  +---------------+  +---------------+  +---------------+              |
  |  +---------------+  +---------------+                                 |
  |  | reviews.json  |  |discussions.json|                                 |
  |  +---------------+  +---------------+                                 |
  +-----------------------------------------------------------------------+
```

---

## 5. Tech Stack Used & Justification

| Technology | Role | Why Chosen |
| :--- | :--- | :--- |
| **React 18** | Frontend UI Framework | Component-driven architecture, fast Virtual DOM reconciliation, state management via Hooks, and excellent ecosystem support. |
| **Vite** | Frontend Build Tool / Server | Extremely fast HMR (Hot Module Replacement), optimized ES modules bundling, and faster build speeds compared to traditional Webpack. |
| **Vanilla CSS3** | Styling & Design System | Complete control over modern CSS variables, glassmorphism backdrop filters, custom scrollbars, and keyframe animations without utility framework bloat. |
| **Lucide React** | Icon System | Lightweight, customizable SVG icons matching modern design aesthetics. |
| **Node.js** | Server Runtime | Non-blocking asynchronous I/O event loop ideal for concurrent API endpoints and streaming video requests. |
| **Express.js** | Backend Web Framework | Minimalist, unopinionated routing framework providing clean middleware pipeline architecture. |
| **JWT (jsonwebtoken)** | Authentication | Stateless authentication mechanism; tokens carry identity securely in HTTP headers without requiring server session storage. |
| **bcryptjs** | Password Hashing | One-way salt-hashed passwords using Blowfish cipher; protects user credentials against rainbow table attacks. |
| **Custom LocalStore / MongoDB** | Database Persistence | Flexible JSON schema flexibility; zero-setup local persistence for instant demo execution with 1-to-1 MongoDB query abstraction. |

---

## 6. Database Design

The database consists of 5 core entities managed via `LocalStore` (stored in `server/data_store/` as persistent JSON files):

### 1. `Users` Collection (`users.json`)
Stores registered platform accounts, authentication credentials, and user gamification state.
- `_id` *(String, Primary Key)*: Unique user identifier (e.g., `user_student_demo`).
- `name` *(String)*: User full name.
- `email` *(String, Unique)*: Lowercased email address used for sign in.
- `password` *(String)*: Salting & hashed password string via bcrypt.
- `role` *(String)*: Account privilege level (`student`, `instructor`, `admin`).
- `avatar` *(String)*: Profile picture SVG/PNG image URL.
- `bio` *(String)*: Short biography description.
- `xp` *(Number)*: Accumulated Experience Points (default: `100`).
- `badges` *(Array of Strings)*: Unlocked achievement badges (e.g., `['Fast Learner', 'Quiz Master']`).
- `enrolledCourses` *(Array of Strings)*: Array of course IDs enrolled by this user.
- `createdAt` / `updatedAt` *(ISODate String)*: Timestamp tracking.

### 2. `Courses` Collection (`courses.json`)
Stores course catalog metadata, instructor details, curriculum modules, lessons, and embedded module quizzes.
- `_id` *(String, Primary Key)*: Unique course identifier (e.g., `course_react_101`).
- `title` *(String)*: Course title.
- `description` *(String)*: Detailed course summary.
- `category` *(String)*: Subject category (`Web Development`, `Backend Development`, `Design`, `Data Science`).
- `level` *(String)*: Skill level (`Beginner`, `Intermediate`, `Advanced`).
- `price` *(Number)*: Course enrollment price in USD (default: `49.99`).
- `thumbnail` *(String)*: Banner image URL.
- `instructor` *(Object)*: Embedded object containing `{ id, name, avatar }`.
- `rating` *(Number)*: Computed average star rating (e.g., `4.9`).
- `totalRatings` *(Number)*: Total count of submitted student reviews.
- `totalStudents` *(Number)*: Total count of enrolled learners.
- `modules` *(Array of Objects)*: List of modules, each containing:
  - `id` *(String)*: Module ID.
  - `title` *(String)*: Module title.
  - `lessons` *(Array)*: Objects containing `{ id, title, duration, videoUrl, description, resources }`.
  - `quiz` *(Object)*: Embedded quiz containing `{ id, title, passingScore, questions }`.

### 3. `Progress` Collection (`progress.json`)
Tracks a student's individual learning progress per enrolled course.
- `_id` *(String, Primary Key)*: Progress record identifier.
- `userId` *(String, Foreign Key -> Users)*: Enrolled student ID.
- `courseId` *(String, Foreign Key -> Courses)*: Enrolled course ID.
- `completedLessons` *(Array of Strings)*: Array of completed lesson IDs.
- `videoTimestamps` *(Object)*: Key-value map of `{ lessonId: secondsWatched }`.
- `quizScores` *(Object)*: Key-value map of `{ quizId: percentageScore }`.
- `completionPercentage` *(Number)*: Percentage completion (`0` to `100`).
- `isCompleted` *(Boolean)*: `true` if completion reaches 100%.
- `enrolledAt` / `completedAt` *(ISODate String)*: Timestamp tracking.

### 4. `Reviews` Collection (`reviews.json`)
Stores student ratings and feedback comments for courses.
- `_id` *(String, Primary Key)*: Review identifier.
- `courseId` *(String, Foreign Key -> Courses)*: Target course ID.
- `userId` *(String, Foreign Key -> Users)*: Reviewer user ID.
- `userName` / `userAvatar` *(String)*: Snapshot reviewer information.
- `rating` *(Number)*: Rating score (`1` to `5`).
- `comment` *(String)*: Review comment text.
- `createdAt` *(ISODate String)*: Timestamp.

### 5. `Discussions` Collection (`discussions.json`)
Stores Q&A forum discussion threads and replies per course.
- `_id` *(String, Primary Key)*: Post identifier.
- `courseId` *(String, Foreign Key -> Courses)*: Target course ID.
- `title` *(String)*: Question title.
- `content` *(String)*: Detailed question description.
- `author` *(Object)*: Author details `{ id, name, avatar, role }`.
- `replies` *(Array of Objects)*: List of reply objects `{ _id, content, author, createdAt }`.
- `createdAt` *(ISODate String)*: Timestamp.

---

## 7. Module Description

### Module 1: User Authentication & Profile Management
- **Endpoints**: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, `PUT /api/auth/profile`.
- **Features**: User registration with auto-avatar generation, bcrypt password hashing, JWT generation (expires in 30 days), 1-click demo logins for Instant Student/Instructor access, profile bio editing, avatar customization, and XP/badge stats counter.

### Module 2: Course Catalog & Search Engine
- **Endpoints**: `GET /api/courses`, `GET /api/courses/:id`.
- **Features**: Filter by category pills, difficulty dropdowns, sort by rating/popularity/newest, real-time keyword search across title, description, and instructor fields.

### Module 3: Video Learning Workspace & Progress Tracker
- **Endpoints**: `POST /api/progress/enroll`, `GET /api/progress/:courseId`, `POST /api/progress/update`.
- **Features**: Custom HTML5 video player with playback speed selector (`0.75x`–`2.0x`), watch position saving every 5 seconds, auto-completion trigger at >90% video view, downloadable lesson cheat sheets, and sidebar module navigation.

### Module 4: Quiz Evaluation System
- **Endpoints**: `POST /api/quizzes/submit`.
- **Features**: Interactive modal supporting Multiple Choice, True/False, and Fill-in-the-Blanks questions. Evaluates string normalization, returns immediate percentage score, awards XP points upon passing (>60%), and allows retakes.

### Module 5: Printable Certificate Generator
- **Features**: Client-side printable PDF modal rendered when a user reaches 100% completion. Displays recipient name, course title, verification ID (`EDU-XXXXXX`), lead instructor signature, and gold medal badge.

### Module 6: Reviews & Ratings Module
- **Endpoints**: `GET /api/reviews/:courseId`, `POST /api/reviews/:courseId`, `DELETE /api/reviews/:id`.
- **Features**: 5-star interactive picker, student comments, deletion authorization checks, and automatic recalculation of course average rating.

### Module 7: Discussion Board & Leaderboard
- **Endpoints**: `GET /api/discussions/:courseId`, `POST /api/discussions/:courseId`, `POST /api/discussions/:id/reply`, `GET /api/discussions/leaderboard`.
- **Features**: Course Q&A forum with author role tags (*Instructor* / *Student*), nested replies, and Hall of Fame Leaderboard featuring top 3 podium display sorted by total XP.

### Module 8: Instructor Studio & Course Builder
- **Endpoints**: `POST /api/courses`, `PUT /api/courses/:id`, `DELETE /api/courses/:id`.
- **Features**: Analytics for published courses, total enrolled students, estimated sales revenue, and course authoring modal with video stream URL inputs.

---

## 8. AI Feature Explanation (EduPulse AI Tutor)

### Architecture & Endpoint
The AI feature is exposed via the **`POST /api/ai/ask`** API endpoint and accessed on the frontend via the floating **`AITutorModal`** component.

### Implementation Logic
1. **Request Payload**: Accepts `{ question, courseTitle, lessonTitle }` from the client.
2. **Contextual Analysis**: The backend controller evaluates the incoming natural language query against domain knowledge patterns:
   - **React/Frontend Queries**: Triggers tailored explanations covering React components, hooks (`useState`, `useEffect`), state immutability, and Virtual DOM reconciliation.
   - **Backend/API Queries**: Responds with Node.js, Express middleware pipeline, and JWT authorization concepts.
   - **Quiz & Grading Queries**: Explains assessment criteria, retake policies, and passing score thresholds (>60%).
   - **Certificate & Progress Queries**: Details 100% completion requirements and PDF credential generation.
3. **Latency Simulation**: Simulates a `400ms` asynchronous latency delay to mimic natural generative AI processing before returning the structured response.
4. **Structured Response Payload**:
   ```json
   {
     "question": "How does useState work?",
     "answer": "In React, state represents data that changes over time...",
     "suggestedTopics": [
       "How to earn XP & Badges",
       "Where to download lesson resources",
       "Course completion requirements"
     ]
   }
   ```

---

## 9. Security Implementation

### Authentication & Authorization Pipeline
```text
  Client Request (Bearer JWT Token in Authorization Header)
                            |
                            v
               +--------------------------+
               |   authMiddleware protect  |
               +--------------------------+
                            |
        +-------------------+-------------------+
        | Valid Token?                          | Invalid / Missing
        v                                       v
  +------------------+                 +--------------------+
  | Verify via JWT   |                 | 401 Unauthorized   |
  | Secret Key       |                 | "Token invalid/exp"|
  +--------+---------+                 +--------------------+
           |
           v
  +------------------+
  | Fetch User from  |
  | LocalStore       |
  +--------+---------+
           |
           v
  +------------------+
  | Strip Password   |
  | Attach req.user  |
  +--------+---------+
           |
           v
  +------------------+
  | instructorOnly   | --> (Role === 'instructor' || 'admin' ?)
  | Middleware Check |     YES: next() | NO: 403 Forbidden
  +------------------+
```

1. **Password Hashing**: Passwords are never stored in plain text. When registering, `bcrypt.genSalt(10)` generates a salt and `bcrypt.hash(password, salt)` creates a secure one-way hash.
2. **JWT Session Tokens**: Login issues a signed JWT containing `{ id: user._id }` signed with a secret key (`JWT_SECRET`) with a 30-day expiration.
3. **Protected Routes Middleware**: `protect` extracts the Bearer token from the `Authorization` header, verifies signature via `jwt.verify`, looks up the user, strips password hash, and attaches identity to `req.user`.
4. **Role-Based Privilege Enforcement**: `instructorOnly` middleware inspects `req.user.role` to restrict course creation, modification, and deletion to authorized instructors/admins.

---

## 10. Deployment Architecture

### Frontend Deployment (Vercel)
- **Framework Preset**: Vite React.
- **Build Command**: `npm --prefix client run build` (outputs to `client/dist`).
- **Rewrites Config**: All routes rewritten to `index.html` for single-page app routing.

### Backend Deployment (Render / Railway / Node.js)
- **Environment Variables**: `PORT=5000`, `NODE_ENV=production`, `JWT_SECRET=super_secret_key`.
- **Start Command**: `node server/server.js`.
- **Database Persistence**: Automatic file persistence in `./server/data_store/*.json` or connection string update to MongoDB Atlas (`MONGODB_URI`).

---

## 11. Future Enhancements

1. **Live Video Streaming & WebRTC Classes**: Integrate WebRTC / Agora SDK for real-time live virtual classrooms and Q&A webinars.
2. **Stripe / PayPal Gateway Integration**: Replace mock payment flow with live Stripe PaymentIntents API for real credit card processing.
3. **Cloud Storage Engine (Amazon S3 / Cloudinary)**: Direct multipart file upload integration for instructor video uploads and custom PDF resource storage.
4. **LLM API Integration (OpenAI GPT-4o / Vertex AI)**: Connect `aiController.js` to live OpenAI or Google Vertex AI APIs for dynamic, unbounded conversational AI responses.
5. **Mobile Native Application (React Native)**: Build cross-platform mobile apps for iOS and Android utilizing the existing REST API backend.

---

## 12. Viva Q&A — 25 Evaluator Questions & Detailed Answers

### Technical Choices & Architecture

#### Q1: What architectural pattern does this project follow, and why was React chosen over traditional multi-page rendering?
**Answer**: This project follows a decoupled **Client-Server REST API Architecture** with a Single Page Application (SPA) frontend. React was chosen because of its Virtual DOM reconciliation engine, component-based reusability, and client-side state management. Unlike traditional Multi-Page Applications (MPAs) that require full page reloads for every navigation, React updates only the specific modified DOM nodes, providing a smooth, app-like user experience essential for video learning platforms.

#### Q2: What is Vite and why is it preferred over Create React App (CRA)?
**Answer**: Vite is a modern frontend build tool that leverages native browser ES modules during development. Unlike Create React App (which uses Webpack to bundle the entire application before serving), Vite serves source code instantly over native ESM, providing sub-millisecond Hot Module Replacement (HMR) speeds and significantly faster production builds.

#### Q3: Why did you use Vanilla CSS instead of a utility framework like TailwindCSS?
**Answer**: Vanilla CSS with CSS Custom Properties (`:root` variables) was selected to provide full architectural control over the custom **glassmorphism design system**, dark/light mode token toggling, custom scrollbars, and keyframe animations without adding heavy build utility abstractions or class name pollution.

---

### Backend & Database

#### Q4: How does your database abstraction (`LocalStore`) work, and how can it be transitioned to MongoDB?
**Answer**: `LocalStore` is a custom lightweight persistence layer implemented in `server/config/db.js`. It reads and writes JSON documents to disk using Node.js `fs` file operations and implements standard database CRUD methods (`find`, `findOne`, `findById`, `insertOne`, `updateOne`, `deleteOne`). It mirrors MongoDB method signatures 1-to-1, allowing developers to switch to Mongoose/MongoDB Atlas simply by swapping the export in `config/db.js` with `mongoose.connect()`.

#### Q5: How is data persisted when the Express server restarts?
**Answer**: Whenever a mutation occurs (e.g., `insertOne`, `updateOne`, `deleteOne`), `LocalStore` calls `this.save()`, which uses `fs.writeFileSync()` to synchronously flush the updated in-memory JSON array to file storage (`server/data_store/<collection>.json`). Upon server startup, `this.load()` reads the stored JSON files back into memory.

#### Q6: How does the seed data script function?
**Answer**: `server/data/seedData.js` checks if the `Courses` collection contains records on server launch (`connectDB().then(seedData)`). If empty, it hashes default passwords via `bcrypt`, populates initial demo users (*Alex Rivera* and *Dr. Sarah Jenkins*), creates sample courses with full module curriculums, inserts sample reviews, and seeds discussion threads.

---

### Authentication & Security

#### Q7: How is user authentication handled securely?
**Answer**: Authentication is implemented using **JSON Web Tokens (JWT)** and **bcryptjs password hashing**. During registration, plain text passwords are salted (`genSalt(10)`) and hashed before saving. Upon login, `bcrypt.compare()` verifies credentials. If valid, the server returns a signed JWT token containing the user ID. The client stores this token in `localStorage` and includes it in the `Authorization: Bearer <token>` header of subsequent API requests.

#### Q8: What happens if an unauthenticated user attempts to access a protected API endpoint?
**Answer**: The request passes through `authMiddleware.js` (`protect` function). If the `Authorization` header is missing or does not start with `Bearer`, or if `jwt.verify()` fails due to an invalid/expired token, the middleware immediately halts the request pipeline and returns an HTTP `401 Unauthorized` response with `{ message: 'Not authorized, token missing' }`.

#### Q9: How are instructor privileges enforced on the server?
**Answer**: Routes that modify courses (`POST /api/courses`, `PUT /api/courses/:id`, `DELETE /api/courses/:id`) pass through two chained middleware functions: `protect` (which verifies identity and attaches `req.user`) followed by `instructorOnly`. The `instructorOnly` middleware checks if `req.user.role === 'instructor' || req.user.role === 'admin'`. If false, it returns an HTTP `403 Forbidden` status.

#### Q10: Why is storing passwords as plain text dangerous, and how does bcrypt prevent attacks?
**Answer**: Plain text passwords expose user credentials if the database is leaked. Bcrypt uses a slow, one-way Blowfish hashing algorithm combined with a unique salt per password. The salt prevents **Rainbow Table attacks** (precomputed hash tables), and the computational cost factor makes brute-force attacks computationally infeasible.

---

### Core LMS Features & Progress Tracking

#### Q11: How does video watch progress tracking work on the frontend and backend?
**Answer**: The custom `VideoPlayer.jsx` component listens to HTML5 `<video>` `onTimeUpdate` events. Every 5 seconds, it invokes `onTimeUpdate(currentTime)`, sending a `POST /api/progress/update` request with `{ courseId, lessonId, timestamp }`. The backend updates the user's `videoTimestamps` map in `progress.json`. When the video position exceeds 90% of total duration, it triggers `onComplete()`, adding the lesson ID to `completedLessons` and recalculating completion percentage.

#### Q12: How is course completion percentage calculated?
**Answer**: In `progressController.js`, the total number of lessons across all course modules is computed (`totalLessonsCount`). The completion percentage is calculated as:
$$\text{Completion Percentage} = \min\left(100, \text{Math.round}\left(\frac{\text{Completed Lessons Count}}{\text{Total Lessons Count}} \times 100\right)\right)$$
When this reaches 100%, `isCompleted` is set to `true`, and completion date is recorded.

#### Q13: How does auto-grading for quizzes work?
**Answer**: In `quizController.js`, `submitQuiz` compares student submitted answers against the quiz's `correctAnswer` key stored in the course module. For text inputs (fill-in-the-blank), answers are normalized using `.trim().toLowerCase()`. Correct answers increment `correctCount`. Score percentage is calculated, and if `score >= passingScore` (e.g. 60%), XP points are awarded to the user profile and recorded in `progress.json`.

#### Q14: How are certificates generated and verified?
**Answer**: Certificates are rendered client-side using `CertificateModal.jsx` when a course reaches 100% completion. A unique credential verification ID is generated using the pattern `EDU-<COURSE_ID_PREFIX>-<RANDOM_DIGITS>`. The component renders a high-resolution printable layout containing recipient name, issue date, instructor signature, and gold seal, which can be printed or saved directly as a PDF via `window.print()`.

#### Q15: How does the star rating system recalculate average ratings?
**Answer**: In `reviewController.js`, whenever a student submits or deletes a review, the backend fetches all reviews matching `courseId`, sums their rating values, computes the arithmetic mean:
$$\text{Average Rating} = \frac{\sum \text{Ratings}}{\text{Total Reviews Count}}$$
The result is rounded to 1 decimal place and updated directly on the `Course` record (`rating` and `totalRatings`).

---

### AI Integration & Gamification

#### Q16: How does the AI Tutor Assistant feature work under the hood?
**Answer**: The frontend `AITutorModal` sends user prompts to `POST /api/ai/ask`. The backend `aiController.js` analyzes the prompt's semantic context against domain topic matching (React, Node.js, quizzes, certificates, progress). It generates a structured answer accompanied by suggested follow-up learning topics, simulating asynchronous processing latency before responding.

#### Q17: How is the Leaderboard ranking computed?
**Answer**: `discussionController.js` (`getLeaderboard`) queries all users from `users.json`, maps their XP count, earned badges, and enrolled courses count, and sorts them descending by `user.xp`. The top 20 users are returned to the frontend `LeaderboardPage.jsx`, which renders the Top 3 on an elevated podium (Gold, Silver, Bronze) and the remainder in a ranked table.

#### Q18: How does a student earn XP and badges in the system?
**Answer**: 
- Enrolling / registering grants initial welcome XP (+100 XP).
- Passing module quizzes awards +50 XP plus bonus points proportional to their score percentage.
- Completing 100% of a course awards +250 XP and unlocks the *Course Master* badge.

---

### Frontend State & Theme System

#### Q19: How is theme switching (Dark/Light mode) implemented?
**Answer**: `ThemeContext.jsx` manages theme state initialized from `localStorage.getItem('lms_theme') || 'dark'`. When toggled, it sets the HTML root attribute `document.documentElement.setAttribute('data-theme', theme)`. In `index.css`, CSS variable tokens (`--bg-primary`, `--bg-surface`, `--text-main`) update dynamically across the entire application tree without requiring full component re-renders.

#### Q20: How does `AuthContext` persist user sessions across browser refreshes?
**Answer**: Upon initial mount, `AuthContext.jsx` checks if `localStorage.getItem('lms_token')` exists. If present, it executes an background API call `api.getMe()` with the `Authorization` token header to fetch current user profile data and restore the active state seamlessly.

---

### Scalability, Edge Cases & Limitations

#### Q21: What are the current limitations of the local JSON storage implementation?
**Answer**: `LocalStore` uses synchronous disk operations (`writeFileSync`), which works for single-instance applications or local demonstrations. In high-concurrency production environments with thousands of simultaneous writes, file I/O blocking could occur. Production deployments should replace `LocalStore` with MongoDB Atlas, PostgreSQL, or Redis for transactional locking and horizontal scalability.

#### Q22: How does the application handle video loading performance?
**Answer**: The video player uses HTML5 progressive streaming with MP4 containers and CORS headers, allowing browsers to buffer video chunks incrementally rather than downloading the entire file upfront.

#### Q23: How are unauthorized deletions prevented in reviews and discussions?
**Answer**: In `deleteReview` and discussion handlers, the backend checks:
`if (review.userId !== req.user._id && req.user.role !== 'admin')`
This guarantees that users can only modify or delete their own authored content unless they hold administrator privileges.

#### Q24: How would you scale this platform to support 100,000 active students?
**Answer**:
1. **Database Layer**: Migrate `LocalStore` to MongoDB Atlas with database indexing on `courseId`, `userId`, and `email`.
2. **Media Storage**: Offload video files and PDF assets to an Amazon S3 / Cloudinary CDN edge network.
3. **Caching Layer**: Implement Redis caching for course catalog listings and leaderboard query results.
4. **Load Balancing**: Deploy stateless Node.js Express server instances behind an NGINX or AWS ALB load balancer.

#### Q25: What steps ensure responsive UI layout across mobile, tablet, and desktop devices?
**Answer**: The design system uses CSS Grid with `repeat(auto-fill, minmax(300px, 1fr))` for course cards, Flexbox containers with wrap flexibility, fluid typography using `rem`/`em` units, and CSS media queries (`@media (max-width: 768px)`) that adjust sidebar layouts, text sizes, and touch targets for mobile devices.
