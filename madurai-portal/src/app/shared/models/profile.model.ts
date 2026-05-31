export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type MaritalStatus = 'SINGLE' | 'MARRIED' | 'WIDOWED' | 'DIVORCED';
export type LanguagePreference = 'ENGLISH' | 'TAMIL';
export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'GUEST_FACULTY';
export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN';

export interface UserProfileDto {
  userId: number;
  username: string;
  role: UserRole;
  accountStatus: boolean;
  createdAt: string;
  firstName: string;
  lastName: string;
  preferredName: string;
  gender: Gender;
  dateOfBirth: string;
  maritalStatus: MaritalStatus;
  profilePhotoPath: string;
  primaryMobile: string;
  alternateMobile: string;
  personalEmail: string;
  permanentAddress: string;
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
  languagePreference: LanguagePreference;
}

export interface StudentProfileDto extends UserProfileDto {
  studentIdNumber: string;
  admissionNumber: string;
  batch: string;
  academicYear: string;
  program: string;
  semester: string;
  admissionDate: string;
  homeChurch: string;
  churchDenomination: string;
  baptized: boolean;
  ministryExperience: string;
  ministryInterests: string;
  callingTestimony: string;
  fatherName: string;
  motherName: string;
  guardianName: string;
  guardianRelationship: string;
  guardianPhone: string;
}

export interface TeacherProfileDto extends UserProfileDto {
  employeeId: string;
  designation: string;
  employmentType: EmploymentType;
  homeChurch: string;
  churchDenomination: string;
  baptized: boolean;
  ministryExperience: string;
  ministryInterests: string;
  callingTestimony: string;
}

export interface ProfileCardDto {
  userId: number;
  fullName: string;
  profilePhotoPath: string;
  role: UserRole;
  // Student
  batch?: string;
  academicYear?: string;
  program?: string;
  // Teacher
  designation?: string;
  employmentType?: EmploymentType;

  photoUrl?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ApiResponse {
  message: string;
  success: boolean;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
}
