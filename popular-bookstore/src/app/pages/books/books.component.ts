import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {
  products$!: Observable<Product[]>;
  filteredProducts: Product[] = [];
  allProducts: Product[] = [];
  
  // Filter states
  selectedCategory: string = 'all';
  selectedPriceRange: string = 'all';
  searchQuery: string = '';
  sortBy: string = 'featured';
  
  // View mode
  viewMode: 'grid' | 'list' = 'grid';
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 12;
  totalPages: number = 1;
  
  // Wishlist
  wishlistIds: number[] = [];
  
  // Quick View
  showQuickView: boolean = false;
  selectedProduct: Product | null = null;
  
  // Categories
  categories = [
    { id: 'all', name: 'All Books', icon: 'fa-book' },
    { id: 'fiction', name: 'Fiction', icon: 'fa-book-open' },
    { id: 'non-fiction', name: 'Non-Fiction', icon: 'fa-graduation-cap' },
    { id: 'business', name: 'Business', icon: 'fa-briefcase' },
    { id: 'technology', name: 'Technology', icon: 'fa-laptop-code' },
    { id: 'self-help', name: 'Self-Help', icon: 'fa-heart' },
    { id: 'children', name: 'Children', icon: 'fa-child' }
  ];
  
  // Price ranges
  priceRanges = [
    { id: 'all', label: 'All Prices' },
    { id: '0-20', label: 'Under $20' },
    { id: '20-50', label: '$20 - $50' },
    { id: '50-100', label: '$50 - $100' },
    { id: '100+', label: 'Over $100' }
  ];
  
  // Sort options
  sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'title-az', label: 'Title: A-Z' },
    { value: 'title-za', label: 'Title: Z-A' }
  ];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private toastService: ToastService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    // Load wishlist
    this.wishlistService.wishlist$.subscribe(ids => {
      this.wishlistIds = ids;
    });
    
    this.products$ = this.productService.getProducts();
    this.products$.subscribe(products => {
      this.allProducts = products;
      this.applyFilters();
    });
  }

  applyFilters(): void {
    let filtered = [...this.allProducts];
    
    // Search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(query) ||
        (p.category && p.category.toLowerCase().includes(query)) ||
        (p.author && p.author.toLowerCase().includes(query))
      );
    }
    
    // Category filter
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(p => 
        p.category?.toLowerCase() === this.selectedCategory.toLowerCase()
      );
    }
    
    // Price range filter
    if (this.selectedPriceRange !== 'all') {
      const [min, max] = this.parsePriceRange(this.selectedPriceRange);
      filtered = filtered.filter(p => {
        if (max === Infinity) return p.price >= min;
        return p.price >= min && p.price <= max;
      });
    }
    
    // Sort
    filtered = this.sortProducts(filtered);
    
    // Pagination
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.filteredProducts = filtered.slice(startIndex, startIndex + this.itemsPerPage);
  }

  parsePriceRange(range: string): [number, number] {
    if (range === '0-20') return [0, 20];
    if (range === '20-50') return [20, 50];
    if (range === '50-100') return [50, 100];
    if (range === '100+') return [100, Infinity];
    return [0, Infinity];
  }

  sortProducts(products: Product[]): Product[] {
    switch (this.sortBy) {
      case 'price-low':
        return products.sort((a, b) => a.price - b.price);
      case 'price-high':
        return products.sort((a, b) => b.price - a.price);
      case 'title-az':
        return products.sort((a, b) => a.title.localeCompare(b.title));
      case 'title-za':
        return products.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return products;
    }
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.currentPage = 1;
    this.applyFilters();
  }

  onPriceRangeChange(range: string): void {
    this.selectedPriceRange = range;
    this.currentPage = 1;
    this.applyFilters();
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyFilters();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  addToCart(product: Product, event: Event): void {
    event.stopPropagation();
    this.cartService.addToCart(product);
    this.toastService.success(`${product.title} added to cart! 🛒`);
  }

  toggleWishlist(product: Product, event: Event): void {
    event.stopPropagation();
    const added = this.wishlistService.toggleWishlist(product.id);
    if (added) {
      this.toastService.success(`${product.title} added to wishlist! ❤️`);
    } else {
      this.toastService.info(`${product.title} removed from wishlist`);
    }
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistService.isInWishlist(productId);
  }

  quickView(product: Product, event: Event): void {
    event.stopPropagation();
    this.selectedProduct = product;
    this.showQuickView = true;
  }

  closeQuickView(): void {
    this.showQuickView = false;
    this.selectedProduct = null;
  }

  clearFilters(): void {
    this.selectedCategory = 'all';
    this.selectedPriceRange = 'all';
    this.searchQuery = '';
    this.sortBy = 'featured';
    this.currentPage = 1;
    this.applyFilters();
    this.toastService.info('Filters cleared');
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);
    
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
}
