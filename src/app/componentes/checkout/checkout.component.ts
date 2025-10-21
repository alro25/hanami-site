import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BagService } from '../../services/bag.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  private bagService = inject(BagService);
  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  // Estados reativos
  isLoading = signal(false);
  currentStep = signal<'information' | 'shipping' | 'payment'>('information');

  // Formulário de checkout
  checkoutForm = this.fb.group({
    // Informações de contato
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\) \d{4,5}-\d{4}$/)]],
    
    // Endereço de entrega
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    address: ['', [Validators.required, Validators.minLength(5)]],
    city: ['', [Validators.required]],
    state: ['', [Validators.required]],
    zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}-\d{3}$/)]],
    country: ['Brasil', [Validators.required]],
    
    // Método de envio
    shippingMethod: ['standard', [Validators.required]],
    
    // Método de pagamento
    paymentMethod: ['credit', [Validators.required]],
    cardNumber: ['', [Validators.pattern(/^\d{4} \d{4} \d{4} \d{4}$/)]],
    expiryDate: ['', [Validators.pattern(/^\d{2}\/\d{2}$/)]],
    cvv: ['', [Validators.pattern(/^\d{3}$/)]],
    cardName: ['']
  });

  // Computed values
  bagItems = this.bagService.bagItems;
  bagTotal = this.bagService.bagTotal;
  itemCount = this.bagService.itemCount;

  shippingCost = computed(() => {
    const total = this.bagTotal();
    return total >= 99 ? 0 : 15.90;
  });

  finalTotal = computed(() => {
    return this.bagTotal() + this.shippingCost();
  });

  ngOnInit() {
    // Preenche o email se o usuário estiver logado
    if (this.authService.currentUser()) {
      this.checkoutForm.patchValue({
        email: this.authService.currentUser()!
      });
    }

    // Atualiza validações baseadas no método de pagamento
    this.checkoutForm.get('paymentMethod')?.valueChanges.subscribe(method => {
      this.updatePaymentValidations(method);
    });
  }

  private updatePaymentValidations(paymentMethod: string | null) {
    const cardNumber = this.checkoutForm.get('cardNumber');
    const expiryDate = this.checkoutForm.get('expiryDate');
    const cvv = this.checkoutForm.get('cvv');
    const cardName = this.checkoutForm.get('cardName');

    if (paymentMethod === 'credit' || paymentMethod === 'debit') {
      cardNumber?.setValidators([Validators.required, Validators.pattern(/^\d{4} \d{4} \d{4} \d{4}$/)]);
      expiryDate?.setValidators([Validators.required, Validators.pattern(/^\d{2}\/\d{2}$/)]);
      cvv?.setValidators([Validators.required, Validators.pattern(/^\d{3}$/)]);
      cardName?.setValidators([Validators.required]);
    } else {
      cardNumber?.clearValidators();
      expiryDate?.clearValidators();
      cvv?.clearValidators();
      cardName?.clearValidators();
    }

    cardNumber?.updateValueAndValidity();
    expiryDate?.updateValueAndValidity();
    cvv?.updateValueAndValidity();
    cardName?.updateValueAndValidity();
  }

  nextStep(): void {
    // Valida a etapa atual antes de avançar
    if (this.currentStep() === 'information') {
      const emailControl = this.checkoutForm.get('email');
      const phoneControl = this.checkoutForm.get('phone');
      
      if (emailControl?.invalid || phoneControl?.invalid) {
        emailControl?.markAsTouched();
        phoneControl?.markAsTouched();
        return;
      }
    } else if (this.currentStep() === 'shipping') {
      const shippingControls = ['firstName', 'lastName', 'address', 'city', 'state', 'zipCode'];
      let hasError = false;
      
      shippingControls.forEach(controlName => {
        const control = this.checkoutForm.get(controlName);
        if (control?.invalid) {
          control.markAsTouched();
          hasError = true;
        }
      });

      if (hasError) return;
    }

    const steps: Array<'information' | 'shipping' | 'payment'> = ['information', 'shipping', 'payment'];
    const currentIndex = steps.indexOf(this.currentStep());
    if (currentIndex < steps.length - 1) {
      this.currentStep.set(steps[currentIndex + 1]);
    }
  }

  previousStep(): void {
    const steps: Array<'information' | 'shipping' | 'payment'> = ['information', 'shipping', 'payment'];
    const currentIndex = steps.indexOf(this.currentStep());
    if (currentIndex > 0) {
      this.currentStep.set(steps[currentIndex - 1]);
    }
  }

  completeOrder(): void {
    // Valida a etapa de pagamento
    if (this.currentStep() === 'payment') {
      const paymentMethod = this.checkoutForm.get('paymentMethod')?.value;
      
      if (paymentMethod === 'credit' || paymentMethod === 'debit') {
        const cardControls = ['cardNumber', 'expiryDate', 'cvv', 'cardName'];
        let hasError = false;
        
        cardControls.forEach(controlName => {
          const control = this.checkoutForm.get(controlName);
          if (control?.invalid) {
            control.markAsTouched();
            hasError = true;
          }
        });

        if (hasError) return;
      }
    }

    if (this.checkoutForm.invalid) return;

    this.isLoading.set(true);

    // Simula processamento do pedido
    setTimeout(() => {
      const order = this.orderService.createOrderFromBag(
        `${this.checkoutForm.value.firstName} ${this.checkoutForm.value.lastName}`,
        this.bagItems()
      );

      this.bagService.clearBag();
      this.isLoading.set(false);
      
      // Redireciona para confirmação
      this.router.navigate(['/order-confirmation', order.id]);
    }, 2000);
  }

  continueShopping(): void {
    this.router.navigate(['/']);
  }

  // Helper methods para validação no template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.checkoutForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }
}