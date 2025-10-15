import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UiService } from '../../services/ui.service';
import { BagService } from '../../services/bag.service';

@Component({
  selector: 'app-user-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.css']
})
export class UserModalComponent {
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