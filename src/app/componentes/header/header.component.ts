import { Component, inject, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { BagService } from '../../services/bag.service';
import { UiService } from '../../services/ui.service';
import { AuthService } from '../../services/auth.service';
import { SideModalComponent } from '../side-modal/side-modal.component';
import { ProfileModalContentComponent } from '../profile-modal-content/profile-modal-content.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgOptimizedImage,
    SideModalComponent,
    ProfileModalContentComponent
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

  // Nova função para navegar para produtos com filtro
  navigateToProductsWithFilter(category?: string, subcategory?: string, tag?: string) {
    // Sempre limpar todos os filtros anteriores e aplicar apenas o novo filtro
    const queryParams: any = {};
    
    if (category) {
      queryParams.category = category;
      // Limpar subcategoria quando uma nova categoria principal é selecionada
      queryParams.subcategory = null;
      queryParams.tag = null;
    }
    
    if (subcategory) {
      queryParams.subcategory = subcategory;
      // Manter a categoria pai, mas limpar tag
      queryParams.tag = null;
    }
    
    if (tag) {
      queryParams.tag = tag;
      // Limpar categoria e subcategoria quando uma tag é selecionada
      queryParams.category = null;
      queryParams.subcategory = null;
    }

    this.router.navigate(['/products'], { 
      queryParams,
      queryParamsHandling: 'merge' // Isso garante que outros parâmetros sejam mantidos se necessário
    });
    this.uiService.closeAllModals();
  }

  // Função específica para "Todos os produtos" que limpa todos os filtros
  navigateToAllProducts() {
    this.router.navigate(['/products'], {
      queryParams: {} // Limpa todos os parâmetros
    });
    this.uiService.closeAllModals();
  }
}