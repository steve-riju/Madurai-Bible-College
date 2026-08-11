# Implementation Tasks: MBC Profile Management Module

## Task 1: Backend — New Entities (UserProfile, StudentProfile, TeacherProfile)
- [x] Create `UserProfile` entity in `com.maduraibiblecollege.entity`
- [x] Create `StudentProfile` entity in `com.maduraibiblecollege.entity`
- [x] Create `TeacherProfile` entity in `com.maduraibiblecollege.entity`
- [x] Create `EmploymentType` enum in `com.maduraibiblecollege.entity`
- [x] Create `Gender` enum in `com.maduraibiblecollege.entity`
- [x] Create `MaritalStatus` enum in `com.maduraibiblecollege.entity`
- [x] Create `LanguagePreference` enum in `com.maduraibiblecollege.entity`

## Task 2: Backend — Repositories
- [x] Create `UserProfileRepository`
- [x] Create `StudentProfileRepository`
- [x] Create `TeacherProfileRepository`

## Task 3: Backend — DTOs
- [x] Create `UserProfileDto`
- [x] Create `StudentProfileDto`
- [x] Create `TeacherProfileDto`
- [x] Create `ProfileCardDto`
- [x] Create `UpdateProfileRequest`
- [x] Create `UpdateStudentProfileRequest`
- [x] Create `UpdateTeacherProfileRequest`
- [x] Create `ChangePasswordRequest`
- [x] Create `AdminUpdateStudentRequest`
- [x] Create `AdminUpdateTeacherRequest`

## Task 4: Backend — FileStorageService
- [x] Add `DP_FOLDER` to `.env` and `app.dp.folder` to `application.yml`
- [x] Create `FileStorageService` interface
- [x] Create `FileStorageServiceImpl` with filesystem storage logic

## Task 5: Backend — ProfileService & ProfileServiceImpl
- [x] Create `ProfileService` interface
- [x] Create `ProfileServiceImpl` with all profile read/write/photo/password methods

## Task 6: Backend — ProfileController
- [x] Create `ProfileController` at `/api/profile`
- [x] Implement `GET /api/profile/me`
- [x] Implement `PUT /api/profile/me`
- [x] Implement `POST /api/profile/photo`
- [x] Implement `GET /api/profile/photo/{userId}`
- [x] Implement `PUT /api/profile/change-password`

## Task 7: Backend — AdminProfileController
- [x] Create `AdminProfileController` at `/api/admin`
- [x] Implement `GET /api/admin/profiles` with filters + pagination
- [x] Implement `GET /api/admin/students/{id}`
- [x] Implement `PUT /api/admin/students/{id}`
- [x] Implement `GET /api/admin/teachers/{id}`
- [x] Implement `PUT /api/admin/teachers/{id}`

## Task 8: Frontend — ProfileService (Angular)
- [x] Create `profile.service.ts` in `src/app/shared/services/`
- [x] Create `admin-profile.service.ts` in `src/app/features/admin/services/`
- [x] Create profile models/interfaces in `src/app/shared/models/profile.model.ts`

## Task 9: Frontend — Student Profile Component
- [x] Implement `profile.component.ts` for student
- [x] Implement `profile.component.html` for student
- [x] Implement `profile.component.scss` for student

## Task 10: Frontend — Teacher Profile Component
- [x] Implement `profile.component.ts` for teacher
- [x] Implement `profile.component.html` for teacher
- [x] Implement `profile.component.scss` for teacher
- [x] Add `MatExpansionModule` to `TeacherModule`

## Task 11: Frontend — Admin Profiles Component
- [x] Create `profiles/` folder under `src/app/features/admin/`
- [x] Create `admin-profiles.component.ts` (with 4 inline dialog components)
- [x] Create `admin-profiles.component.html`
- [x] Create `admin-profiles.component.scss`
- [x] Add route `/admin/profiles` to `admin-routing.module.ts`
- [x] Add "👤 Profiles" to admin sidebar in `admin-layout.component.html`
- [x] Declare all 5 components in `AdminModule`

## Task 12: Assets
- [x] Create `default-avatar.svg` in `src/assets/images/`
