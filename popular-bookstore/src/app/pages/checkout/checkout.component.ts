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

  onSubmit(): void {
    if (this.checkoutForm.valid && !this.isProcessing) {
      this.isProcessing = true;
      
      // Simulate payment processing
      setTimeout(() => {
        this.toastService.success('Order placed successfully! 🎉');
        this.cartService.clearCart();
        this.isProcessing = false;
        this.router.navigate(['/']);
      }, 2000);
    } else {
      this.toastService.error('Please fill in all required fields correctly');
      this.markFormGroupTouched(this.checkoutForm);
    }
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
      if (fieldName === 'cardNumber') return 'Invalid card number';
      if (fieldName === 'cvv') return 'Invalid CVV';
      if (fieldName === 'expiryDate') return 'Invalid date (MM/YY)';
    }
    if (field?.hasError('minlength')) return `Minimum ${field.errors?.['minlength'].requiredLength} characters required`;
    return '';
  }
}
