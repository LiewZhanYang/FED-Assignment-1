export interface Product {
  id: number;
  Image: string;
  title: string;
  price: number;
  discount?: number;
  originalPrice?: number;
  category?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id?: number;
  name: string;
  email: string;
  isLoggedIn?: boolean;
}
