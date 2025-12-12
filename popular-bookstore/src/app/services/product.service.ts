import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    {
      id: 0,
      Image: 'assets/image/book1.png',
      title: 'The Great Adventure',
      price: 120,
      discount: 20,
      originalPrice: 150,
      category: 'books'
    },
    {
      id: 1,
      Image: 'assets/image/book2.png',
      title: 'Learning JavaScript',
      price: 85,
      discount: 15,
      originalPrice: 100,
      category: 'books'
    },
    {
      id: 2,
      Image: 'assets/image/book3.png',
      title: 'Design Patterns',
      price: 95,
      discount: 10,
      originalPrice: 105,
      category: 'books'
    },
    {
      id: 3,
      Image: 'assets/image/book4.png',
      title: 'Modern Web Development',
      price: 110,
      discount: 25,
      originalPrice: 135,
      category: 'books'
    }
  ];

  private productsSubject = new BehaviorSubject<Product[]>(this.products);
  public products$ = this.productsSubject.asObservable();

  constructor() { }

  getProducts(): Observable<Product[]> {
    return this.products$;
  }

  getProductById(id: number): Observable<Product | undefined> {
    return of(this.products.find(p => p.id === id));
  }

  searchProducts(query: string): Observable<Product[]> {
    const filtered = this.products.filter(p => 
      p.title.toLowerCase().includes(query.toLowerCase())
    );
    return of(filtered);
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    const filtered = this.products.filter(p => p.category === category);
    return of(filtered);
  }
}
