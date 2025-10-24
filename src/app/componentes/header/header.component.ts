import { Component, inject, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { BagService } from '../../services/bag.service';
import { UiService } from '../../services/ui.service';
import { AuthService } from '../../services/auth.service';
import { BagModalComponent } from '../bag-modal/bag-modal.component';
import { UserModalComponent } from '../user-modal/user-modal.component';
import { AdminModalComponent } from '../admin-modal/admin-modal.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgOptimizedImage,
    BagModalComponent,
    UserModalComponent,
    AdminModalComponent
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  bagService = inject(BagService);
  uiService = inject(UiService);
  authService = inject(AuthService);
  private router = inject(Router);

  activeMenu = signal<string | null>(null);

  getNavLinks(): string[] {
    return ['Todos os produtos', 'Lançamentos', 'Rosto', 'Lábios', 'Olhos', 'Pincéis', 'Sobre nós', 'Contato'];
  }

  getSubmenu(link: string): string[] {
    if (['Todos os produtos', 'Lançamentos','Sobre nós', 'Contato'].includes(link)) {
      return [];
    }
    
    switch (link) {
      case 'Rosto':
        return ['Base', 'Corretivo', 'Pó', 'Blush'];
      case 'Lábios':
        return ['Batom', 'Gloss', 'Lápis Labial'];
      case 'Olhos':
        return ['Sombra', 'Máscara', 'Delineador'];
      case 'Pincéis':
        return ['Pincéis para os Olhos', 'Pincéis para o rosto'];
      default:
        return [];
    }
  }

  navigateToProductsWithFilter(category?: string, subcategory?: string, tag?: string) {
    const queryParams: any = {};
    
    if (category) {
      queryParams.category = category;
      queryParams.subcategory = null;
      queryParams.tag = null;
    }
    
    if (subcategory) {
      queryParams.subcategory = subcategory;
      queryParams.tag = null;
    }
    
    if (tag) {
      queryParams.tag = tag;
      queryParams.category = null;
      queryParams.subcategory = null;
    }

    this.router.navigate(['/products'], { 
      queryParams,
      queryParamsHandling: 'merge'
    });
    this.uiService.closeAllModals();
  }

  navigateToAllProducts() {
    this.router.navigate(['/products']);
    this.uiService.closeAllModals();
  }

  openUserModal() {
    if (this.authService.isAuthenticated()) {
      if (this.authService.isAdmin()) {
        // Se for admin, abre o modal de admin
        this.uiService.openModal('admin');
      } else {
        // Se for usuário comum, abre o modal de usuário
        this.uiService.openModal('user');
      }
    } else {
      // Se não estiver autenticado, abre o modal de usuário (para login/cadastro)
      this.uiService.openModal('user');
    }
  }
}