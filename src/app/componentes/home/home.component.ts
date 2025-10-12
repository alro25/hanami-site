import { Component, inject, signal, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Product } from '../models/product.model';
import { CartService } from '../../services/cart.service';
import { UiService } from '../../services/ui.service';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component'; 
import { FooterComponent } from '../footer/footer.component'; 

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, HeaderComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit {
  cartService = inject(CartService);
  uiService = inject(UiService);
  private productService = inject(ProductService);
  authService = inject(AuthService);
  router = inject(Router);

  @ViewChild('productsContainer') productsContainer!: ElementRef;

  // Product carousel signals
  currentProductPage = signal(0);
  productsPerPage = 5;
  productCardWidth = 220; // Approximate width including gap

  // Hero carousel
  currentIndex = signal(0);
  slides = [
    { imageUrl: '/img/carousel-1.jpg', alt: 'Mulher com maquiagem vibrante' },
    { imageUrl: '/img/carousel-2.jpg', alt: 'Produtos de maquiagem em destaque' },
    { imageUrl: '/img/carousel-3.jpg', alt: 'Mulher jovem com maquiagem' },
  ];

  // Remove navigation-related signals and methods since they'll be in HeaderComponent
  // Remove: activeMenu, getNavLinks(), getSubmenu()

  // Products
  popularProducts = this.productService.productsInStock;

  ngAfterViewInit() {
    this.calculateProductsPerPage();
    
    // Recalculate on window resize
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => {
        this.calculateProductsPerPage();
      });
    }
  }

  // Calculate how many products fit per page based on screen size
  calculateProductsPerPage() {
    if (typeof window !== 'undefined') {
      const screenWidth = window.innerWidth;
      if (screenWidth >= 1200) {
        this.productsPerPage = 5;
      } else if (screenWidth >= 768) {
        this.productsPerPage = 4;
      } else if (screenWidth >= 480) {
        this.productsPerPage = 3;
      } else {
        this.productsPerPage = 2;
      }
    }
  }

  // Show arrows only if there are more products than can fit on one page
  showProductArrows = () => {
    return this.popularProducts().length > this.productsPerPage;
  }

  // Show dots only if there are multiple pages
  showProductDots = () => {
    return this.popularProducts().length > this.productsPerPage;
  }

  // Calculate number of dots needed
  getProductDots(): number[] {
    const totalPages = Math.ceil(this.popularProducts().length / this.productsPerPage);
    return Array(totalPages).fill(0).map((_, i) => i);
  }

  // Scroll products left or right
  scrollProducts(direction: number) {
    const container = this.productsContainer?.nativeElement;
    if (!container) return;

    const scrollAmount = this.productCardWidth * this.productsPerPage;
    
    if (direction === 1) {
      // Next page
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      this.currentProductPage.update(current => 
        Math.min(current + 1, this.getProductDots().length - 1)
      );
    } else {
      // Previous page
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      this.currentProductPage.update(current => Math.max(current - 1, 0));
    }
  }

  // Go to specific page
  goToProductPage(pageIndex: number) {
    const container = this.productsContainer?.nativeElement;
    if (!container) return;

    const scrollAmount = this.productCardWidth * this.productsPerPage * pageIndex;
    container.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    this.currentProductPage.set(pageIndex);
  }

  // Hero carousel methods
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

  // Cart methods
  onAddToCart(product: Product) {
    this.cartService.addToCart(product);
  }

  // Remove auth methods that are now in HeaderComponent
  // Remove: goToDashboard(), goToLogin(), logout(), getLocalStorageAuth()
}