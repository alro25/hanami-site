import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../componentes/models/product.model';
import { BagItem } from './bag.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private _productsInStock = signal<Product[]>([
    {
      id: 1,
      name: 'Base Líquida HD',
      price: 49.90,
      category: 'Rosto',
      subcategory: 'Base',
      description: 'Base líquida de alta cobertura e acabamento natural',
      imageUrl: '/img/base-liquida.jpg',
      stock: 50,
      tags: ['Lançamentos', 'Populares']
    },
    {
      id: 2,
      name: 'Batom Vermelho Intenso',
      price: 29.90,
      category: 'Lábios',
      subcategory: 'Batom',
      description: 'Batom de longa duração com cor vibrante',
      imageUrl: '/img/batom-vermelho.jpg',
      stock: 30,
      tags: ['Populares', 'Recomendado']
    },
    {
      id: 3, 
      name: 'Paleta de Sombras',
      price: 79.90,
      category: 'Olhos',
      subcategory: 'Sombra',
      description: 'Paleta com 12 cores neutras e pigmentadas',
      imageUrl: '/img/paleta-sombras.jpg',
      stock: 25,
      tags: ['Lançamentos', 'Recomendado']
    },
    {
      id: 4,
      name: 'Gloss Passionfruit',
      price: 24.90,
      category: 'Lábios',
      subcategory: 'Gloss',
      description: 'Gloss com brilho intenso e sabor de maracujá',
      imageUrl: '/img/gloss-passionfruit.jpg',
      stock: 40,
      tags: ['Lançamentos']
    },
    {
      id: 5,
      name: 'Pó Compacto Translúcido',
      price: 39.90,
      category: 'Rosto',
      subcategory: 'Pó',
      description: 'Pó compacto para fixação da maquiagem',
      imageUrl: '/img/po-compacto.jpg',
      stock: 35,
      tags: ['Populares']
    }
  ]);

  public productsInStock = computed(() => this._productsInStock());

  // MÉTODOS DE GERENCIAMENTO
  addProduct(product: Product): void {
    this._productsInStock.update(products => [...products, product]);
  }

  updateProduct(updatedProduct: Product): void {
    this._productsInStock.update(products => 
      products.map(product => 
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
  }

  removeProduct(productId: number): void {
    this._productsInStock.update(products => 
      products.filter(product => product.id !== productId)
    );
  }

  updateProductStock(productId: number, newStock: number): void {
    this._productsInStock.update(products =>
      products.map(p =>
        p.id === productId ? { ...p, stock: newStock } : p
      )
    );
  }

  getProductsFromBagItems(items: BagItem[]): Product[] {
    return this.productsInStock().filter(product =>
      items.some(i => i.product.id === product.id)
    );
  }

  getProductById(productId: number): Product | undefined {
    return this.productsInStock().find(product => product.id === productId);
  }

  getProductsByCategory(category: string): Product[] {
    return this.productsInStock().filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    );
  }

  getProductsByTag(tag: string): Product[] {
    return this.productsInStock().filter(product => 
      product.tags.includes(tag)
    );
  }

  searchProducts(term: string): Product[] {
    const lowerTerm = term.toLowerCase();
    return this.productsInStock().filter(product =>
      product.name.toLowerCase().includes(lowerTerm) ||
      product.category.toLowerCase().includes(lowerTerm) ||
      product.description.toLowerCase().includes(lowerTerm)
    );
  }
}