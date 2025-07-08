export interface OperationLog {
  id: number;
  userId: number;
  action: string;
  entity: string;
  entityId: string;
  description: string | null;
  details: any;
} 