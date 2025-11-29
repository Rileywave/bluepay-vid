
export interface Transaction {
  id: number;
  type: string;
  amount: string;
  date: string;
  status: string;
  recipient?: string;
}
