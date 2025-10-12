import { Component, inject, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common'; // Add NgOptimizedImage
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
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
    NgOptimizedImage, // Add this import
    SideModalComponent,
    ProfileModalContentComponent
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  cartService = inject(CartService);
  uiService = inject(UiService);
  authService = inject(AuthService);

  activeMenu = signal<string | null>(null);

  getNavLinks(): string[] {
    return ['Todos os produtos', 'Lançamentos', 'Rosto', 'Lábios', 'Olhos', 'Sobrancelha', 'Sobre nós', 'Contato'];
  }

  getSubmenu(link: string): string[] {
    if (['Todos os produtos', 'Sobre nós', 'Contato'].includes(link)) {
      return [];
    }
    
    switch (link) {
      case 'Lançamentos':
        return ['Novidades', 'Kits', 'Edições Limitadas'];
      case 'Rosto':
        return ['Base', 'Corretivo', 'Pó', 'Blush', 'Iluminador'];
      case 'Lábios':
        return ['Batom', 'Gloss', 'Lápis Labial', 'Bálsamo'];
      case 'Olhos':
        return ['Sombra', 'Máscara', 'Delineador', 'Lápis de Olho'];
      case 'Sobrancelha':
        return ['Lápis', 'Gel', 'Pasta', 'Sérum'];
      default:
        return [];
    }
  }
}