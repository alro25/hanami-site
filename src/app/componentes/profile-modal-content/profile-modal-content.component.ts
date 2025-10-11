import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UiService } from '../../services/ui.service';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-profile-modal-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-modal-content.component.html', // Reference external HTML
  styleUrls: ['./profile-modal-content.component.css'] // Reference external CSS
})
export class ProfileModalContentComponent {
  uiService = inject(UiService);
  authService = inject(AuthService);
  cartService = inject(CartService);
  router = inject(Router);

  getLocalStorageAuth(): string {
    return localStorage.getItem('isAuthenticated') || 'false';
  }

  goToDashboard(event: Event) {
    event.preventDefault();
    this.uiService.closeAllModals();
    this.router.navigate(['/dashboard']);
  }

  goToLogin(event: Event) {
    event.preventDefault();
    this.uiService.closeAllModals();
    this.router.navigate(['/login']);
  }

  logout() {
    this.authService.logout();
    this.uiService.closeAllModals();
  }
}