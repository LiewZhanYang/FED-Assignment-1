import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';

export interface FilterOptions {
  searchQuery?: string;
  category?: string;
  priceRange?: string;
  sortBy?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  
  parsePriceRange(range: string): [number, number] {
    if (range === '0-20') return [0, 20];
    if (range === '20-50') return [20, 50];
    if (range === '50-100') return [50, 100];
    if (range === '100+') return [100, Infinity];
    return [0, Infinity];
  }

  filterProducts(products: Product[], options: FilterOptions): Product[] {
    let filtered = [...products];
    
    // Search filter
    if (options.searchQuery?.trim()) {
      const query = options.searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(query) ||
        (p.category && p.category.toLowerCase().includes(query)) ||
        (p.author && p.author.toLowerCase().includes(query))
      );
    }
    
    // Category filter
    if (options.category && options.category !== 'all') {
      filtered = filtered.filter(p => 
        p.category?.toLowerCase() === options.category?.toLowerCase()
      );
    }
    
    // Price range filter
    if (options.priceRange && options.priceRange !== 'all') {
      const [min, max] = this.parsePriceRange(options.priceRange);
      filtered = filtered.filter(p => {
        if (max === Infinity) return p.price >= min;
        return p.price >= min && p.price <= max;
      });
    }
    
    return filtered;
  }

  sortProducts(products: Product[], sortBy: string): Product[] {
    const sorted = [...products];
    
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'title-az':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'title-za':
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      case 'rating-high':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'rating-low':
        return sorted.sort((a, b) => a.rating - b.rating);
      default:
        return sorted;
    }
  }

  paginateProducts(products: Product[], page: number, itemsPerPage: number): {
    paginated: Product[];
    totalPages: number;
  } {
    const totalPages = Math.ceil(products.length / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const paginated = products.slice(startIndex, startIndex + itemsPerPage);
    
    return { paginated, totalPages };
  }
}

