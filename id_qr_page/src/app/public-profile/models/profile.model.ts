export type ProfileType = 'STUDENT' | 'STAFF';

export type ProfileStatus =
  | 'ACTIVE'
  | 'GRADUATED'
  | 'ALUMNI'
  | 'INACTIVE'
  | 'FORMER_STAFF';

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  website?: string;
}

export interface Profile {
  slug: string;

  type: ProfileType;

  name: string;

  photo: string;

  // Student information
  course?: string;
  registrationNumber?: string;
  admissionNumber?: string;
  academicYear?: string;

  // Staff information
  designation?: string;
  employeeId?: string;

  // Contact information
  phone?: string;
  email?: string;

  // Profile status
  status: ProfileStatus;

  verified: boolean;

  // Optional social media
  socialLinks?: SocialLinks;
}