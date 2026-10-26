export enum LendingStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface Lending {
  id: number;
  itemId: number;
  itemName: string;
  studentId: number;
  studentName: string;
  teacherId: number;
  teacherName: string;
  quantity: number;
  status: LendingStatus;
  returned: boolean;
  lendingDate: string | null;
  returnDate: string | null;
  createdAt: string;
}

export interface LendingRequest {
  itemId: number;
  teacherId: number;
  studentId: number;
  quantity: number;
}
