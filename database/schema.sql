BEGIN;

-- Create ENUM types
CREATE TYPE lms_role_type AS ENUM ('ADMIN', 'INSTRUCTOR', 'STUDENT');
CREATE TYPE course_status AS ENUM ('Pending', 'Active', 'Completed', 'Cancelled');
CREATE TYPE enrollment_type AS ENUM ('Active', 'Completed', 'Dropped', 'Pending');
CREATE TYPE material_type AS ENUM ('Video', 'Document', 'Quiz', 'Assignment', 'Link');

-- 1. Create Role Type Table
CREATE TABLE Role
(
    id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name lms_role_type NOT NULL UNIQUE
);

-- 2. Create Users Table
CREATE TABLE User
(
    id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username     VARCHAR(100)        NOT NULL,
    role_id UUID NOT NULL,
    email    VARCHAR(255) UNIQUE NOT NULL,
    password          VARCHAR(255)        NOT NULL,
    address           TEXT,
    phone_number      VARCHAR(100),
    email_verified    BOOLEAN          DEFAULT FALSE,
    registration_date DATE             DEFAULT CURRENT_DATE,
    created_at        TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_role FOREIGN KEY (role_id)
        REFERENCES Role (id) ON DELETE RESTRICT
);

-- 3. Course Category
CREATE TABLE Course_Category
(
    id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description   TEXT,
    created_at    TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP
);

-- 4. Course
CREATE TABLE Course
(
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title       VARCHAR(150) NOT NULL,
    description        TEXT,
    instructor_id      UUID         NOT NULL,
    overall_rating     INT,
    course_category_id    UUID         NOT NULL,
    status             course_status    DEFAULT 'Pending',
    duration_day_count INT,
    created_at         TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    updated_at         TIMESTAMP,
    CONSTRAINT fk_course_category FOREIGN KEY (course_category_id)
        REFERENCES Course_Category (id),
    CONSTRAINT fk_course_instructor FOREIGN KEY (instructor_id)
        REFERENCES User (id)
);

-- 5. Enrollment
CREATE TABLE enrollment
(
    id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id      UUID            NOT NULL,
    course_id       UUID            NOT NULL,
    enrollment_date TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    progress        DECIMAL,
    status          enrollment_type NOT NULL,
    due_date        TIMESTAMP,
    created_at      TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP,
    CONSTRAINT fk_enrollment_student FOREIGN KEY (student_id)
        REFERENCES User (id) ON DELETE CASCADE,
    CONSTRAINT fk_enrollment_course FOREIGN KEY (course_id)
        REFERENCES Course (id) ON DELETE CASCADE
);

-- 6. Certificate
CREATE TABLE Certificate
(
    id  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enrollment_id   UUID UNIQUE NOT NULL,
    issue_date      TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    certificate_url VARCHAR(500),
    created_at      TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP,
    CONSTRAINT fk_certificate_enrollment FOREIGN KEY (enrollment_id)
        REFERENCES enrollment (id) ON DELETE CASCADE
);

-- 7. Rating
CREATE TABLE Rating
(
    id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID NOT NULL,
    course_id    UUID NOT NULL,
    rating_count INT CHECK (rating_count >= 1 AND rating_count <= 5),
    created_at   TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP,
    CONSTRAINT fk_rating_user FOREIGN KEY (user_id)
        REFERENCES User (id) ON DELETE CASCADE,
    CONSTRAINT fk_rating_course FOREIGN KEY (course_id)
        REFERENCES Course (id) ON DELETE CASCADE,
    UNIQUE (user_id, course_id)
);

-- 8. Module
CREATE TABLE Module
(
    id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    course_id   UUID         NOT NULL,
    description TEXT,
    created_at  TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP,
    CONSTRAINT fk_module_course FOREIGN KEY (course_id)
        REFERENCES Course (id) ON DELETE CASCADE
);

-- 9. Quiz
CREATE TABLE Quiz
(
    id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title      TEXT NOT NULL,
    module_id  UUID NOT NULL,
    created_at TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT fk_quiz_module FOREIGN KEY (module_id)
        REFERENCES Module (id) ON DELETE CASCADE
);

-- 10. Question
CREATE TABLE Question
(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question    TEXT NOT NULL,
    quiz_id     UUID NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP,
    CONSTRAINT  fk_question_quiz FOREIGN KEY (quiz_id)
    REFERENCES  Quiz (id) ON DELETE CASCADE
);

-- 11. Answer
CREATE TABLE Answer
(
    id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    answer      TEXT NOT NULL,
    is_correct  BOOLEAN DEFAULT FALSE,
    question_id UUID NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP,
    CONSTRAINT fk_answer_question FOREIGN KEY (question_id)
    REFERENCES Question (id) ON DELETE CASCADE
);

-- 12. Student Quiz
CREATE TABLE Student_Quiz
(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id      UUID NOT NULL,
    quiz_id         UUID NOT NULL,
    score           INT,
    attempt         INT              DEFAULT 1,
    created_at      TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP,
    CONSTRAINT fk_student_quiz_student FOREIGN KEY (student_id)
        REFERENCES User (id) ON DELETE CASCADE,
    CONSTRAINT fk_student_quiz_quiz FOREIGN KEY (quiz_id)
        REFERENCES Quiz (id) ON DELETE CASCADE
);

-- 13. Lesson
CREATE TABLE Lesson
(
    id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title         VARCHAR(200) NOT NULL,
    content       TEXT,
    material_type material_type,
    module_id     UUID         NOT NULL,
    created_at    TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP,
    CONSTRAINT fk_lesson_module FOREIGN KEY (module_id)
        REFERENCES Module (id) ON DELETE CASCADE
);

-- (Optional)
-- 14. Assignment
CREATE TABLE Assignment
(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id     UUID         NOT NULL,
    title         VARCHAR(200) NOT NULL,
    instructions  TEXT,
    created_at    TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP,
    CONSTRAINT fk_assignment_course FOREIGN KEY (course_id)
        REFERENCES Course (id) ON DELETE CASCADE
);

-- 15. Submission
CREATE TABLE Submission
(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL,
    student_id    UUID NOT NULL,
    submitted_at  TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    file_url      VARCHAR(500),
    created_at    TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP,
    CONSTRAINT fk_submission_assignment FOREIGN KEY (assignment_id)
        REFERENCES Assignment (id) ON DELETE CASCADE,
    CONSTRAINT fk_submission_student FOREIGN KEY (student_id)
        REFERENCES User (id) ON DELETE CASCADE
);

-- 16. Review
CREATE TABLE Review
(
    id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id   UUID NOT NULL,
    user_id     UUID NOT NULL,
    title       VARCHAR(200),
    description TEXT,
    created_at  TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP,
    CONSTRAINT fk_review_course FOREIGN KEY (course_id)
        REFERENCES Course (id) ON DELETE CASCADE,
    CONSTRAINT fk_review_user FOREIGN KEY (user_id)
        REFERENCES User (id) ON DELETE CASCADE
);


COMMIT;
