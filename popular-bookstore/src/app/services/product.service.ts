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
    },
    // Stationery Products
    {
      id: 100,
      Image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=300&h=300&fit=crop',
      title: 'Premium Fountain Pen',
      price: 45.99,
      discount: 23,
      originalPrice: 59.99,
      category: 'writing',
      brand: 'Pilot',
      rating: 4.8,
      description: 'Professional fountain pen with smooth ink flow and elegant design.',
      reviewCount: 156,
      features: ['Smooth ink flow', 'Ergonomic grip', 'Refillable cartridge'],
      inStock: true,
      reviews: [
        {
          id: 101,
          reviewerName: 'Alex Thompson',
          rating: 5,
          title: 'Excellent quality!',
          comment: 'Writes smoothly and feels great in hand. Highly recommend!',
          date: '2024-12-10',
          verified: true
        }
      ]
    },
    {
      id: 101,
      Image: 'https://images.unsplash.com/photo-1606559013429-3dbcb1c0e5b4?w=300&h=300&fit=crop',
      title: 'Mechanical Pencil Set',
      price: 24.99,
      discount: 17,
      originalPrice: 29.99,
      category: 'writing',
      brand: 'Faber-Castell',
      rating: 4.6,
      description: 'Professional mechanical pencils for precise drawing and writing.',
      reviewCount: 89,
      features: ['0.5mm lead', 'Comfortable grip', 'Lead indicator'],
      inStock: true,
      reviews: [
        {
          id: 102,
          reviewerName: 'Maria Garcia',
          rating: 4,
          title: 'Good quality',
          comment: 'Nice pencils, good for technical drawing.',
          date: '2024-12-08',
          verified: true
        }
      ]
    },
    {
      id: 102,
      Image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=300&fit=crop',
      title: 'Premium Marker Set',
      price: 32.99,
      discount: 18,
      originalPrice: 39.99,
      category: 'writing',
      brand: 'Stabilo',
      rating: 4.7,
      description: 'High-quality markers with vibrant colors for professional use.',
      reviewCount: 203,
      features: ['48 colors', 'Dual tips', 'Non-toxic ink'],
      inStock: true,
      reviews: [
        {
          id: 103,
          reviewerName: 'John Davis',
          rating: 5,
          title: 'Amazing colors!',
          comment: 'Vibrant colors and long-lasting. Perfect for art projects.',
          date: '2024-12-05',
          verified: true
        }
      ]
    },
    {
      id: 103,
      Image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&h=300&fit=crop',
      title: 'Leather Notebook',
      price: 28.99,
      discount: 14,
      originalPrice: 33.99,
      category: 'paper',
      brand: 'Moleskine',
      rating: 4.9,
      description: 'Premium leather-bound notebook with high-quality paper.',
      reviewCount: 312,
      features: ['Leather cover', '200 pages', 'Lined paper'],
      inStock: true,
      reviews: [
        {
          id: 104,
          reviewerName: 'Sarah Lee',
          rating: 5,
          title: 'Beautiful notebook',
          comment: 'Love the quality and design. Perfect for journaling.',
          date: '2024-12-12',
          verified: true
        }
      ]
    },
    {
      id: 104,
      Image: 'https://images.unsplash.com/photo-1532619675605-1d6b3a4e5c2e?w=300&h=300&fit=crop',
      title: 'Desk Organizer Set',
      price: 35.99,
      discount: 20,
      originalPrice: 44.99,
      category: 'organizers',
      brand: 'IKEA',
      rating: 4.5,
      description: 'Modern desk organizer to keep your workspace tidy.',
      reviewCount: 178,
      features: ['Multiple compartments', 'Modern design', 'Easy to clean'],
      inStock: true,
      reviews: [
        {
          id: 105,
          reviewerName: 'David Kim',
          rating: 4,
          title: 'Great organizer',
          comment: 'Keeps my desk organized. Good value for money.',
          date: '2024-12-07',
          verified: false
        }
      ]
    },
    {
      id: 105,
      Image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=300&fit=crop',
      title: 'Watercolor Paint Set',
      price: 42.99,
      discount: 25,
      originalPrice: 57.99,
      category: 'art',
      brand: 'Winsor & Newton',
      rating: 4.8,
      description: 'Professional watercolor paints with vibrant pigments.',
      reviewCount: 245,
      features: ['24 colors', 'Professional quality', 'Long-lasting'],
      inStock: true,
      reviews: [
        {
          id: 106,
          reviewerName: 'Emma Wilson',
          rating: 5,
          title: 'Perfect for artists',
          comment: 'High-quality paints with excellent color payoff.',
          date: '2024-12-09',
          verified: true
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
