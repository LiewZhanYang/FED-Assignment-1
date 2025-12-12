import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CartItem } from '../../models/product.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-sidebar',
  templateUrl: './cart-sidebar.component.html',
  styleUrls: ['./cart-sidebar.component.css']
})
export class CartSidebarComponent implements OnInit {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  cartItems$!: Observable<CartItem[]>;
  cartTotal$!: Observable<number>;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartItems$ = this.cartService.getCartItems();
    this.cartTotal$ = this.cartService.cartTotal$;
  }

  closeCart(): void {
    this.close.emit();
  }

  updateQuantity(productId: number, change: number): void {
    const currentItems = this.cartService['cartItems'].value;
    const item = currentItems.find(i => i.product.id === productId);
    if (item) {
      this.cartService.updateQuantity(productId, item.quantity + change);
    }
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  goToCheckout(): void {
    this.closeCart();
    this.router.navigate(['/checkout']);
  }
}
