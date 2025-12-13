import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Product, Review } from '../models/product.model';

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
      description: 'A thrilling tale of adventure and discovery that takes readers on an unforgettable journey through uncharted territories.',
      reviewCount: 127,
      reviews: [
        {
          id: 1,
          reviewerName: 'Sarah Johnson',
          rating: 5,
          title: 'Absolutely captivating!',
          comment: 'This book kept me on the edge of my seat from start to finish. Highly recommend!',
          date: '2024-12-01',
          verified: true
        },
        {
          id: 2,
          reviewerName: 'Michael Chen',
          rating: 4,
          title: 'Great storytelling',
          comment: 'Well-written with engaging characters. A bit slow in the middle but picks up nicely.',
          date: '2024-11-28',
          verified: true
        }
      ]
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
      description: 'Master the essentials of JavaScript with hands-on examples and practical projects.',
      reviewCount: 234,
      reviews: [
        {
          id: 3,
          reviewerName: 'David Park',
          rating: 5,
          title: 'Perfect for beginners',
          comment: 'Clear explanations and great examples. Helped me understand JavaScript fundamentals quickly.',
          date: '2024-12-05',
          verified: true
        },
        {
          id: 4,
          reviewerName: 'Emily Rodriguez',
          rating: 4,
          title: 'Very comprehensive',
          comment: 'Covers all the basics well. Would have liked more advanced topics but overall excellent.',
          date: '2024-11-30',
          verified: false
        }
      ]
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
      description: 'A classic introduction and deep dive into software design patterns used by professional developers.',
      reviewCount: 456,
      reviews: [
        {
          id: 5,
          reviewerName: 'Robert Taylor',
          rating: 5,
          title: 'Must-read for developers',
          comment: 'This is the definitive guide to design patterns. Every developer should read this.',
          date: '2024-12-08',
          verified: true
        },
        {
          id: 6,
          reviewerName: 'Lisa Wang',
          rating: 5,
          title: 'Excellent reference',
          comment: 'Clear examples and explanations. I refer back to this book constantly.',
          date: '2024-12-02',
          verified: true
        }
      ]
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
      description: 'Best practices and new technologies for web developers in the modern era.',
      reviewCount: 89,
      reviews: [
        {
          id: 7,
          reviewerName: 'James Wilson',
          rating: 4,
          title: 'Good overview',
          comment: 'Covers modern frameworks and tools well. Some sections could be more detailed.',
          date: '2024-11-25',
          verified: true
        },
        {
          id: 8,
          reviewerName: 'Anna Martinez',
          rating: 5,
          title: 'Up-to-date content',
          comment: 'Great book with current best practices. Very relevant for today\'s web development.',
          date: '2024-11-20',
          verified: false
        }
      ]
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
