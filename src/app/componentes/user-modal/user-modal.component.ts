import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UiService } from '../../services/ui.service';
import { BagService } from '../../services/bag.service';
import { UserService } from '../../services/user.service';
import { Order, OrderService } from '../../services/order.service';

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
  userService = inject(UserService);
  router = inject(Router);

  activeTab = signal<'account' | 'orders'>('account');

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

  setActiveTab(tab: 'account' | 'orders'): void {
    this.activeTab.set(tab);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Entregue': return 'status-entregue';
      case 'Pendente': return 'status-pendente';
      case 'Processando': return 'status-processando';
      case 'Cancelado': return 'status-cancelado';
      default: return 'status-pendente';
    }
  }
}