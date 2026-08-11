# Requirements Document

## Introduction

The MBC Profile Management Module adds comprehensive profile management capabilities to the Madurai Bible College application. It extends the existing `User` entity with role-specific profile data (student and teacher), supports profile photo upload to the server filesystem, provides change-password functionality, and gives admins a searchable, paginated directory of student and teacher profiles. The module integrates with the existing Spring Boot 3 / Angular 17 stack, follows all established patterns (JWT auth, `@PreAuthorize`, `PageResponse<T>`, `ApiResponse`, `BusinessException`, reactive Angular forms, Angular Material), and does not modify any working functionality.

---

## Glossary

- **User**: The existing `users` table entity that holds authentication credentials, role, and display name.
- **UserProfile**: A new entity that stores common personal, contact, and preference data for every user, linked 1-to-1 with `User`.
- **StudentProfile**: A new entity that stores student-specific academic, church/ministry, and guardian data, linked 1-to-1 with `User`.
- **TeacherProfile**: A new entity that stores teacher-specific employment and church/ministry data, linked 1-to-1 with `User`.
- **ProfileService**: The backend service interface and implementation that handles profile read/write operations.
- **FileStorageService**: A new backend service that manages profile photo storage on the server filesystem under `${DP_FOLDER}/profiles/`.
- **ProfileController**: The backend REST controller exposing `/api/profile/**` endpoints for the authenticated user.
- **AdminProfileController**: The backend REST controller exposing `/api/admin/profiles/**` endpoints for admin users.
- **ProfileComponent**: The Angular component rendered at `/student/profile` and `/teacher/profile` routes.
- **AdminProfilesComponent**: The Angular component rendered at `/admin/profiles` route.
- **DP_FOLDER**: An environment variable that specifies the root directory for profile photo storage (e.g., `D:\MBCData`).
- **ProfilePhotoPath**: The relative path stored in the database, e.g., `students/12345.jpg` or `teachers/67890.jpg`.
- **PageResponse**: The existing generic paginated response DTO already used throughout the backend.
- **ApiResponse**: The existing `{ message, success }` response DTO already used throughout the backend.

---

## Requirements

### Requirement 1: Common User Profile — Personal & Contact Information

**User Story:** As a logged-in user (student, teacher, or admin), I want to view and update my personal and contact information, so that the college has accurate records about me.

#### Acceptance Criteria

1. THE `ProfileService` SHALL expose a `getUserProfile(username)` method that returns a `UserProfileDto` containing: `firstName`, `lastName`, `preferredName`, `gender`, `dateOfBirth`, `maritalStatus`, `profilePhotoPath`, `primaryMobile`, `alternateMobile`, `personalEmail`, `permanentAddress`, `emergencyContactName`, `emergencyContactRelationship`, `emergencyContactPhone`, `languagePreference`, `username`, `role`, `accountStatus`, `createdAt`.
2. WHEN a user sends `GET /api/profile/me`, THE `ProfileController` SHALL return the authenticated user's `UserProfileDto` with HTTP 200.
3. WHEN a user sends `PUT /api/profile/me` with a valid request body, THE `ProfileController` SHALL update the `UserProfile` record and return the updated `UserProfileDto` with HTTP 200.
4. IF the `UserProfile` record does not exist for a user, THEN THE `ProfileService` SHALL create a new `UserProfile` record with default empty values before returning.
5. THE `UserProfile` entity SHALL be linked to `User` via a `@OneToOne` JPA relationship with `CascadeType.ALL` and `orphanRemoval = true`.
6. THE `UserProfile` entity SHALL include audit fields: `createdAt` (set on `@PrePersist`) and `updatedAt` (set on `@PreUpdate`).
7. WHEN a `PUT /api/profile/me` request contains a `primaryMobile` value that is not 10 digits, THE `ProfileController` SHALL return HTTP 400 with a validation error message.
8. WHEN a `PUT /api/profile/me` request contains a `personalEmail` value that is not a valid email format, THE `ProfileController` SHALL return HTTP 400 with a validation error message.

---

### Requirement 2: Student Profile — Academic, Church/Ministry & Guardian Information

**User Story:** As a student, I want to view my academic information and update my church/ministry and guardian details, so that the college has complete records about my background and family.

#### Acceptance Criteria

1. THE `ProfileService` SHALL expose a `getStudentProfile(username)` method that returns a `StudentProfileDto` containing all `UserProfileDto` fields plus: `studentId`, `admissionNumber`, `batch`, `academicYear`, `program`, `semester`, `admissionDate`, `homeChurch`, `churchDenomination`, `baptized`, `ministryExperience`, `ministryInterests`, `callingTestimony`, `fatherName`, `motherName`, `guardianName`, `guardianRelationship`, `guardianPhone`.
2. WHEN a student sends `GET /api/profile/me`, THE `ProfileController` SHALL return the `StudentProfileDto` for that student.
3. WHEN a student sends `PUT /api/profile/me` with church/ministry or guardian fields, THE `ProfileController` SHALL perform a partial update — updating only the field categories present in the request body — in `StudentProfile` and `UserProfile`.
4. IF a student sends `PUT /api/profile/me` with academic fields (`studentId`, `admissionNumber`, `batch`, `academicYear`, `program`, `semester`, `admissionDate`), THEN THE `ProfileController` SHALL silently ignore those fields and process the rest of the request normally.
5. THE `StudentProfile` entity SHALL be linked to `User` via a `@OneToOne` JPA relationship with `CascadeType.ALL` and `orphanRemoval = true`.
6. IF the `StudentProfile` record does not exist for a student user and the user sends a `GET /api/profile/me` or `PUT /api/profile/me` request, THEN THE `ProfileService` SHALL create a new `StudentProfile` record with default empty values before returning.

---

### Requirement 3: Teacher Profile — Employment & Church/Ministry Information

**User Story:** As a teacher, I want to view my employment information and update my church/ministry details, so that the college has accurate records about my ministry background.

#### Acceptance Criteria

1. THE `ProfileService` SHALL expose a `getTeacherProfile(username)` method that returns a `TeacherProfileDto` containing all `UserProfileDto` fields plus: `employeeId`, `designation`, `employmentType`, `homeChurch`, `churchDenomination`, `baptized`, `ministryExperience`, `ministryInterests`, `callingTestimony`.
2. WHEN a teacher sends `GET /api/profile/me`, THE `ProfileController` SHALL return the `TeacherProfileDto` for that teacher.
3. WHEN a teacher sends `PUT /api/profile/me` with church/ministry fields, THE `ProfileController` SHALL update only the editable fields in `TeacherProfile` and `UserProfile`.
4. IF a teacher sends `PUT /api/profile/me` with employment fields (`employeeId`, `designation`, `employmentType`), THEN THE `ProfileController` SHALL silently ignore those fields and process the rest of the request normally.
5. THE `TeacherProfile` entity SHALL be linked to `User` via a `@OneToOne` JPA relationship with `CascadeType.ALL` and `orphanRemoval = true`.
6. IF the `TeacherProfile` record does not exist for a teacher user and the user sends a `GET /api/profile/me` or `PUT /api/profile/me` request, THEN THE `ProfileService` SHALL create a new `TeacherProfile` record with default empty values before returning.

---

### Requirement 4: Profile Photo Upload & Retrieval

**User Story:** As a user, I want to upload and view my profile photo, so that my profile is visually identifiable in the system.

#### Acceptance Criteria

1. THE `FileStorageService` SHALL store uploaded profile photos on the server filesystem under `${DP_FOLDER}/profiles/students/` for students and `${DP_FOLDER}/profiles/teachers/` for teachers.
2. WHEN the target directory does not exist, THE `FileStorageService` SHALL create the directory path before saving the file.
3. THE `FileStorageService` SHALL generate a unique filename using the user's ID and a UUID suffix (e.g., `12345_a1b2c3.jpg`) to prevent collisions.
4. WHEN a user uploads a new photo and a previous photo file exists, THE `FileStorageService` SHALL delete the old file before saving the new one.
5. THE `FileStorageService` SHALL validate that the uploaded file's MIME type is one of: `image/jpeg`, `image/png`, `image/gif`, `image/webp`.
6. THE `FileStorageService` SHALL validate that the uploaded file size does not exceed 5 MB.
7. IF the uploaded file fails MIME type validation OR size validation (either condition alone is sufficient), THEN THE `ProfileController` SHALL return HTTP 400 with a descriptive error message.
8. WHEN a user sends `POST /api/profile/photo` with a valid multipart file, THE `ProfileController` SHALL save the file, update `UserProfile.profilePhotoPath` with the relative path, and return HTTP 200 with the updated relative path.
9. WHEN a request is made to `GET /api/profile/photo/{userId}`, THE `ProfileController` SHALL return the photo file as a byte stream with the correct `Content-Type` header.
10. IF no profile photo exists for the requested user, THEN THE `ProfileController` SHALL return HTTP 404.
11. WHILE a user is authenticated, THE `ProfileController` SHALL only allow `GET /api/profile/photo/{userId}` for the requesting user's own ID or for users with the `ADMIN` role; IF the requesting user is neither the owner nor an admin, THE `ProfileController` SHALL return HTTP 403 with no exceptions for shared contexts.
12. THE `UserProfile` entity SHALL store only the relative `profilePhotoPath` (e.g., `students/12345_abc.jpg`), not the absolute filesystem path.

---

### Requirement 5: Security Settings — Change Password

**User Story:** As a user, I want to change my password securely, so that I can maintain the security of my account.

#### Acceptance Criteria

1. WHEN a user sends `PUT /api/profile/change-password` with `currentPassword`, `newPassword`, and `confirmPassword`, THE `ProfileController` SHALL verify the current password against the stored BCrypt hash.
2. IF the `currentPassword` does not match the stored hash, THEN THE `ProfileController` SHALL return HTTP 400 with the message "Current password is incorrect."
3. IF `newPassword` and `confirmPassword` do not match, THEN THE `ProfileController` SHALL return HTTP 400 with the message "New password and confirm password do not match."
4. IF `newPassword` is fewer than 8 characters, THEN THE `ProfileController` SHALL return HTTP 400 with the message "Password must be at least 8 characters."
5. IF `newPassword` is the same as `currentPassword`, THEN THE `ProfileController` SHALL return HTTP 400 with the message "New password must be different from the current password."
6. WHEN all validations pass, THE `ProfileService` SHALL encode the new password using `BCryptPasswordEncoder` and persist it to the `User` entity.
7. WHEN the password is successfully changed, THE `ProfileController` SHALL return HTTP 200 with `ApiResponse { message: "Password changed successfully.", success: true }`.

---

### Requirement 6: Admin Profile Directory — Student & Teacher Cards

**User Story:** As an admin, I want to browse a paginated directory of student and teacher profile cards, so that I can quickly find and manage any user's profile.

#### Acceptance Criteria

1. WHEN an admin sends `GET /api/admin/profiles` with optional query parameters `role`, `name`, `academicYear`, `semester`, `batch`, `program`, `page`, `size`, `sort`, THE `AdminProfileController` SHALL return a `PageResponse<ProfileCardDto>` with HTTP 200.
2. THE `ProfileCardDto` for a student SHALL contain: `userId`, `fullName`, `profilePhotoPath`, `batch`, `academicYear`, `program`, `role`.
3. THE `ProfileCardDto` for a teacher SHALL contain: `userId`, `fullName`, `profilePhotoPath`, `designation`, `employmentType`, `role`.
4. WHEN the `role` filter is `STUDENT`, THE `AdminProfileController` SHALL return only student profile cards; IF the filter yields no results, THE `AdminProfileController` SHALL return an empty list rather than falling back to all profiles.
5. WHEN the `role` filter is `TEACHER`, THE `AdminProfileController` SHALL return only teacher profile cards; IF the filter yields no results, THE `AdminProfileController` SHALL return an empty list rather than falling back to all profiles.
6. WHEN the `name` filter is provided, THE `AdminProfileController` SHALL perform a case-insensitive partial match on the user's full name.
7. THE `AdminProfileController` SHALL use server-side pagination via Spring Data's `Pageable` with a default page size of 12.
8. THE `AdminProfileController` SHALL be secured with `@PreAuthorize("hasRole('ADMIN')")`.

---

### Requirement 7: Admin — View & Edit Student Profile

**User Story:** As an admin, I want to view and edit a student's full profile including academic information, so that I can maintain accurate academic records.

#### Acceptance Criteria

1. WHEN an admin sends `GET /api/admin/students/{id}`, THE `AdminProfileController` SHALL return the full `StudentProfileDto` for the specified student with HTTP 200.
2. IF the specified student ID does not exist or the user is not a student, THEN THE `AdminProfileController` SHALL return HTTP 404 with a `ResourceNotFoundException` message.
3. WHEN an admin sends `PUT /api/admin/students/{id}` with a valid request body, THE `AdminProfileController` SHALL update all fields in `UserProfile` and `StudentProfile` including academic fields, and return the updated `StudentProfileDto` with HTTP 200.
4. THE `AdminProfileController` SHALL be secured with `@PreAuthorize("hasRole('ADMIN')")` for all admin student endpoints.

---

### Requirement 8: Admin — View & Edit Teacher Profile

**User Story:** As an admin, I want to view and edit a teacher's full profile including employment information, so that I can maintain accurate staff records.

#### Acceptance Criteria

1. WHEN an admin sends `GET /api/admin/teachers/{id}`, THE `AdminProfileController` SHALL return the full `TeacherProfileDto` for the specified teacher with HTTP 200.
2. IF the specified teacher ID does not exist or the user is not a teacher, THEN THE `AdminProfileController` SHALL return HTTP 404 with a `ResourceNotFoundException` message.
3. WHEN an admin sends `PUT /api/admin/teachers/{id}` with a valid request body, THE `AdminProfileController` SHALL update all fields in `UserProfile` and `TeacherProfile` including employment fields, and return the updated `TeacherProfileDto` with HTTP 200.
4. THE `AdminProfileController` SHALL be secured with `@PreAuthorize("hasRole('ADMIN')")` for all admin teacher endpoints.

---

### Requirement 9: Frontend — Student Profile Page

**User Story:** As a student, I want a dedicated profile page in the student portal, so that I can view and update my information in a structured, user-friendly layout.

#### Acceptance Criteria

1. THE `ProfileComponent` at `/student/profile` SHALL display the following sections using Angular Material expansion panels or tabs: Personal Information, Contact Information, Academic Information (read-only), Church & Ministry Information, Guardian Information, Preferences, Security Settings, Account Information (read-only).
2. THE `ProfileComponent` SHALL use Angular Reactive Forms for all editable sections.
3. WHEN the profile page loads, THE `ProfileComponent` SHALL call the profile API and populate all form fields with the returned data.
4. WHEN a student submits an editable section, THE `ProfileComponent` SHALL call `PUT /api/profile/me` and display a success or error snackbar using Angular Material `MatSnackBar`.
5. THE `ProfileComponent` SHALL display a profile photo with a loading indicator while the image is fetching.
6. WHEN no profile photo exists, THE `ProfileComponent` SHALL display a default avatar image.
7. THE `ProfileComponent` SHALL support profile photo upload with a file input that shows a preview before submission.
8. WHEN a student submits a photo upload, THE `ProfileComponent` SHALL call `POST /api/profile/photo` and refresh the displayed photo on success.
9. THE `ProfileComponent` SHALL be responsive and render correctly on mobile, tablet, and desktop viewports following the existing `$mobile: 768px` breakpoint.
10. THE `ProfileComponent` SHALL use the existing Angular Material theme, color variables (`$primary-color: #0056b3`), and component patterns already used in the student module.

---

### Requirement 10: Frontend — Teacher Profile Page

**User Story:** As a teacher, I want a dedicated profile page in the teacher portal, so that I can view and update my information in a structured layout.

#### Acceptance Criteria

1. THE `ProfileComponent` at `/teacher/profile` SHALL display the following sections: Personal Information, Contact Information, Employment Information (read-only), Church & Ministry Information, Preferences, Security Settings, Account Information (read-only).
2. THE `ProfileComponent` SHALL use Angular Reactive Forms for all editable sections.
3. WHEN the profile page loads, THE `ProfileComponent` SHALL call the profile API and populate all form fields with the returned data.
4. WHEN a teacher submits an editable section, THE `ProfileComponent` SHALL call `PUT /api/profile/me` and display a success or error snackbar; THE `ProfileComponent` MAY also display snackbars for other system events such as photo upload completion or background sync results.
5. THE `ProfileComponent` SHALL support profile photo upload with preview, following the same UX pattern as the student profile.
6. THE `ProfileComponent` SHALL be responsive and follow the existing teacher module's Angular Material patterns.
7. WHEN the profile API call fails on page load, THE `ProfileComponent` SHALL fall back to cached data from `localStorage` or display empty form fields with reasonable defaults rather than showing a blank page.

---

### Requirement 11: Frontend — Admin Profile Directory Page

**User Story:** As an admin, I want a profile directory page in the admin portal, so that I can browse, search, filter, and manage all student and teacher profiles.

#### Acceptance Criteria

1. THE `AdminProfilesComponent` at `/admin/profiles` SHALL display profile cards in a responsive grid layout using Angular Material `MatCard`.
2. THE `AdminProfilesComponent` SHALL provide filter controls for: Role (dropdown), Name (text search), Academic Year, Semester, Batch, Program.
3. WHEN a filter value changes, THE `AdminProfilesComponent` SHALL call `GET /api/admin/profiles` with the updated query parameters and refresh the card grid; THE `AdminProfilesComponent` SHALL also make an initial API call on page load with default parameters before any filter changes occur.
4. THE `AdminProfilesComponent` SHALL use Angular Material `MatPaginator` for client-side pagination control that triggers server-side pagination requests.
5. WHEN an admin clicks "View Profile" on a student card, THE `AdminProfilesComponent` SHALL navigate to a student detail view or open a dialog showing the full `StudentProfileDto`.
6. WHEN an admin clicks "Edit Profile" on a student card, THE `AdminProfilesComponent` SHALL open an edit form pre-populated with the student's data and call `PUT /api/admin/students/{id}` on submit.
7. WHEN an admin clicks "View Profile" on a teacher card, THE `AdminProfilesComponent` SHALL display the full `TeacherProfileDto`.
8. WHEN an admin clicks "Edit Profile" on a teacher card, THE `AdminProfilesComponent` SHALL open an edit form pre-populated with the teacher's data and call `PUT /api/admin/teachers/{id}` on submit.
9. THE `AdminProfilesComponent` SHALL display a loading spinner while data is being fetched.
10. THE `AdminProfilesComponent` SHALL be added to the admin sidebar navigation as "👤 Profiles" and registered in `AdminRoutingModule`.
11. THE `AdminProfilesComponent` SHALL follow the existing admin module's Angular Material patterns and be declared in `AdminModule`.

---

### Requirement 12: Backend — Database Migration & Entity Design

**User Story:** As a developer, I want the new profile entities to be created via a Flyway migration script, so that the schema changes are versioned and reproducible.

#### Acceptance Criteria

1. THE `FileStorageService` SHALL read the `DP_FOLDER` environment variable via `@Value("${app.dp.folder}")` and the `application.yml` SHALL map `app.dp.folder: ${DP_FOLDER}`.
2. THE `.env` file SHALL include a `DP_FOLDER` entry pointing to the root data directory (e.g., `DP_FOLDER=D:\MBCData`).
3. THE `UserProfile` entity SHALL have columns: `id`, `user_id` (FK to `users`), `first_name`, `last_name`, `preferred_name`, `gender`, `date_of_birth`, `marital_status`, `profile_photo_path`, `primary_mobile`, `alternate_mobile`, `personal_email`, `permanent_address`, `emergency_contact_name`, `emergency_contact_relationship`, `emergency_contact_phone`, `language_preference`, `created_at`, `updated_at`.
4. THE `StudentProfile` entity SHALL have columns: `id`, `user_id` (FK to `users`), `student_id_number`, `admission_number`, `batch`, `academic_year`, `program`, `semester`, `admission_date`, `home_church`, `church_denomination`, `baptized`, `ministry_experience`, `ministry_interests`, `calling_testimony`, `father_name`, `mother_name`, `guardian_name`, `guardian_relationship`, `guardian_phone`.
5. THE `TeacherProfile` entity SHALL have columns: `id`, `user_id` (FK to `users`), `employee_id`, `designation`, `employment_type`, `home_church`, `church_denomination`, `baptized`, `ministry_experience`, `ministry_interests`, `calling_testimony`.
6. THE new entities SHALL use `spring.jpa.hibernate.ddl-auto: update` (already configured) so Hibernate auto-creates the tables; no Flyway migration script is required for this feature since the project uses `ddl-auto: update`.
7. THE `ProfileService` implementation SHALL use `@Transactional` for all write operations, consistent with `LeaveRequestServiceImpl`.

---

### Requirement 13: Backend — Security & Authorization

**User Story:** As a system, I want all profile endpoints to enforce role-based access control, so that users can only access their own data and admins can access all profiles.

#### Acceptance Criteria

1. THE `SecurityConfig` SHALL add `/api/profile/**` to the authenticated-only rule (already covered by `.anyRequest().authenticated()`).
2. THE `AdminProfileController` SHALL annotate all methods with `@PreAuthorize("hasRole('ADMIN')")`, consistent with `AdminLeaveController`.
3. WHEN a student or teacher attempts to access `GET /api/admin/profiles`, THE `SecurityConfig` SHALL return HTTP 403, handled by the existing `GlobalExceptionHandler.handleAccessDenied`.
4. WHEN a user attempts `GET /api/profile/photo/{userId}` for a different user's ID, THE `ProfileController` SHALL return HTTP 403 unless the requesting user has the `ADMIN` role.
5. THE `ProfileController` SHALL resolve the authenticated user from `Authentication auth` parameter (consistent with `StudentDashboardController` and `AdminLeaveController` patterns).

---

### Requirement 14: Frontend — Profile Service

**User Story:** As a developer, I want a dedicated Angular service for profile API calls, so that profile data access is centralized and reusable across student, teacher, and admin components.

#### Acceptance Criteria

1. THE `ProfileService` Angular service SHALL be created at `src/app/shared/services/profile.service.ts` and provided `{ providedIn: 'root' }`.
2. THE `ProfileService` SHALL expose: `getMyProfile(): Observable<any>`, `updateMyProfile(data: any): Observable<any>`, `uploadPhoto(file: File): Observable<any>`, `getPhoto(userId: number): Observable<Blob>`, `changePassword(payload: ChangePasswordRequest): Observable<ApiResponse>`.
3. THE `AdminProfileService` SHALL be created at `src/app/features/admin/services/admin-profile.service.ts` and expose: `getProfiles(filters: any, pageable: any): Observable<PageResponse<ProfileCardDto>>`, `getStudent(id: number): Observable<StudentProfileDto>`, `updateStudent(id: number, data: any): Observable<StudentProfileDto>`, `getTeacher(id: number): Observable<TeacherProfileDto>`, `updateTeacher(id: number, data: any): Observable<TeacherProfileDto>`.
4. THE `ProfileService` SHALL use `environment.apiUrl` for the base URL, consistent with all other Angular services in the project.
5. THE `ProfileService` SHALL use `HttpClient` injected via the constructor, consistent with `StudentLeavesService` and `AdminUsersService`.

---

### Requirement 15: Performance & Non-Functional Requirements

**User Story:** As a user, I want the profile module to load quickly and work reliably on all devices, so that I have a smooth experience.

#### Acceptance Criteria

1. THE `ProfileComponent` in the student and teacher modules SHALL be loaded as part of the existing lazy-loaded `StudentModule` and `TeacherModule` respectively (already lazy-loaded via `app-routing.module.ts`).
2. THE `AdminProfilesComponent` SHALL be loaded as part of the existing lazy-loaded `AdminModule`.
3. THE `ProfileService` (backend) SHALL use `@Transactional(readOnly = true)` for all read-only operations to avoid unnecessary write locks.
4. THE `AdminProfileController` `GET /api/admin/profiles` endpoint SHALL use a single JPQL query with `JOIN FETCH` or a custom repository method to avoid N+1 query issues when loading profile cards.
5. WHEN the profile photo endpoint is called, THE `ProfileController` SHALL set appropriate `Cache-Control` headers to allow browser caching of profile images.
6. THE profile photo upload SHALL be limited to 5 MB, enforced at both the `FileStorageService` level and via Spring's existing `spring.servlet.multipart.max-file-size: 50MB` configuration (the 5 MB limit is a business rule enforced in code).
