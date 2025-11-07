export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  subcategory: string;
  description: string;
  imageUrl: string;
  stock: number;
  tags: string[];
}