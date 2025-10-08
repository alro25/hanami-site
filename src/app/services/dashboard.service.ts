import { Injectable, computed, inject, signal } from '@angular/core';
import { Order, OrderService } from './order.service'; // Importar OrderService e Order
import { Product } from '../componentes/models/product.model'; // Importar Product
import { ProductService } from './product.service'; // Importar ProductService

export interface DashboardSummary {
  totalVendas: number;
  novosClientes: number; // Placeholder por enquanto
  pedidos: number;
  ticketMedio: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    tension?: number;
    fill?: boolean;
    backgroundColor?: string | string[];
  }[];
}

export interface PedidoRecente {
  id: string;
  cliente: string;
  data: string; // Pode ser Date no futuro
  valor: number;
  status: 'Pendente' | 'Processando' | 'Enviado' | 'Entregue' | 'Cancelado';
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private orderService = inject(OrderService); // Injeta o OrderService
  private productService = inject(ProductService); // Injeta o ProductService

  // Signals para os dados do Dashboard, agora computados dos OrdersService
  readonly dashboardSummary = computed<DashboardSummary>(() => {
    const allOrders = this.orderService.orders();
    const totalVendas = allOrders.reduce((sum, order) => sum + order.total, 0);
    const totalPedidos = allOrders.length;
    const ticketMedio = totalPedidos > 0 ? totalVendas / totalPedidos : 0;

    return {
      totalVendas: totalVendas,
      novosClientes: 0, // Placeholder
      pedidos: totalPedidos,
      ticketMedio: ticketMedio
    };
  });

  readonly vendasMensais = computed<ChartData>(() => {
    const allOrders = this.orderService.orders();
    const monthlySalesMap = new Map<string, number>(); // 'YYYY-MM' -> total
    const now = new Date();
    const currentYear = now.getFullYear();

    // Inicializa os últimos 6 meses com 0 vendas
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthYear = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
      monthlySalesMap.set(monthYear, 0);
    }

    allOrders.forEach(order => {
      const orderDate = order.date;
      if (orderDate.getFullYear() === currentYear) { // Filtra por ano atual
        const monthYear = `${orderDate.getFullYear()}-${(orderDate.getMonth() + 1).toString().padStart(2, '0')}`;
        if (monthlySalesMap.has(monthYear)) {
          monthlySalesMap.set(monthYear, monthlySalesMap.get(monthYear)! + order.total);
        }
      }
    });

    const labels: string[] = Array.from(monthlySalesMap.keys()).map(my => {
      const [year, month] = my.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1, 1);
      return date.toLocaleString('pt-BR', { month: 'short' });
    });
    const data: number[] = Array.from(monthlySalesMap.values());

    return {
      labels: labels,
      datasets: [{
        label: 'Vendas em R$',
        data: data,
        borderColor: '#E964BD',
        tension: 0.4,
        fill: true,
        backgroundColor: 'rgba(233, 100, 189, 0.1)'
      }]
    };
  });

  readonly topProdutos = computed<Product[]>(() => {
    const allOrders = this.orderService.orders();
    const productSalesMap = new Map<number, number>(); // productId -> totalQuantitySold

    allOrders.forEach(order => {
      order.items.forEach(item => {
        const currentSales = productSalesMap.get(item.product.id) || 0;
        productSalesMap.set(item.product.id, currentSales + item.quantity);
      });
    });

    // Converte para array, ordena e pega os top X
    const sortedProducts = Array.from(productSalesMap.entries())
      .map(([productId, totalQuantitySold]) => {
        const product = this.productService.productsInStock().find(p => p.id === productId);
        return product ? { ...product, totalQuantitySold } : null;
      })
      .filter(Boolean) as (Product & { totalQuantitySold: number })[]; // Remove nulos
      
    return sortedProducts.sort((a, b) => b.totalQuantitySold - a.totalQuantitySold).slice(0, 5); // Top 5
  });


  readonly popularCategories = computed<ChartData>(() => {
    const allOrders = this.orderService.orders();
    const categorySalesMap = new Map<string, number>();

    allOrders.forEach(order => {
        order.items.forEach(item => {
            const currentSales = categorySalesMap.get(item.product.category) || 0;
            categorySalesMap.set(item.product.category, currentSales + item.quantity);
        });
    });

    const labels = Array.from(categorySalesMap.keys());
    const data = Array.from(categorySalesMap.values());

    return {
        labels: labels,
        datasets: [{
            label: 'Itens Vendidos',
            data: data,
            backgroundColor: ['#E964BD', '#FFD700', '#ADD8E6', '#98FB98', '#FF6347'], // Cores de exemplo
            hoverOffset: 4
        }]
    };
  });


  readonly pedidosRecentes = computed<PedidoRecente[]>(() => {
    const allOrders = this.orderService.orders();
    return allOrders.slice(0, 5).map(order => ({ // Últimos 5 pedidos
      id: order.id,
      cliente: order.customer,
      data: order.date.toLocaleDateString('pt-BR'),
      valor: order.total,
      status: order.status
    }));
  });
}