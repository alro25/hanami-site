// Em src/app/componentes/home/home.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Product } from '../models/product.model';
import { CartService } from '../../services/cart.service';
import { UiService } from '../../services/ui.service';
import { ProductService } from '../../services/product.service'; // Certifique-se que está importado

import { SideModalComponent } from '../side-modal/side-modal.component';
import { SearchOverlayComponent } from '../search-overlay/search-overlay.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, SideModalComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  cartService = inject(CartService);
  uiService = inject(UiService);
  private productService = inject(ProductService); // Injeção do ProductService

  currentIndex = signal(0);
  slides = [
    { imageUrl: '/img/carousel-1.png', alt: 'Mulher com maquiagem vibrante', title: 'BELEZA QUE INSPIRE', subtitle: 'Descubra sua melhor versão.' },
    { imageUrl: '/img/carousel-2.png', alt: 'Produtos de maquiagem em destaque', title: 'CORES QUE TRANSFORMAM', subtitle: 'Experimente a magia Hanami.' },
    { imageUrl: '/img/carousel-3.png', alt: 'Mulher jovem com maquiagem', title: 'SEU BRILHO ÚNICO', subtitle: 'Realce sua beleza natural.' },
  ];

  // popularProducts agora será um computed que filtra o Signal do ProductService
  popularProducts = this.productService.productsInStock;
  

  goToSlide(index: number) {
    this.currentIndex.set(index);
  }

  goToPrevious() {
    this.currentIndex.update(current => 
      current === 0 ? this.slides.length - 1 : current - 1
    );
  }

  goToNext() {
    this.currentIndex.update(current => 
      current === this.slides.length - 1 ? 0 : current + 1
    );
  }

  // ... (o restante do seu código permanece igual) ...

  onAddToCart(product: Product) {
    this.cartService.addToCart(product);
  }

  // Se você tinha getProductsByTag, precisará substituí-lo
  // getProductsByTag(tag: string) {
  //   // Exemplo: Filtrar produtos do stock com base em alguma propriedade 'tag' ou 'category'
  //   return this.productService.productsInStock().filter(p => p.category.includes(tag));
  // }

  // Métodos de navegação (se existirem)
  getNavLinks(): string[] {
    return ['Maquiagem', 'Cuidados', 'Promoções', 'Lançamentos'];
  }

  getSubmenu(link: string): string[] {
    switch (link) {
      case 'Maquiagem':
        return ['Olhos', 'Lábios', 'Pele', 'Pincéis'];
      case 'Cuidados':
        return ['Facial', 'Corporal', 'Capilar'];
      case 'Promoções':
        return ['Ofertas do Dia', 'Kits Promocionais'];
      case 'Lançamentos':
        return ['Novidades', 'Coleções'];
      default:
        return [];
    }
  }
  activeMenu = signal<string | null>(null);
   // <-- Direto do serviço

}