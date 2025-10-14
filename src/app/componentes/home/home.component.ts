import { Component, inject, signal, ViewChild, ElementRef, AfterViewInit, output, OnDestroy, computed } from '@angular/core';
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
export class HomeComponent implements AfterViewInit, OnDestroy {
  bagService = inject(BagService);
  uiService = inject(UiService);
  private productService = inject(ProductService);
  authService = inject(AuthService);
  router = inject(Router);

  @ViewChild('productsContainer') productsContainer!: ElementRef;
  @ViewChild('heroCarousel') heroCarousel!: ElementRef;

  // Add ViewChild references for the new carousels
  @ViewChild('newReleasesContainer') newReleasesContainer!: ElementRef;
  @ViewChild('popularContainer') popularContainer!: ElementRef;
  @ViewChild('recommendedContainer') recommendedContainer!: ElementRef;

  // Product carousel signals
  productsPerPage = 5;
  productCardWidth = 220; // Approximate width including gap

  // Checkout alert
  checkout = output<void>();
  showCheckoutAlert = signal(false);
  orderCode = signal('');

  // Hero carousel
  currentIndex = signal(0);
  slides = [
    { imageUrl: '/img/carousel-1.png', alt: 'Mulher com maquiagem brilhante sorrindo' },
    { imageUrl: '/img/carousel-2.png', alt: 'Desconto de 50%' },
    { imageUrl: '/img/carousel-3.png', alt: 'Campanha de Outubro Rosa' },
  ];

  // Auto carousel
  private carouselInterval: any;
  isCarouselHovered = signal(false);

  // Products with computed values based on tags
  allProducts = this.productService.productsInStock;
  
  newReleases = computed(() => 
    this.allProducts().filter(product => 
      product.tags.includes('Lançamentos')
    )
  );

  popularProducts = computed(() => 
    this.allProducts().filter(product => 
      product.tags.includes('Populares')
    )
  );

  recommendedProducts = computed(() => 
    this.allProducts().filter(product => 
      product.tags.includes('Recomendado')
    )
  );

  // Carousel states for each section
  currentNewReleasesPage = signal(0);
  currentPopularPage = signal(0);
  currentRecommendedPage = signal(0);

  ngAfterViewInit() {
    this.calculateProductsPerPage();
    this.startAutoCarousel();
    
    // Recalculate on window resize
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => {
        this.calculateProductsPerPage();
      });
    }
  }

  ngOnDestroy() {
    this.stopAutoCarousel();
  }

  // Auto carousel methods
  startAutoCarousel() {
    this.carouselInterval = setInterval(() => {
      if (!this.isCarouselHovered()) {
        this.goToNext();
      }
    }, 6000); // Move every 6 seconds
  }

  stopAutoCarousel() {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }

  onCarouselMouseEnter() {
    this.isCarouselHovered.set(true);
  }

  onCarouselMouseLeave() {
    this.isCarouselHovered.set(false);
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
  showProductArrows(products: Product[]) {
    return products.length > this.productsPerPage;
  }

  // Show dots only if there are multiple pages
  showProductDots(products: Product[]) {
    return products.length > this.productsPerPage;
  }

  // Calculate number of dots needed
  getProductDots(products: Product[]): number[] {
    const totalPages = Math.ceil(products.length / this.productsPerPage);
    return Array(totalPages).fill(0).map((_, i) => i);
  }

  // Scroll products left or right - Updated methods
  scrollProducts(direction: number, carouselType: 'newReleases' | 'popular' | 'recommended') {
    let container: ElementRef;
    let currentPage: any;

    switch (carouselType) {
      case 'newReleases':
        container = this.newReleasesContainer;
        currentPage = this.currentNewReleasesPage;
        break;
      case 'popular':
        container = this.popularContainer;
        currentPage = this.currentPopularPage;
        break;
      case 'recommended':
        container = this.recommendedContainer;
        currentPage = this.currentRecommendedPage;
        break;
      default:
        return;
    }

    if (!container?.nativeElement) return;

    const scrollAmount = this.productCardWidth * this.productsPerPage;
    const totalPages = this.getProductDots(this.getProductsByType(carouselType)).length;
    
    if (direction === 1) {
      // Next page
      container.nativeElement.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      currentPage.update((current: number) => Math.min(current + 1, totalPages - 1));
    } else {
      // Previous page
      container.nativeElement.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      currentPage.update((current: number) => Math.max(current - 1, 0));
    }
  }

  // Go to specific page - Updated method
  goToProductPage(pageIndex: number, carouselType: 'newReleases' | 'popular' | 'recommended') {
    let container: ElementRef;
    let currentPage: any;

    switch (carouselType) {
      case 'newReleases':
        container = this.newReleasesContainer;
        currentPage = this.currentNewReleasesPage;
        break;
      case 'popular':
        container = this.popularContainer;
        currentPage = this.currentPopularPage;
        break;
      case 'recommended':
        container = this.recommendedContainer;
        currentPage = this.currentRecommendedPage;
        break;
      default:
        return;
    }

    if (!container?.nativeElement) return;

    const scrollAmount = this.productCardWidth * this.productsPerPage * pageIndex;
    container.nativeElement.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    currentPage.set(pageIndex);
  }

  // Helper method to get products by type
  private getProductsByType(type: 'newReleases' | 'popular' | 'recommended'): Product[] {
    switch (type) {
      case 'newReleases': return this.newReleases();
      case 'popular': return this.popularProducts();
      case 'recommended': return this.recommendedProducts();
      default: return [];
    }
  }

  // Hero carousel methods
  goToSlide(index: number) {
    this.currentIndex.set(index);
    // Reset auto carousel when manually changing slide
    this.resetAutoCarousel();
  }

  goToPrevious() {
    this.currentIndex.update(current => 
      current === 0 ? this.slides.length - 1 : current - 1
    );
    this.resetAutoCarousel();
  }

  goToNext() {
    this.currentIndex.update(current => 
      current === this.slides.length - 1 ? 0 : current + 1
    );
    this.resetAutoCarousel();
  }

  private resetAutoCarousel() {
    this.stopAutoCarousel();
    this.startAutoCarousel();
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