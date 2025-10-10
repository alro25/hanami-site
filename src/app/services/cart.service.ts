import { Injectable, computed, signal, inject } from '@angular/core';
import { Product } from '../componentes/models/product.model';
import { ProductService } from './product.service';
import { Order, OrderService } from './order.service';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private productService = inject(ProductService);
  private orderService = inject(OrderService);

  cartItems = signal<CartItem[]>([]);

  cartTotal = computed(() => 
    this.cartItems().reduce((total, item) => total + (item.product.price * item.quantity), 0)
  );

  itemCount = computed(() => 
    this.cartItems().reduce((count, item) => count + item.quantity, 0)
  );

  addToCart(product: Product) {
    this.cartItems.update(items => {
      const existingItem = items.find(item => item.product.id === product.id);
      const productInStock = this.productService.productsInStock().find(p => p.id === product.id);

      if (!productInStock || productInStock.stock <= 0) {
        alert('Produto fora de estoque!');
        return items; // Não adiciona se não há estoque
      }

      if (existingItem) {
        if (existingItem.quantity < productInStock.stock) {
          return items.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          alert('Quantidade máxima em estoque atingida para este produto.');
          return items;
        }
      } else {
        // Se o item não existe e há estoque, adiciona-o
        return [...items, { product, quantity: 1 }];
      }
    });
  }

  updateQuantity(productId: number, change: 1 | -1) {
    this.cartItems.update(items => {
      const productInStock = this.productService.productsInStock().find(p => p.id === productId);
      const currentItem = items.find(item => item.product.id === productId);

      if (!productInStock || !currentItem) return items; // Produto ou item não encontrado

      const newQuantity = currentItem.quantity + change;

      if (newQuantity <= 0) {
        return items.filter(item => item.product.id !== productId); // Remove se a quantidade for 0 ou menos
      }

      if (newQuantity > productInStock.stock) {
        alert(`Não há estoque suficiente. Disponível: ${productInStock.stock}`);
        return items; // Não permite adicionar mais do que o estoque
      }

      return items.map(item =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      );
    });
  }

  removeFromCart(productId: number) {
    this.cartItems.update(items => items.filter(item => item.product.id !== productId));
  }

  // --- NOVA FUNÇÃO: FINALIZAR COMPRA ---
  checkout() {
    const itemsToPurchase = this.cartItems();
    if (itemsToPurchase.length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }

    const orderTotal = this.cartTotal();

    // 1. Reduzir o estoque no ProductService
    this.orderService.reduceStock(itemsToPurchase);

    // 2. Criar um novo pedido
    const newOrder: Order = {
      id: 'ORD-' + Math.random().toString(36).substring(2, 9).toUpperCase(), // ID Simples
      date: new Date(),
      customer: 'Cliente da Hanami', // Pode ser dinâmico no futuro
      items: itemsToPurchase,
      total: orderTotal,
      status: 'Pendente' // Status inicial
    };
    this.orderService.addOrder(newOrder);

    // 3. Limpar o carrinho
    this.cartItems.set([]);

    alert(`Compra finalizada com sucesso! Pedido ${newOrder.id}. Total: R$ ${orderTotal.toFixed(2)}.`);
  }
  clearCart() {
    this.cartItems.set([]);
  }

  getCartItems(): CartItem[] {
    return this.cartItems();
  }

  isEmpty(): boolean {
    return this.cartItems().length === 0;
  }

  // Optional: Get item quantity for a specific product
  getItemQuantity(productId: number): number {
    const item = this.cartItems().find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  }
}