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

// Texto e cor do status, usados pelas telas de empréstimos.
// "Aprovado" ainda não devolvido aparece como "Em uso" (o item está fora do laboratório).
export function rotuloStatus(emprestimo: Lending): string {
  if (emprestimo.status === LendingStatus.PENDING) return 'Pendente';
  if (emprestimo.status === LendingStatus.REJECTED) return 'Rejeitado';
  return emprestimo.returned ? 'Devolvido' : 'Em uso';
}

export function classeStatus(emprestimo: Lending): string {
  if (emprestimo.status === LendingStatus.PENDING) return 'bg-warning text-dark';
  if (emprestimo.status === LendingStatus.REJECTED) return 'bg-danger';
  return emprestimo.returned ? 'bg-success' : 'bg-primary';
}
