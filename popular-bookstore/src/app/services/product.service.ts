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
      category: 'books',
      author: 'John Smith',
      rating: 4.5,
      description: 'A thrilling tale of adventure and discovery.'
    },
    {
      id: 1,
      Image: 'assets/image/book2.png',
      title: 'Learning JavaScript',
      price: 85,
      discount: 15,
      originalPrice: 100,
      category: 'books',
      author: 'Jane Doe',
      rating: 4.8,
      description: 'Master the essentials of JavaScript with hands-on examples.'
    },
    {
      id: 2,
      Image: 'assets/image/book3.png',
      title: 'Design Patterns',
      price: 95,
      discount: 10,
      originalPrice: 105,
      category: 'books',
      author: 'Eric Gamma',
      rating: 4.9,
      description: 'A classic introduction and deep dive into software design.'
    },
    {
      id: 3,
      Image: 'assets/image/book4.png',
      title: 'Modern Web Development',
      price: 110,
      discount: 25,
      originalPrice: 135,
      category: 'books',
      author: 'Susan Lee',
      rating: 4.3,
      description: 'Best practices and new technologies for web developers.'
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
