import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CartItem } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutForm!: FormGroup;
  cartItems$!: Observable<CartItem[]>;
  cartTotal$!: Observable<number>;
  isProcessing = false;
  currentStep = 1;
  orderSuccess = false;
  orderNumber = '';
  promoCode = '';
  discount = 0;
  currentDate = new Date();

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartItems$ = this.cartService.getCartItems();
    this.cartTotal$ = this.cartService.cartTotal$;

    this.checkoutForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,}$/)]],
      address: ['', [Validators.required, Validators.minLength(10)]],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.pattern(/^[0-9]{5}$/)]],
      paymentMethod: ['credit', Validators.required],
      cardNumber: [''],
      cardName: [''],
      expiryDate: [''],
      cvv: ['']
    });

    // Add conditional validators for credit card
    this.checkoutForm.get('paymentMethod')?.valueChanges.subscribe(method => {
      if (method === 'credit') {
        this.checkoutForm.get('cardNumber')?.setValidators([Validators.required, Validators.pattern(/^[0-9]{16}$/)]);
        this.checkoutForm.get('cardName')?.setValidators(Validators.required);
        this.checkoutForm.get('expiryDate')?.setValidators([Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/[0-9]{2}$/)]);
        this.checkoutForm.get('cvv')?.setValidators([Validators.required, Validators.pattern(/^[0-9]{3,4}$/)]);
      } else {
        this.checkoutForm.get('cardNumber')?.clearValidators();
        this.checkoutForm.get('cardName')?.clearValidators();
        this.checkoutForm.get('expiryDate')?.clearValidators();
        this.checkoutForm.get('cvv')?.clearValidators();
      }
      this.checkoutForm.get('cardNumber')?.updateValueAndValidity();
      this.checkoutForm.get('cardName')?.updateValueAndValidity();
      this.checkoutForm.get('expiryDate')?.updateValueAndValidity();
      this.checkoutForm.get('cvv')?.updateValueAndValidity();
    });
  }

  updateQuantity(item: CartItem, change: number): void {
    if (change > 0) {
      this.cartService.addToCart(item.product);
    } else {
      this.cartService.updateQuantity(item.product.id, item.quantity - 1);
    }
  }

  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(item.product.id);
    this.toastService.success('Item removed from cart');
  }

  getTax(): number {
    let subtotal = 0;
    this.cartTotal$.subscribe(total => subtotal = total).unsubscribe();
    return (subtotal - this.discount) * 0.06;
  }

  getTotal(): number {
    let subtotal = 0;
    this.cartTotal$.subscribe(total => subtotal = total).unsubscribe();
    return subtotal + 10 - this.discount + this.getTax();
  }

  applyPromo(): void {
    if (this.promoCode.toUpperCase() === 'BOOK10') {
      let subtotal = 0;
      this.cartTotal$.subscribe(total => subtotal = total).unsubscribe();
      this.discount = subtotal * 0.1;
      this.toastService.success('🎉 Promo code applied! 10% discount');
    } else if (this.promoCode.toUpperCase() === 'SAVE20') {
      let subtotal = 0;
      this.cartTotal$.subscribe(total => subtotal = total).unsubscribe();
      this.discount = subtotal * 0.2;
      this.toastService.success('🎉 Promo code applied! 20% discount');
    } else if (this.promoCode) {
      this.toastService.error('❌ Invalid promo code');
    }
  }

  nextStep(): void {
    if (this.currentStep === 2 && !this.validateShipping()) {
      this.toastService.error('⚠️ Please fill in all required shipping fields');
      this.markFormGroupTouched(this.checkoutForm);
      return;
    }
    if (this.currentStep === 3 && !this.validatePayment()) {
      this.toastService.error('⚠️ Please complete payment information');
      this.markFormGroupTouched(this.checkoutForm);
      return;
    }
    
    if (this.currentStep < 4) {
      this.currentStep++;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  validateShipping(): boolean {
    const fields = ['fullName', 'email', 'phone', 'address', 'city', 'state', 'postalCode'];
    return fields.every(field => {
      const control = this.checkoutForm.get(field);
      return control && control.valid;
    });
  }

  validatePayment(): boolean {
    if (this.checkoutForm.get('paymentMethod')?.value === 'credit') {
      const fields = ['cardNumber', 'cardName', 'expiryDate', 'cvv'];
      return fields.every(field => {
        const control = this.checkoutForm.get(field);
        return control && control.valid;
      });
    }
    return true;
  }

  placeOrder(): void {
    if (!this.checkoutForm.valid) {
      this.toastService.error('Please complete all required fields');
      return;
    }

    this.isProcessing = true;
    this.orderNumber = 'ORD' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    
    // Simulate payment processing
    setTimeout(() => {
      this.orderSuccess = true;
      this.isProcessing = false;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Could add API call here to save order
      console.log('Order placed:', {
        orderNumber: this.orderNumber,
        shipping: this.checkoutForm.value,
        total: this.getTotal()
      });
      
      // Clear cart after successful order
      this.cartService.clearCart();
    }, 2000);
  }

  goToHome(): void {
    this.orderSuccess = false;
    this.router.navigate(['/']);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      formGroup.get(key)?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.checkoutForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.checkoutForm.get(fieldName);
    if (field?.hasError('required')) return 'This field is required';
    if (field?.hasError('email')) return 'Invalid email address';
    if (field?.hasError('pattern')) {
      if (fieldName === 'phone') return 'Invalid phone number';
      if (fieldName === 'postalCode') return 'Invalid postal code';
      if (fieldName === 'cardNumber') return 'Invalid card number (16 digits)';
      if (fieldName === 'cvv') return 'Invalid CVV';
      if (fieldName === 'expiryDate') return 'Invalid date (MM/YY)';
    }
    if (field?.hasError('minlength')) return `Minimum ${field.errors?.['minlength'].requiredLength} characters required`;
    return '';
  }
}
