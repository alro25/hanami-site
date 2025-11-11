import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Product } from '../models/product.model';
import { ProductService } from '../../services/product.service';
import { BagService } from '../../services/bag.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

interface Category {
  name: string;
  subcategories: string[];
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  private productService = inject(ProductService);
  private bagService = inject(BagService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // CORREÇÃO: Usar getAllProducts() em vez de productsInStock
  allProducts = this.productService.getAllProducts();
  
  // Sorting
  sortOption = signal<'name-asc' | 'name-desc' | 'price-asc' | 'price-desc'>('name-asc');
  
  // Filtering
  selectedCategories = signal<string[]>([]);
  selectedSubcategories = signal<string[]>([]);
  selectedTags = signal<string[]>([]);
  
  // Available categories and subcategories
  categories = signal<Category[]>([
    { 
      name: 'Rosto', 
      subcategories: ['Base', 'Corretivo', 'Pó', 'Blush'] 
    },
    { 
      name: 'Lábios', 
      subcategories: ['Batom', 'Gloss', 'Lapis Labial'] 
    },
    { 
      name: 'Olhos', 
      subcategories: ['Sombra', 'Mascara', 'Delineador'] 
    },
    { 
      name: 'Pincéis', 
      subcategories: ['Pincel de Rosto', 'Pincel de Olhos'] 
    },
    { 
      name: 'Kits', 
      subcategories: [] 
    }
  ]);

  // CORREÇÃO: Computed para produtos filtrados
  filteredProducts = computed(() => {
    let products = this.allProducts;
    
    // Filter by categories
    if (this.selectedCategories().length > 0) {
      products = products.filter(product => 
        this.selectedCategories().some(category => 
          this.getCategoryMapping(category).includes(product.category)
        )
      );
    }
    
    // Filter by subcategories
    if (this.selectedSubcategories().length > 0) {
      products = products.filter(product => 
        this.selectedSubcategories().some(subcategory => 
          this.getSubcategoryMapping(subcategory).includes(product.category)
        )
      );
    }
    
    // Filter by tags
    if (this.selectedTags().length > 0) {
      products = products.filter(product => 
        this.selectedTags().some(tag => product.tags.includes(tag))
      );
    }
    
    // Sort products
    return this.sortProducts(products);
  });

  ngOnInit() {
    this.route.queryParams.subscribe((params: any) => {
      const categories: string[] = [];
      const subcategories: string[] = [];
      const tags: string[] = [];

      if (params['category']) {
        categories.push(params['category']);
      }
      
      if (params['subcategory']) {
        subcategories.push(params['subcategory']);
      }
      
      if (params['tag']) {
        tags.push(params['tag']);
      }

      this.selectedCategories.set(categories);
      this.selectedSubcategories.set(subcategories);
      this.selectedTags.set(tags);
    });
  }

  // Mapeamento de categorias principais para categorias reais
  private getCategoryMapping(category: string): string[] {
    const mapping: { [key: string]: string[] } = {
      'Rosto': ['Base', 'Corretivo', 'Po', 'Blush'],
      'Lábios': ['Batom', 'Gloss', 'Lapis Labial'],
      'Olhos': ['Sombra', 'Mascara', 'Delineador'],
      'Pincéis': ['Pincel de Rosto', 'Pincel de Olhos'],
      'Kits': ['Kits']
    };
    
    return mapping[category] || [category];
  }

  // Mapeamento de subcategorias para categorias reais
  private getSubcategoryMapping(subcategory: string): string[] {
    const mapping: { [key: string]: string[] } = {
      // Rosto
      'Base': ['Base'],
      'Corretivo': ['Corretivo'],
      'Pó': ['Po'],
      'Blush': ['Blush'],
      
      // Lábios
      'Batom': ['Batom'],
      'Gloss': ['Gloss'],
      'Lapis Labial': ['Lapis Labial'],
      
      // Olhos
      'Sombra': ['Sombra'],
      'Máscara': ['Mascara'],
      'Delineador': ['Delineador'],
      
      // Pincéis
      'Pincéis para os Olhos': ['Pincel de Olhos'],
      'Pincéis para o rosto': ['Pincel de Rosto']
    };
    
    return mapping[subcategory] || [subcategory];
  }

  private sortProducts(products: Product[]): Product[] {
    const sorted = [...products];
    
    switch (this.sortOption()) {
      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      default:
        return sorted;
    }
  }

  // Sorting methods
  onSortChange(option: 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc') {
    this.sortOption.set(option);
  }

  // Category filtering methods
  onCategoryChange(category: string, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    const categories = this.selectedCategories();
    
    if (isChecked) {
      this.selectedCategories.set([...categories, category]);
    } else {
      this.selectedCategories.set(categories.filter(c => c !== category));
      // Remove subcategories from the removed category
      const categoryData = this.categories().find(c => c.name === category);
      if (categoryData) {
        const currentSubcategories = this.selectedSubcategories();
        const updatedSubcategories = currentSubcategories.filter(sub => 
          !categoryData.subcategories.includes(sub)
        );
        this.selectedSubcategories.set(updatedSubcategories);
      }
    }
  }

  onSubcategoryChange(subcategory: string, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    const subcategories = this.selectedSubcategories();
    
    if (isChecked) {
      this.selectedSubcategories.set([...subcategories, subcategory]);
    } else {
      this.selectedSubcategories.set(subcategories.filter(s => s !== subcategory));
    }
  }

  onTagChange(tag: string, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    const tags = this.selectedTags();
    
    if (isChecked) {
      this.selectedTags.set([...tags, tag]);
    } else {
      this.selectedTags.set(tags.filter(t => t !== tag));
    }
  }

  // Check if category is selected
  isCategorySelected(category: string): boolean {
    return this.selectedCategories().includes(category);
  }

  // Check if subcategory is selected
  isSubcategorySelected(subcategory: string): boolean {
    return this.selectedSubcategories().includes(subcategory);
  }

  // Check if tag is selected
  isTagSelected(tag: string): boolean {
    return this.selectedTags().includes(tag);
  }

  // Clear all filters
  clearFilters() {
    this.selectedCategories.set([]);
    this.selectedSubcategories.set([]);
    this.selectedTags.set([]);
    this.router.navigate(['/products']);
  }

  // Bag methods
  onAddToBag(product: Product) {
    this.bagService.addToBag(product);
  }

  // Navigation
  navigateToHome() {
    this.router.navigate(['/']);
  }
}