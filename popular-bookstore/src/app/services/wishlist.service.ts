import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistKey = 'popular-bookstore-wishlist';
  private wishlistSubject = new BehaviorSubject<number[]>(this.loadWishlist());
  public wishlist$ = this.wishlistSubject.asObservable();

  constructor() {
    // 初始化时从localStorage加载
    this.loadWishlist();
  }

  private loadWishlist(): number[] {
    try {
      const stored = localStorage.getItem(this.wishlistKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private saveWishlist(ids: number[]): void {
    try {
      localStorage.setItem(this.wishlistKey, JSON.stringify(ids));
      this.wishlistSubject.next(ids);
    } catch (error) {
      console.error('Failed to save wishlist:', error);
    }
  }

  getWishlist(): number[] {
    return this.wishlistSubject.value;
  }

  isInWishlist(productId: number): boolean {
    return this.getWishlist().includes(productId);
  }

  addToWishlist(productId: number): void {
    const current = this.getWishlist();
    if (!current.includes(productId)) {
      this.saveWishlist([...current, productId]);
    }
  }

  removeFromWishlist(productId: number): void {
    const current = this.getWishlist();
    this.saveWishlist(current.filter(id => id !== productId));
  }

  toggleWishlist(productId: number): boolean {
    const isInWishlist = this.isInWishlist(productId);
    if (isInWishlist) {
      this.removeFromWishlist(productId);
      return false;
    } else {
      this.addToWishlist(productId);
      return true;
    }
  }

  clearWishlist(): void {
    this.saveWishlist([]);
  }
}

