import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { BagService } from '../../services/bag.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  private bagService = inject(BagService);
  private orderService = inject(OrderService);
  public authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  // Estados reativos
  isLoading = signal(false);
  isLoggingIn = signal(false);
  
  // Dados de login
  loginEmail = '';
  loginPassword = '';
  showLoginPassword = false;

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
    const method = this.checkoutForm.get('shippingMethod')?.value;
    const total = this.bagTotal();
    
    if (method === 'express') {
      return 29.90;
    }
    
    return total >= 99 ? 0 : 15.90;
  });

  finalTotal = computed(() => {
    const total = this.bagTotal() + this.shippingCost();
    const paymentMethod = this.checkoutForm.get('paymentMethod')?.value;
    
    if (paymentMethod === 'pix') {
      return total * 0.95; // 5% de desconto
    }
    
    return total;
  });

  ngOnInit() {
    // Preenche o email se o usuário estiver logado
    if (this.authService.isAuthenticated()) {
      this.checkoutForm.patchValue({
        email: this.authService.currentUser()!,
        firstName: this.authService.currentUserName()?.split(' ')[0] || '',
        lastName: this.authService.currentUserName()?.split(' ').slice(1).join(' ') || ''
      });
    }

    // Atualiza validações baseadas no método de pagamento
    this.checkoutForm.get('paymentMethod')?.valueChanges.subscribe(method => {
      this.updatePaymentValidations(method);
    });

    // Atualiza validações baseadas no método de envio
    this.checkoutForm.get('shippingMethod')?.valueChanges.subscribe(() => {
      // Força atualização do custo de envio
      this.shippingCost();
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

  // Método de login
  login(): void {
    if (!this.loginEmail || !this.loginPassword) {
      alert('Por favor, preencha e-mail e senha');
      return;
    }

    this.isLoggingIn.set(true);

    this.authService.login(this.loginEmail, this.loginPassword)
      .subscribe({
        next: (success) => {
          this.isLoggingIn.set(false);
          if (success) {
            // Preenche automaticamente os dados do usuário
            this.checkoutForm.patchValue({
              email: this.authService.currentUser()!,
              firstName: this.authService.currentUserName()?.split(' ')[0] || '',
              lastName: this.authService.currentUserName()?.split(' ').slice(1).join(' ') || ''
            });
          } else {
            alert('E-mail ou senha inválidos');
          }
        },
        error: () => {
          this.isLoggingIn.set(false);
          alert('Erro ao fazer login. Tente novamente.');
        }
      });
  }

  navigateToRegister(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/register']);
  }

  completeOrder(): void {
    // Marca todos os campos como touched para mostrar erros
    this.markAllFieldsAsTouched();

    if (this.checkoutForm.invalid) {
      alert('Por favor, preencha todos os campos obrigatórios corretamente.');
      return;
    }

    // Validação específica para pagamento com cartão
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

      if (hasError) {
        alert('Por favor, preencha todos os dados do cartão corretamente.');
        return;
      }
    }

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

  // Marca todos os campos como touched para mostrar erros de validação
  private markAllFieldsAsTouched(): void {
    Object.keys(this.checkoutForm.controls).forEach(key => {
      const control = this.checkoutForm.get(key);
      control?.markAsTouched();
    });
  }

  // Helper methods para validação no template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.checkoutForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  // Getters para usar no template
  get isLoadingValue(): boolean {
    return this.isLoading();
  }

  get isLoggingInValue(): boolean {
    return this.isLoggingIn();
  }
}