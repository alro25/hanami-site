import { Injectable, signal } from '@angular/core';
import { Order } from './order.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly STORAGE_KEY = 'user_orders';
  
  // Signal para pedidos do usuário atual
  userOrders = signal<Order[]>(this.getStoredUserOrders());

  private getStoredUserOrders(): Order[] {
    if (typeof window === 'undefined') return [];
    
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private saveUserOrders(orders: Order[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(orders));
    }
  }

  // Adicionar um pedido para o usuário atual
  addUserOrder(order: Order): void {
    this.userOrders.update(orders => {
      const updatedOrders = [order, ...orders];
      this.saveUserOrders(updatedOrders);
      return updatedOrders;
    });
  }

  // Carregar pedidos do OrderService para o usuário atual
  loadUserOrders(customerEmail: string, allOrders: Order[]): void {
    const userOrders = allOrders.filter(order => order.customer === customerEmail);
    this.userOrders.set(userOrders);
    this.saveUserOrders(userOrders);
  }

  // Limpar pedidos do usuário (logout)
  clearUserOrders(): void {
    this.userOrders.set([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }
}