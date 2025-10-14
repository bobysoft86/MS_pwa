export interface User {
  id: number;
  name: string;
  email: string;
  role_id: number;
  role_name?: string;       
  credit_balance: number;
  created_at: string;       
  updated_at: string;       
}
