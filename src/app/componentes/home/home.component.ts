import { Component, inject, signal, ViewChild, ElementRef, AfterViewInit, output } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Product } from '../models/product.model';
import { BagService } from '../../services/bag.service';
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
  bagService = inject(BagService);
  uiService = inject(UiService);
  private productService = inject(ProductService);
  authService = inject(AuthService);
  router = inject(Router);

  @ViewChild('productsContainer') productsContainer!: ElementRef;

  // Product carousel signals
  currentProductPage = signal(0);
  productsPerPage = 5;
  productCardWidth = 220; // Approximate width including gap

  // Checkout alert
  checkout = output<void>();
  showCheckoutAlert = signal(false);
  orderCode = signal('');

  // Hero carousel
  currentIndex = signal(0);
  slides = [
    { imageUrl: '/img/carousel-1.jpg', alt: 'Mulher com maquiagem brilhante sorrindo' },
    { imageUrl: '/img/carousel-2.jpg', alt: 'Desconto de 50%' },
    { imageUrl: '/img/carousel-3.jpg', alt: 'Campanha de Outubro Rosa' },
  ];

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

  // Bag methods
  onAddToBag(product: Product) {
    this.bagService.addToBag(product);
  }

  // Checkout method with alert
  onCheckout() {
    if (this.bagService.bagItems().length === 0) {
      return;
    }

    this.bagService.checkout().subscribe({
      next: (orderCode: string) => {
        this.orderCode.set(orderCode);
        this.showCheckoutAlert.set(true);
        
        // Auto-hide alert after 5 seconds
        setTimeout(() => {
          this.showCheckoutAlert.set(false);
        }, 5000);
      },
      error: (error) => {
        console.error('Checkout error:', error);
      }
    });
  }

  // Close alert manually
   closeCheckoutAlert() {
    this.showCheckoutAlert.set(false);
  }

  // Handle checkout event from header
  handleHeaderCheckout() {
    this.onCheckout();
  }
}