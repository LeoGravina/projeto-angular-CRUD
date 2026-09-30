export interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  status: boolean;
  created_at: Date;
}

export interface ProductFilters {
  name?: string;
  status?: boolean;
}

export interface CreateProductDTO {
  name: string;
  sku: string;
  price: number;
  quantity: number;
  status?: boolean;
}
