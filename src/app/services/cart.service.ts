import { Injectable, computed, signal } from '@angular/core';
import { Product } from '../componentes/models/product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems = signal<CartItem[]>([]);

  // Signals computados são poderosíssimos!
  cartTotal = computed(() => 
    this.cartItems().reduce((total, item) => total + (item.product.price * item.quantity), 0)
  );

  itemCount = computed(() => 
    this.cartItems().reduce((count, item) => count + item.quantity, 0)
  );

  addToCart(product: Product) {
    this.cartItems.update(items => {
      const itemInCart = items.find(item => item.product.id === product.id);
      if (itemInCart) {
        // Se já existe, apenas incrementa a quantidade
        return items.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        // Se não existe, adiciona ao carrinho
        return [...items, { product, quantity: 1 }];
      }
    });
  }

  // Você pode adicionar métodos para remover, decrementar, etc.
}