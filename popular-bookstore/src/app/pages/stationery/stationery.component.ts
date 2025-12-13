import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { WishlistService } from '../../services/wishlist.service';
import { FilterService } from '../../services/filter.service';

@Component({
  selector: 'app-stationery',
  templateUrl: './stationery.component.html',
  styleUrls: ['./stationery.component.css']
})
export class StationeryComponent implements OnInit {
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
    { id: 'all', name: 'All Stationery', icon: 'fa-pencil-alt' },
    { id: 'writing', name: 'Writing Tools', icon: 'fa-pen' },
    { id: 'paper', name: 'Paper & Notebooks', icon: 'fa-book' },
    { id: 'organizers', name: 'Organizers', icon: 'fa-folder' },
    { id: 'art', name: 'Art Supplies', icon: 'fa-palette' },
    { id: 'office', name: 'Office Supplies', icon: 'fa-briefcase' }
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
    { value: 'title-za', label: 'Title: Z-A' },
    { value: 'rating-high', label: 'Rating: High to Low' },
    { value: 'rating-low', label: 'Rating: Low to High' }
  ];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private toastService: ToastService,
    private wishlistService: WishlistService,
    private filterService: FilterService
  ) {}

  ngOnInit(): void {
    // Load wishlist
    this.wishlistService.wishlist$.subscribe(ids => {
      this.wishlistIds = ids;
    });
    
    // Load stationery products
    this.products$ = this.productService.getProducts();
    this.products$.subscribe(products => {
      // Filter for stationery products only
      this.allProducts = products.filter(p => p.category && 
        ['writing', 'paper', 'organizers', 'art', 'office'].includes(p.category));
      this.applyFilters();
    });
  }

  applyFilters(): void {
    // Use FilterService for filtering
    let filtered = this.filterService.filterProducts(this.allProducts, {
      searchQuery: this.searchQuery,
      category: this.selectedCategory,
      priceRange: this.selectedPriceRange
    });
    
    // Sort
    filtered = this.filterService.sortProducts(filtered, this.sortBy);
    
    // Pagination
    const result = this.filterService.paginateProducts(filtered, this.currentPage, this.itemsPerPage);
    this.filteredProducts = result.paginated;
    this.totalPages = result.totalPages;
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

