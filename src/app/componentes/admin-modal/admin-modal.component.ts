import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UiService } from '../../services/ui.service';
import { BagService } from '../../services/bag.service';

@Component({
  selector: 'app-admin-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-modal.component.html',
  styleUrls: ['./admin-modal.component.css']
})
export class AdminModalComponent {
  uiService = inject(UiService);
  authService = inject(AuthService);
  bagService = inject(BagService);
  router = inject(Router);

  navigateTo(route: string, event: Event): void {
    event.preventDefault();
    this.uiService.closeAllModals();
    this.router.navigate([route]);
  }

  logout(): void {
    this.authService.logout();
    this.uiService.closeAllModals();
    this.bagService.clearBag();
  }
}