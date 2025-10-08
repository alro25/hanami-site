import { Injectable, signal, computed } from '@angular/core';
import { CartItem } from './cart.service';
import { Product } from '../componentes/models/product.model';

export interface Order {
  id: string;
  date: Date;
  customer: string; // Exemplo: 'Usuário Padrão'
  items: CartItem[];
  total: number;
  status: 'Pendente' | 'Processando' | 'Enviado' | 'Entregue' | 'Cancelado';
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private _orders = signal<Order[]>([]);
  readonly orders = computed(() => this._orders());

  // Signal para o estoque global (inicialmente vazio, será preenchido pelo ProductService)
  private _currentStock = signal<Product[]>([]);
  readonly currentStock = computed(() => this._currentStock());

  constructor() {
    // Exemplo de como inicializar com alguns pedidos fictícios (se quiser)
    // this._orders.set([
    //   { id: 'ORD-001', date: new Date(), customer: 'João Silva', items: [], total: 150.00, status: 'Entregue' },
    // ]);
  }

  addOrder(newOrder: Order) {
    this._orders.update(orders => [newOrder, ...orders]); // Adiciona o novo pedido no início
  }

  // Método para atualizar o estoque global de produtos
  // Será chamado pelo ProductService após carregar os produtos
  updateStock(products: Product[]) {
    this._currentStock.set(products);
  }

  // Método para simular a redução do estoque após uma compra
  reduceStock(items: CartItem[]) {
    this._currentStock.update(currentStock => {
      const updatedStock = currentStock.map(product => {
        const purchasedItem = items.find(item => item.product.id === product.id);
        if (purchasedItem) {
          return { ...product, stock: product.stock - purchasedItem.quantity };
        }
        return product;
      });
      return updatedStock;
    });
  }
}
