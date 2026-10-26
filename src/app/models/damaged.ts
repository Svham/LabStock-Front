export interface Damaged {
  id: number;
  itemId: number;
  itemName: string;
  studentId: number;
  studentName: string;
  labId: number;
  labName: string;
  reason: string;
  quantity: number;
  createdAt: string;
}

export interface DamagedRequest {
  itemId: number;
  studentId: number;
  labId: number;
  reason: string;
  quantity: number;
}
