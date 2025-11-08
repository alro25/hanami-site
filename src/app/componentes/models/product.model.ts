export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  description: string;
  tags: string[];
  stock?: number;
  subcategory?: string;
}