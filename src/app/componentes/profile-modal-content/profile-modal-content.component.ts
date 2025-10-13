import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UiService } from '../../services/ui.service';
import { AuthService } from '../../services/auth.service';
import { BagService } from '../../services/bag.service';

@Component({
  selector: 'app-profile-modal-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-modal-content.component.html',
  styleUrls: ['./profile-modal-content.component.css']
})
export class ProfileModalContentComponent {
  uiService = inject(UiService);
  authService = inject(AuthService);
  bagservice = inject(BagService);
  router = inject(Router);

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

  goToRegister(event: Event) {
    event.preventDefault();
    this.uiService.closeAllModals();
    this.router.navigate(['/register']);
  }

  logout() {
    this.authService.logout();
    this.uiService.closeAllModals();
    this.bagservice.clearBag();
  }
}