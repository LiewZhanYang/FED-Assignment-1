import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  products$!: Observable<Product[]>;
  currentSlideIndex = 0;
  slides = [
    { image: 'assets/image/carousel1.png', alt: 'Featured Books' },
    { image: 'assets/image/carousel2.png', alt: 'Special Offers' },
    { image: 'assets/image/carousel3.png', alt: 'New Arrivals' }
  ];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.products$ = this.productService.getProducts();
    this.startCarousel();
    
    // Welcome message
    setTimeout(() => {
      this.toastService.success('Welcome to Popular Online Bookstore! 📚');
    }, 1000);
  }

  startCarousel(): void {
    setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  nextSlide(): void {
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.slides.length;
  }

  prevSlide(): void {
    this.currentSlideIndex = (this.currentSlideIndex - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(index: number): void {
    this.currentSlideIndex = index;
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    this.toastService.success(`${product.title} added to cart!`);
  }

  toggleWishlist(product: Product, event: Event): void {
    event.stopPropagation();
    this.toastService.success('Added to wishlist! ❤️');
  }

  shareProduct(product: Product, event: Event): void {
    event.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `Check out ${product.title} for $${product.price}`,
        url: window.location.href
      }).catch(err => console.log('Error sharing:', err));
    } else {
      this.toastService.info('Product link copied to clipboard!');
    }
  }
}
