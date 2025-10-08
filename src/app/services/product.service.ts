import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../componentes/models/product.model';
import { shareReplay, tap } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { OrderService } from './order.service'; // Importar OrderService

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private orderService = inject(OrderService); // Injetar OrderService
  private productsUrl = 'assets/data/products.json';

  // O Signal que armazena o estado atual do estoque (todos os produtos)
  private _productsInStock = signal<Product[]>([]);
  readonly productsInStock = this._productsInStock.asReadonly(); // Versão somente leitura

  constructor() {
    this.loadInitialProducts();
  }

  private loadInitialProducts() {
    this.http.get<Product[]>(this.productsUrl).pipe(
      tap(products => {
        // Quando os produtos são carregados, atualizamos nosso Signal interno
        // e também informamos o OrderService sobre o estoque inicial.
        this._productsInStock.set(products);
        this.orderService.updateStock(products); // <--- Atualiza o estoque no OrderService
      }),
      shareReplay(1)
    ).subscribe(); // Não esqueça de se inscrever para o HTTP ser executado
  }

  // Método para obter todos os produtos (agora do nosso Signal reativo)
  getAllProducts(): Product[] {
    return this.productsInStock();
  }

  // Método para atualizar o estoque de um produto específico
  updateProductStock(productId: number, newStock: number) {
    this._productsInStock.update(products =>
      products.map(p =>
        p.id === productId ? { ...p, stock: newStock } : p
      )
    );
    // Também atualiza o estoque no OrderService para manter a consistência
    this.orderService.updateStock(this._productsInStock());
  }
  
  // Getter para os produtos populares (agora usando o Signal)
  getPopularProducts() {
    return this.productsInStock().slice(0, 4); // Exemplo: retorna os 4 primeiros
  }
}