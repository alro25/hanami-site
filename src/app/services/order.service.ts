import { Injectable, signal, computed } from '@angular/core';
import { BagItem } from './bag.service';
import { Product } from '../componentes/models/product.model';

export type OrderStatus = 'Pendente' | 'Processando' | 'Enviado' | 'Entregue' | 'Cancelado';

export interface Order {
  id: string;
  date: Date;
  customer: string;
  items: BagItem[];
  total: number;
  status: OrderStatus;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly STORAGE_KEY = 'hanami_orders';
  
  // Signals para pedidos e estoque
  private _orders = signal<Order[]>(this.getStoredOrders());
  private _currentStock = signal<Product[]>([]);

  public orders = computed(() => this._orders());
  public currentStock = computed(() => this._currentStock());
  public recentOrders = computed(() => this.orders().slice(0, 5));
  public totalOrders = computed(() => this.orders().length);
  public totalRevenue = computed(() => 
    this.orders().reduce((sum, order) => sum + order.total, 0)
  );

  private getStoredOrders(): Order[] {
    if (typeof window === 'undefined') return [];
    
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return [];
    
    return JSON.parse(stored, (key, value) => {
      if (key === 'date') return new Date(value);
      return value;
    });
  }

  private saveOrders(orders: Order[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(orders));
    }
  }

  addOrder(newOrder: Order): void {
    this._orders.update(orders => {
      const updatedOrders = [newOrder, ...orders];
      this.saveOrders(updatedOrders);
      return updatedOrders;
    });
  }

  updateStock(products: Product[]): void {
    this._currentStock.set(products);
  }

  reduceStock(items: BagItem[]): void {
    this._currentStock.update(currentStock => 
      currentStock.map(product => {
        const purchasedItem = items.find(item => item.product.id === product.id);
        if (purchasedItem) {
          return { 
            ...product, 
            stock: Math.max(0, product.stock - purchasedItem.quantity) 
          };
        }
        return product;
      })
    );
  }

  getOrderById(orderId: string): Order | undefined {
    return this.orders().find(order => order.id === orderId);
  }

  updateOrderStatus(orderId: string, newStatus: OrderStatus): void {
    this._orders.update(orders => {
      const updatedOrders = orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      );
      this.saveOrders(updatedOrders);
      return updatedOrders;
    });
  }

  // Método para criar um novo pedido a partir dos itens da sacola
  createOrderFromBag(customer: string, items: BagItem[]): Order {
    const total = items.reduce((sum, item) => 
      sum + (item.product.price * item.quantity), 0
    );

    const newOrder: Order = {
      id: 'ORD-' + Date.now().toString(36).toUpperCase(),
      date: new Date(),
      customer,
      items: [...items],
      total,
      status: 'Pendente'
    };

    this.addOrder(newOrder);
    return newOrder;
  }

  // Métodos para análise de dados (usados no dashboard)
  getMonthlySales(): Map<string, number> {
    const monthlySales = new Map<string, number>();
    const now = new Date();
    
    // Inicializa últimos 6 meses
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      monthlySales.set(key, 0);
    }

    // Preenche com dados reais
    this.orders().forEach(order => {
      const orderDate = order.date;
      const key = `${orderDate.getFullYear()}-${(orderDate.getMonth() + 1).toString().padStart(2, '0')}`;
      
      if (monthlySales.has(key)) {
        monthlySales.set(key, monthlySales.get(key)! + order.total);
      }
    });

    return monthlySales;
  }
}