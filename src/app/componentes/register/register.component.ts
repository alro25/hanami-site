import { Component, inject, signal, OnInit } from '@angular/core';
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
export class RegisterComponent implements OnInit {
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  private fb: FormBuilder = inject(FormBuilder);

  isLoading = false;
  hideRegister = signal(true);
  hideConfirm = signal(true);
  formSubmetido = false;

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

  // Getter para facilitar o acesso ao controle de termos
  get termos() {
    return this.registerForm.get('termos');
  }
}