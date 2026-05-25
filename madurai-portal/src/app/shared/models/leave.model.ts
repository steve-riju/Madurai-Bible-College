export type LeaveType = 'NORMAL' | 'EMERGENCY';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface LeaveRequest {
  id: number;
  studentId: number;
  studentName: string;
  startDate: string;
  endDate: string;
  reason: string;
  leaveType: LeaveType;
  status: LeaveStatus;
  appliedDate: string;
  adminRemarks?: string;
}

export interface LeaveRequestPayload {
  startDate: string;
  endDate: string;
  reason: string;
  leaveType: LeaveType;
}

export interface LeaveActionPayload {
  remarks?: string;
}
