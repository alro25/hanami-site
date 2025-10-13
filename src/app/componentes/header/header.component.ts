import { Component, inject, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common'; // Add NgOptimizedImage
import { RouterModule } from '@angular/router';
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
    NgOptimizedImage, // Add this import
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
}