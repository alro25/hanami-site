// home.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common'; // NgOptimizedImage para as imagens dos produtos!
import { RouterLink } from '@angular/router';
import { SideModalComponent } from '../side-modal/side-modal.component';
import { UiService } from '../../services/ui.service.js';
import { CartService } from '../../services/cart.service';
import { Product } from '../models/product.model';

interface CarouselSlide {
  imageUrl: string;
  alt: string;
  title: string;
  subtitle: string;
}

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

  slides: CarouselSlide[] = [
    {
      imageUrl: '/img/carousel-1.png', // Lembre-se de colocar as imagens em src/assets/img
      alt: 'Modelo mostrando um gloss brilhante',
      title: 'Brilho Incomparável',
      subtitle: 'Nossa nova linha de gloss com efeito espelhado.'
    },
    {
      imageUrl: '/img/carousel-2.png',
      alt: 'Close-up de uma paleta de sombras coloridas',
      title: 'Cores Vibrantes',
      subtitle: 'Explore as possibilidades com a paleta de sombras Papillon.'
    },
    {
      imageUrl: '/img/carousel-3.png',
      alt: 'Diversos batons em tons de vermelho e rosa',
      title: 'Acabamento Perfeito',
      subtitle: 'Batom matte que dura o dia todo, sem ressecar.'
    }
  ];

  currentIndex = signal(0);
  private intervalId?: any; // Usamos 'any' para compatibilidade com Node.js e Browser

  // 2. Ciclo de Vida: Inicialização e Limpeza
  ngOnInit(): void {
    this.startAutoplay();
  }

  ngOnDestroy(): void {
    // É CRUCIAL limpar o intervalo para evitar vazamentos de memória!
    this.stopAutoplay();
  }

  // 3. Lógica de Navegação
  goToPrevious(): void {
    const isFirstSlide = this.currentIndex() === 0;
    const newIndex = isFirstSlide ? this.slides.length - 1 : this.currentIndex() - 1;
    this.currentIndex.set(newIndex);
    this.resetAutoplay();
  }

  goToNext(): void {
    const isLastSlide = this.currentIndex() === this.slides.length - 1;
    const newIndex = isLastSlide ? 0 : this.currentIndex() + 1;
    this.currentIndex.set(newIndex);
    this.resetAutoplay();
  }
  
  goToSlide(slideIndex: number): void {
    this.currentIndex.set(slideIndex);
    this.resetAutoplay();
  }

  // 4. Lógica de Autoplay
  private startAutoplay(): void {
    // 5 segundos é um tempo excelente, recomendado para que o usuário consiga ler o conteúdo.
    this.intervalId = setInterval(() => {
      this.goToNext();
    }, 5000);
  }

  private stopAutoplay(): void {
    clearInterval(this.intervalId);
  }

  private resetAutoplay(): void {
    this.stopAutoplay();
    this.startAutoplay();
  }

  // Vamos simular alguns produtos
  popularProducts: Product[] = [
    { id: 1, name: 'Batom Vermelho Intenso', price: 89.90, imageUrl: '/img/batom.jpg'},
    { id: 2, name: 'Base Matte HD', price: 129.90, imageUrl: '/img/base.jpg'},
    { id: 3, name: 'Paleta de Sombras Nude', price: 199.90, imageUrl: '/img/paleta.jpg'},
    { id: 4, name: 'Gloss Brilhante', price: 79.90, imageUrl: '/img/gloss.jpg' }
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