// src/app/componentes/home/home.component.ts
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { SideModalComponent } from '../side-modal/side-modal.component';
import { UiService } from '../../services/ui.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../models/product.model';
import { ProductService } from '../../services/product.service';

interface CarouselSlide {
  imageUrl: string;
  alt: string;
  title: string;
  subtitle: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterLink, SideModalComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  uiService = inject(UiService);
  cartService = inject(CartService);
  productService = inject(ProductService);

  popularProducts = toSignal(
    this.productService.getProductsByTag('lancamento'), 
    { initialValue: [] }
  );

  slides: CarouselSlide[] = [
    {
      imageUrl: '/img/carousel-1.png', // Usando o caminho que você prefere
      alt: 'Modelo mostrando um gloss brilhante',
      title: 'Brilho Incomparável',
      subtitle: 'Nossa nova linha de gloss com efeito espelhado.'
    },
    {
      imageUrl: '/img/carousel-2.png', // Usando o caminho que você prefere
      alt: 'Close-up de uma paleta de sombras coloridas',
      title: 'Cores Vibrantes',
      subtitle: 'Explore as possibilidades com a paleta de sombras Papillon.'
    },
    {
      imageUrl: '/img/carousel-3.png', // Usando o caminho que você prefere
      alt: 'Diversos batons em tons de vermelho e rosa',
      title: 'Acabamento Perfeito',
      subtitle: 'Batom matte que dura o dia todo, sem ressecar.'
    }
  ];

  currentIndex = signal(0);
  private intervalId?: any;

  // ESTA PARTE É ESSENCIAL PARA O CARROSSEL SE MOVER
  ngOnInit(): void {
    this.startAutoplay();
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }
  // FIM DA PARTE ESSENCIAL

  goToPrevious(): void {
    const isFirstSlide = this.currentIndex() === 0;
    this.currentIndex.set(isFirstSlide ? this.slides.length - 1 : this.currentIndex() - 1);
    this.resetAutoplay();
  }

  goToNext(): void {
    const isLastSlide = this.currentIndex() === this.slides.length - 1;
    this.currentIndex.set(isLastSlide ? 0 : this.currentIndex() + 1);
    this.resetAutoplay();
  }
  
  goToSlide(slideIndex: number): void {
    this.currentIndex.set(slideIndex);
    this.resetAutoplay();
  }

  private startAutoplay(): void {
    this.intervalId = setInterval(() => this.goToNext(), 5000);
  }

  private stopAutoplay(): void {
    clearInterval(this.intervalId);
  }

  private resetAutoplay(): void {
    this.stopAutoplay();
    this.startAutoplay();
  }

  onAddToCart(product: Product) {
    this.cartService.addToCart(product);
    this.uiService.isCartOpen.set(true);
  }

  activeMenu = signal<string | null>(null);

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