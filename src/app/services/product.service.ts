import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../componentes/models/product.model';
import { shareReplay, tap } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { OrderService } from './order.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private orderService = inject(OrderService);
  private productsUrl = 'assets/data/products.json';

  // Signal para produtos em estoque
  private _productsInStock = signal<Product[]>([]);
  public readonly productsInStock = this._productsInStock.asReadonly();

  // Signal para estado de carregamento
  private _isLoading = signal<boolean>(true);
  public readonly isLoading = this._isLoading.asReadonly();

  // Signal para erro
  private _error = signal<string | null>(null);
  public readonly error = this._error.asReadonly();

  constructor() {
    this.loadInitialProducts();
  }

  private loadInitialProducts() {
    this._isLoading.set(true);
    this._error.set(null);

    this.http.get<Product[]>(this.productsUrl).pipe(
      tap({
        next: (products) => {
          this._productsInStock.set(products);
          this.orderService.updateStock(products);
          this._isLoading.set(false);
        },
        error: (err) => {
          this._error.set('Erro ao carregar produtos');
          this._isLoading.set(false);
          console.error('Erro ao carregar produtos:', err);
        }
      }),
      shareReplay(1)
    ).subscribe();
  }

  // Método para obter todos os produtos
  getAllProducts(): Product[] {
    return this.productsInStock();
  }

  // Método para obter produto por ID
  getProductById(id: number): Product | undefined {
    return this.productsInStock().find(product => product.id === id);
  }

  // Método para atualizar o estoque de um produto específico
  updateProductStock(productId: number, newStock: number) {
    this._productsInStock.update(products =>
      products.map(p =>
        p.id === productId ? { ...p, stock: newStock } : p
      )
    );
    // Atualiza o estoque no OrderService para manter a consistência
    this.orderService.updateStock(this._productsInStock());
  }

  // Método para reduzir estoque (usado durante checkout)
  reduceStock(items: Array<{productId: number, quantity: number}>) {
    this._productsInStock.update(products =>
      products.map(product => {
        const item = items.find(i => i.productId === product.id);
        if (item) {
          return { 
            ...product, 
            stock: Math.max(0, product.stock - item.quantity) 
          };
        }
        return product;
      })
    );
    this.orderService.updateStock(this._productsInStock());
  }

  // Getter para produtos populares (lógica melhorada)
  getPopularProducts(): Product[] {
    return this.productsInStock()
      .filter(product => product.stock > 0) // Apenas produtos com estoque
      .slice(0, 8); // Retorna até 8 produtos
  }

  // Método para produtos por categoria
  getProductsByCategory(category: string): Product[] {
    return this.productsInStock()
      .filter(product => 
        product.category.toLowerCase().includes(category.toLowerCase()) && 
        product.stock > 0
      );
  }

  // Método para buscar produtos
  searchProducts(query: string): Product[] {
    const lowerQuery = query.toLowerCase();
    return this.productsInStock()
      .filter(product =>
        product.name.toLowerCase().includes(lowerQuery) ||
        product.category.toLowerCase().includes(lowerQuery) ||
        product.description.toLowerCase().includes(lowerQuery)
      );
  }

  // Método para recarregar produtos
  reloadProducts() {
    this.loadInitialProducts();
  }

  // Getter para produtos com estoque baixo (útil para dashboard)
  getLowStockProducts(threshold: number = 5): Product[] {
    return this.productsInStock()
      .filter(product => product.stock > 0 && product.stock <= threshold);
  }
}