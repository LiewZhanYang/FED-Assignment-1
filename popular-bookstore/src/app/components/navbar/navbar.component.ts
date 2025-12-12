import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  cartCount$!: Observable<number>;
  isLoggedIn$!: Observable<boolean>;
  isCartOpen = false;
  isMobileMenuOpen = false;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartCount$ = this.cartService.cartCount$;
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  toggleCart(): void {
    this.isCartOpen = !this.isCartOpen;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  navigateToAccount(): void {
    this.router.navigate(['/account']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
