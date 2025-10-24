import { Component, inject, signal } from '@angular/core';
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
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  isLoading = false;
  hideRegister = signal(true);
  hideConfirm = signal(true);
  formSubmetido = false;

  registerForm: FormGroup;

  constructor() {
    this.registerForm = this.fb.group({
      nome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      termos: [false, [Validators.requiredTrue]]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    }
    return null;
  }

  toggleRegisterPassword(event: MouseEvent) {
    event.preventDefault();
    this.hideRegister.set(!this.hideRegister());
  }

  toggleConfirmPassword(event: MouseEvent) {
    event.preventDefault();
    this.hideConfirm.set(!this.hideConfirm());
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  register() {
    this.formSubmetido = true;
    
    if (this.registerForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const { nome, email, password } = this.registerForm.value;

    this.authService.register(nome, email, password)
      .subscribe({
        next: (success) => {
          this.isLoading = false;
          if (success) {
            this.router.navigate(['/login']);
          } else {
            alert('Este e-mail já está em uso');
          }
        },
        error: () => {
          this.isLoading = false;
          alert('Erro ao criar conta');
        }
      });
  }

  private markAllAsTouched() {
    Object.keys(this.registerForm.controls).forEach(key => {
      this.registerForm.get(key)?.markAsTouched();
    });
  }

  continueAsGuest() {
    this.router.navigate(['/']);
  }
}