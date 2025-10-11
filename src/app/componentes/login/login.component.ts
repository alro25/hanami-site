import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Component, inject, signal } from '@angular/core';
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
  imports: [CommonModule,MatFormFieldModule,MatInputModule, MatIconModule,MatButtonModule, FormsModule, NgOptimizedImage],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  usuario: string = '';
  senha: string = '';
  dataAtual = new Date();

  private authService = inject(AuthService); // Add AuthService
  private router = inject(Router);

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
  login() {
    // Use the AuthService.login() method instead of hardcoded check
    if (this.authService.login(this.usuario, this.senha)) {
      this.router.navigate(['/']);
    } else {
      alert('Usuário ou senha inválidos');
    }
  }

  // Add this method for guest access
  continueAsGuest() {
    this.router.navigate(['/']);
  }
}
