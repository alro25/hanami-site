// home.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common'; // NgOptimizedImage para as imagens dos produtos!
import { RouterLink } from '@angular/router';
import { SideModalComponent } from '../side-modal/side-modal.component';
import { UiService } from '../../services/ui.service.js';
import { CartService } from '../../services/cart.service';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterLink, SideModalComponent], // Adicionaremos mais coisas aqui
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  uiService = inject(UiService);
  cartService = inject(CartService);

  // Vamos simular alguns produtos
  popularProducts: Product[] = [
    { id: 1, name: 'Batom Vermelho Intenso', price: 89.90, imageUrl: 'assets/img/batom.jpg' },
    { id: 2, name: 'Base Matte HD', price: 129.90, imageUrl: 'assets/img/base.jpg' },
    { id: 3, name: 'Paleta de Sombras Nude', price: 199.90, imageUrl: 'assets/img/paleta.jpg' },
    { id: 4, name: 'Gloss Brilhante', price: 79.90, imageUrl: 'assets/img/gloss.jpg' },
  ];

  onAddToCart(product: Product) {
    this.cartService.addToCart(product);
    this.uiService.isCartOpen.set(true); // Abre o carrinho ao adicionar
  }

  activeMenu = signal<string | null>(null);

  // Estrutura do menu
  navMenu = {
    'Lançamentos': ['Novidades', 'Kits', 'Edições Limitadas'],
    'Lábios': ['Batom', 'Gloss', 'Lápis Labial'],
    'Rosto': ['Base', 'Corretivo', 'Pó', 'Blush'],
    'Olhos': ['Sombra', 'Máscara', 'Delineador'],
    'Sobrancelha': ['Lápis', 'Gel', 'Pasta']
  };

  getNavLinks() {
    return Object.keys(this.navMenu);
  }

  getSubmenu(link: string): string[] {
    return this.navMenu[link as keyof typeof this.navMenu] || [];
  }
}