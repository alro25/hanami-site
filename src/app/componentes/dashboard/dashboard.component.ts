import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { Product } from '../../componentes/models/product.model';

Chart.register(...registerables);

export interface CarouselSlide {
  id: number;
  imageUrl: string;
  alt: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  buttonText: string;
  buttonLink: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements AfterViewInit, OnDestroy {
  private router = inject(Router);
  private authService = inject(AuthService);
  private productService = inject(ProductService);
  private charts: Chart[] = [];

  // Controle de abas
  activeTab = signal<'stats' | 'products' | 'carousel'>('stats');

  // Dados mockados para o dashboard
  dashboardData = signal({
    totalVendas: 12458.00,
    novosClientes: 47,
    totalPedidos: 89,
    ticketMedio: 139.97
  });

  // Gerenciamento de Produtos
  products = signal<Product[]>([]);
  editingProduct = signal<Product | null>(null);
  newProduct = signal<Partial<Product>>({
    name: '',
    price: 0,
    category: '',
    subcategory: '',
    description: '',
    imageUrl: '',
    stock: 0,
    tags: []
  });

  // Gerenciamento do Carrossel
  carouselSlides = signal<CarouselSlide[]>([]);
  editingSlide = signal<CarouselSlide | null>(null);
  newSlide = signal<Partial<CarouselSlide>>({
    imageUrl: '',
    alt: '',
    title: '',
    description: '',
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    isActive: true,
    buttonText: 'Ver Mais',
    buttonLink: '/products'
  });

  @ViewChild('vendasMensaisChart') vendasMensaisCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('topProdutosChart') topProdutosCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('categoriasPopularesChart') categoriasPopularesCanvas!: ElementRef<HTMLCanvasElement>;

  ngOnInit() {
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/']);
      return;
    }
    
    this.loadProducts();
    this.loadCarouselSlides();
  }

  ngAfterViewInit(): void {
    this.initCharts();
  }

  ngOnDestroy(): void {
    this.destroyCharts();
  }

  // ===== MÉTODOS DAS ABAS =====
  setActiveTab(tab: 'stats' | 'products' | 'carousel'): void {
    this.activeTab.set(tab);
  }

  // ===== GERENCIAMENTO DE PRODUTOS =====
  loadProducts(): void {
    // Carrega TODOS os produtos do serviço
    this.products.set(this.productService.getAllProducts());
  }

  addProduct(): void {
    const product = this.newProduct();
    if (product.name && product.price && product.category) {
      const newProduct: Product = {
        id: Date.now(),
        name: product.name!,
        price: product.price!,
        category: product.category!,
        subcategory: product.subcategory || '',
        description: product.description || '',
        imageUrl: product.imageUrl || '/img/placeholder-product.jpg',
        stock: product.stock || 0,
        tags: product.tags || []
      };

      this.productService.addProduct(newProduct);
      this.loadProducts();
      this.resetNewProduct();
    }
  }

  editProduct(product: Product): void {
    this.editingProduct.set({...product});
  }

  updateProduct(): void {
    const product = this.editingProduct();
    if (product) {
      this.productService.updateProduct(product);
      this.loadProducts();
      this.cancelEditProduct();
    }
  }

  cancelEditProduct(): void {
    this.editingProduct.set(null);
  }

  deleteProduct(productId: number): void {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      this.productService.removeProduct(productId);
      this.loadProducts();
    }
  }

  resetNewProduct(): void {
    this.newProduct.set({
      name: '',
      price: 0,
      category: '',
      subcategory: '',
      description: '',
      imageUrl: '',
      stock: 0,
      tags: []
    });
  }

  // ===== GERENCIAMENTO DO CARROSSEL =====
  loadCarouselSlides(): void {
    const slides: CarouselSlide[] = [
      {
        id: 1,
        imageUrl: '/img/carousel-1.png',
        alt: 'Mulher com maquiagem brilhante sorrindo',
        title: 'Coleção Verão 2024',
        description: 'Descubra os novos produtos da temporada',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        isActive: true,
        buttonText: 'Comprar Agora',
        buttonLink: '/products'
      },
      {
        id: 2,
        imageUrl: '/img/carousel-2.png',
        alt: 'Desconto de 50%',
        title: 'Oferta Especial',
        description: '50% de desconto em produtos selecionados',
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-03-31'),
        isActive: true,
        buttonText: 'Aproveitar',
        buttonLink: '/sale'
      }
    ];
    this.carouselSlides.set(slides);
  }

  addSlide(): void {
    const slide = this.newSlide();
    if (slide.imageUrl && slide.title) {
      const newSlide: CarouselSlide = {
        id: Date.now(),
        imageUrl: slide.imageUrl!,
        alt: slide.alt!,
        title: slide.title!,
        description: slide.description!,
        startDate: slide.startDate!,
        endDate: slide.endDate!,
        isActive: slide.isActive!,
        buttonText: slide.buttonText!,
        buttonLink: slide.buttonLink!
      };

      this.carouselSlides.update(slides => [...slides, newSlide]);
      this.resetNewSlide();
    }
  }

  editSlide(slide: CarouselSlide): void {
    this.editingSlide.set({...slide});
  }

  updateSlide(): void {
    const slide = this.editingSlide();
    if (slide) {
      this.carouselSlides.update(slides => 
        slides.map(s => s.id === slide.id ? slide : s)
      );
      this.cancelEditSlide();
    }
  }

  cancelEditSlide(): void {
    this.editingSlide.set(null);
  }

  deleteSlide(slideId: number): void {
    if (confirm('Tem certeza que deseja excluir este slide?')) {
      this.carouselSlides.update(slides => 
        slides.filter(s => s.id !== slideId)
      );
    }
  }

  toggleSlideStatus(slide: CarouselSlide): void {
    this.carouselSlides.update(slides => 
      slides.map(s => 
        s.id === slide.id ? { ...s, isActive: !s.isActive } : s
      )
    );
  }

  resetNewSlide(): void {
    this.newSlide.set({
      imageUrl: '',
      alt: '',
      title: '',
      description: '',
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      isActive: true,
      buttonText: 'Ver Mais',
      buttonLink: '/products'
    });
  }

  // ===== MÉTODOS AUXILIARES =====
  formatDateForInput(date: Date): string {
    return new Date(date).toISOString().slice(0, 16);
  }

  updateSlideDate(field: 'startDate' | 'endDate', event: Event): void {
    const input = event.target as HTMLInputElement;
    const date = new Date(input.value);
    
    if (this.editingSlide()) {
      this.editingSlide.set({
        ...this.editingSlide()!,
        [field]: date
      });
    } else {
      this.newSlide.set({
        ...this.newSlide(),
        [field]: date
      });
    }
  }

  // MÉTODO PARA CAMPOS DO PRODUTO
  onProductFieldChange(field: keyof Product, value: any): void {
    if (this.editingProduct()) {
      this.editingProduct.set({
        ...this.editingProduct()!,
        [field]: field === 'price' || field === 'stock' ? Number(value) : value
      });
    } else {
      this.newProduct.set({
        ...this.newProduct(),
        [field]: field === 'price' || field === 'stock' ? Number(value) : value
      });
    }
  }

  // MÉTODO PARA CAMPOS DO SLIDE
  onSlideFieldChange(field: keyof CarouselSlide, value: any): void {
    if (this.editingSlide()) {
      this.editingSlide.set({
        ...this.editingSlide()!,
        [field]: value
      });
    } else {
      this.newSlide.set({
        ...this.newSlide(),
        [field]: value
      });
    }
  }

  // MÉTODO PARA CHECKBOX DO SLIDE (ESPECÍFICO)
  onSlideActiveChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const isActive = input.checked;
    
    if (this.editingSlide()) {
      this.editingSlide.set({
        ...this.editingSlide()!,
        isActive
      });
    } else {
      this.newSlide.set({
        ...this.newSlide(),
        isActive
      });
    }
  }

  // ===== GRÁFICOS =====
  private initCharts(): void {
    this.createVendasMensaisChart();
    this.createTopProdutosChart();
    this.createCategoriasPopularesChart();
  }

  private destroyCharts(): void {
    this.charts.forEach(chart => chart.destroy());
    this.charts = [];
  }

  private createVendasMensaisChart(): void {
    if (!this.vendasMensaisCanvas?.nativeElement) return;

    const chart = new Chart(this.vendasMensaisCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        datasets: [{
          label: 'Vendas (R$)',
          data: [8500, 9200, 7800, 11000, 10500, 12458, 9800, 11200, 10800, 11500, 12000, 12500],
          borderColor: '#E964BD',
          backgroundColor: 'rgba(233, 100, 189, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0, 0, 0, 0.1)' },
            ticks: {
              callback: (value) => `R$ ${value}`
            }
          },
          x: {
            grid: { display: false }
          }
        }
      }
    });
    
    this.charts.push(chart);
  }

  private createTopProdutosChart(): void {
    if (!this.topProdutosCanvas?.nativeElement) return;

    const chart = new Chart(this.topProdutosCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Base Líquida', 'Pó Compacto', 'Batom Vermelho', 'Paleta Sombras', 'Delineador'],
        datasets: [{
          label: 'Unidades Vendidas',
          data: [45, 38, 32, 28, 25],
          backgroundColor: ['#E964BD', '#F28EC9', '#F8B6D9', '#FFDDEE', '#E0E0E0'],
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: { color: 'rgba(0, 0, 0, 0.1)' }
          },
          y: {
            grid: { display: false }
          }
        }
      }
    });
    
    this.charts.push(chart);
  }

  private createCategoriasPopularesChart(): void {
    if (!this.categoriasPopularesCanvas?.nativeElement) return;

    const chart = new Chart(this.categoriasPopularesCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Lançamentos', 'Rosto', 'Lábios', 'Olhos', 'Pincéis'],
        datasets: [{
          data: [45, 25, 15, 10, 5],
          backgroundColor: ['#E964BD', '#F28EC9', '#F8B6D9', '#FFDDEE', '#F5F5F5'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              padding: 20
            }
          }
        },
        cutout: '60%'
      }
    });
    
    this.charts.push(chart);
  }

  voltarParaHome(): void {
    this.router.navigate(['/']);
  }
}