export interface AdmissionFormField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'tel';
  required: boolean;
  maxLength?: number;
  options?: string[];
}

export interface AdmissionForm {
  id: number;
  title: string;
  description: string;
  slug: string;
  deadline: string;
  active: boolean;
  open: boolean;
  fields: AdmissionFormField[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AdmissionSubmission {
  id: number;
  formId: number;
  formTitle: string;
  formSlug: string;
  fullNameWithInitials: string;
  age?: number;
  gender?: string;
  maritalStatus?: string;
  courseApplied?: string;
  qualification?: string;
  currentOccupation?: string;
  fullAddress?: string;
  cityTown?: string;
  whatsappNumber?: string;
  churchAssemblyName?: string;
  evangelistPastorName?: string;
  answers: Record<string, string>;
  status: 'PENDING' | 'REVIEWED' | 'ACCEPTED' | 'REJECTED';
  submittedAt: string;
}

export interface AdmissionSubmissionRequest {
  formId: number;
  answers: Record<string, string>;
}
