export interface Review {
  id: number;
  reviewerName: string;
  rating: number; // 1-5
  title?: string;
  comment: string;
  date: string;
  verified?: boolean;
}

export interface Product {
  id: number;
  Image: string;
  title: string;
  price: number;
  discount?: number;
  originalPrice?: number;
  category?: string;
  author: string;
  rating: number; // 1-5分，平均评分
  description: string;
  reviews?: Review[]; // 评论列表
  reviewCount?: number; // 评论总数
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
