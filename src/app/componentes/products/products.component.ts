import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Product } from '../models/product.model';
import { ProductService } from '../../services/product.service';
import { BagService } from '../../services/bag.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

interface Category {
  name: string;
  subcategories: string[];
  tags?: string[];
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  private productService = inject(ProductService);
  private bagService = inject(BagService);
  private router = inject(Router);

  // Products and filtering
  allProducts = this.productService.productsInStock;
  
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
      subcategories: ['Base', 'Corretivo', 'Pó', 'Blush', 'Iluminador'] 
    },
    { 
      name: 'Lábios', 
      subcategories: ['Batom', 'Gloss', 'Lápis Labial'] 
    },
    { 
      name: 'Olhos', 
      subcategories: ['Sombra', 'Máscara', 'Delineador', 'Lápis de Olho'] 
    },
    { 
      name: 'Pincéis', 
      subcategories: ['Pincéis para os Olhos', 'Pincéis para o rosto'] 
    }
  ]);

  // Computed sorted and filtered products
  filteredProducts = computed(() => {
    let products = this.allProducts();
    
    // Filter by categories (main categories like Rosto, Lábios, etc.)
    if (this.selectedCategories().length > 0) {
      products = products.filter(product => 
        this.selectedCategories().some(category => 
          this.getCategoryMapping(category).includes(product.category)
        )
      );
    }
    
    // Filter by subcategories (specific product types)
    if (this.selectedSubcategories().length > 0) {
      products = products.filter(product => 
        this.selectedSubcategories().some(subcategory => 
          this.getSubcategoryMapping(subcategory).includes(product.category)
        )
      );
    }
    
    // Filter by tags (Lançamentos, Novidades, Kits, etc.)
    if (this.selectedTags().length > 0) {
      products = products.filter(product => 
        this.selectedTags().some(tag => product.tags.includes(tag))
      );
    }
    
    // Sort products
    return this.sortProducts(products);
  });

  // Mapeamento de categorias principais para categorias reais
  private getCategoryMapping(category: string): string[] {
    const mapping: { [key: string]: string[] } = {
      'Rosto': ['Base', 'Corretivo', 'Po', 'Blush', 'Iluminador'],
      'Lábios': ['Batom', 'Gloss', 'Lapis Labial'],
      'Olhos': ['Sombra', 'Mascara', 'Delineador', 'Lapis de Olho'],
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
      'Iluminador': ['Iluminador'],
      
      // Lábios
      'Batom': ['Batom'],
      'Gloss': ['Gloss'],
      'Lápis Labial': ['Lapis Labial'],
      
      // Olhos
      'Sombra': ['Sombra'],
      'Máscara': ['Mascara'],
      'Delineador': ['Delineador'],
      'Lápis de Olho': ['Lapis de Olho'],
      
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