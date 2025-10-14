import { Component, inject, signal, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, AfterViewInit, OnDestroy {
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  private fb: FormBuilder = inject(FormBuilder);

  isLoading = false;
  hideRegister = signal(true);
  hideConfirm = signal(true);
  formSubmetido = false;

  // Carousel properties
  currentSlide = signal(0);
  private carouselInterval: any;
  isTransitioning = signal(false);
  
  slides = [
    { imageUrl: '/img/card-cadastro-1.png', alt: 'Imagem de registro - mulher aplicando maquiagem' },
    { imageUrl: '/img/card-cadastro-2.png', alt: 'Imagem de registro - produtos de beleza' },
    { imageUrl: '/img/card-cadastro-3.png', alt: 'Imagem de registro - modelo com make perfeita' }
  ];

  registerForm: FormGroup;

  constructor() {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      termos: [false, [Validators.requiredTrue]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.setupFormValidation();
  }

  ngAfterViewInit() {
    this.startCarousel();
  }

  ngOnDestroy() {
    this.stopCarousel();
  }

  // Carousel methods
  startCarousel() {
    this.carouselInterval = setInterval(() => {
      this.nextSlide();
    }, 4000); // Change slide every 4 seconds
  }

  stopCarousel() {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }

  nextSlide() {
    if (this.isTransitioning()) return;
    
    this.isTransitioning.set(true);
    const nextIndex = this.currentSlide() === this.slides.length - 1 ? 0 : this.currentSlide() + 1;
    
    // Update slide classes for transition
    this.currentSlide.set(nextIndex);
    
    // Reset transitioning state after animation completes
    setTimeout(() => {
      this.isTransitioning.set(false);
    }, 800);
  }

  goToSlide(index: number) {
    if (this.isTransitioning() || index === this.currentSlide()) return;
    
    this.isTransitioning.set(true);
    this.currentSlide.set(index);
    this.resetCarousel();
    
    setTimeout(() => {
      this.isTransitioning.set(false);
    }, 800);
  }

  private resetCarousel() {
    this.stopCarousel();
    this.startCarousel();
  }

  // Helper method to get slide class
  getSlideClass(index: number): string {
    if (index === this.currentSlide()) {
      return 'active';
    } else if (index === (this.currentSlide() + 1) % this.slides.length) {
      return 'next';
    } else if (index === (this.currentSlide() - 1 + this.slides.length) % this.slides.length) {
      return 'previous';
    } else {
      return '';
    }
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }
    return null;
  }

  private setupFormValidation() {
    this.registerForm.get('password')?.valueChanges.subscribe(() => {
      this.registerForm.get('confirmPassword')?.updateValueAndValidity();
    });
  }

  toggleRegisterPassword(event: MouseEvent) {
    event.preventDefault();
    this.hideRegister.set(!this.hideRegister());
  }

  toggleConfirmPassword(event: MouseEvent) {
    event.preventDefault();
    this.hideConfirm.set(!this.hideConfirm());
  }

  navegarParaLogin() {
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 150);
  }

  register() {
    this.formSubmetido = true;
    
    if (this.registerForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const { email, password } = this.registerForm.value;

    this.authService.register(email!, password!)
      .subscribe({
        next: (success: boolean) => {
          this.isLoading = false;
          if (success) {
            this.router.navigate(['/']);
          } else {
            alert('Este e-mail já está em uso');
          }
        },
        error: (error: any) => {
          this.isLoading = false;
          console.error('Erro no cadastro:', error);
          alert('Erro ao criar conta');
        }
      });
  }

  private markAllAsTouched() {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }

  continueAsGuest() {
    console.log('Navegando para home...');
    this.router.navigate(['/']).then(success => {
      console.log('Navegação bem-sucedida:', success);
    }).catch(error => {
      console.error('Erro na navegação:', error);
    });
  }

  get termos() {
    return this.registerForm.get('termos');
  }
}