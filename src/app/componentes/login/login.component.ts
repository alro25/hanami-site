import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { NgOptimizedImage } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, MatFormFieldModule, MatInputModule, 
    MatIconModule, MatButtonModule, FormsModule, 
    NgOptimizedImage
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  usuario: string = '';
  senha: string = '';
  isLoading = false;

  private authService = inject(AuthService);
  private router = inject(Router);

  hide = signal(true);

  clickEvent(event: MouseEvent) {
    event.preventDefault();
    this.hide.set(!this.hide());
  }

  navegarParaRegister() {
    this.router.navigate(['/register']);
  }

  login() {
    if (!this.usuario || !this.senha) return;

    this.isLoading = true;
    this.authService.login(this.usuario, this.senha)
      .subscribe({
        next: (success) => {
          this.isLoading = false;
          if (success) {
            this.router.navigate(['/']);
          } else {
            alert('E-mail ou senha inválidos');
          }
        },
        error: () => {
          this.isLoading = false;
          alert('Erro ao fazer login');
        }
      });
  }

  continueAsGuest() {
    this.router.navigate(['/']);
  }
}