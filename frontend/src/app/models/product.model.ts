export interface Product {
  id?: number;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  status?: boolean;
  created_at?: string;
}
