// Adicione 'effect' na lista de imports do @angular/core
import { AfterViewInit, Component, OnDestroy, ViewChild, inject, effect } from '@angular/core'; 
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Chart, ChartConfiguration, ChartData, ChartOptions, registerables } from 'chart.js';
import { DashboardService } from '../../services/dashboard.service';
import { LOCALE_ID } from '@angular/core';
import { Product } from '../models/product.model';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  providers: [{ provide: LOCALE_ID, useValue: 'pt-BR' }]
})
export class DashboardComponent implements AfterViewInit, OnDestroy {
  private dashboardService = inject(DashboardService);
  private charts: Chart[] = [];

  summary = this.dashboardService.dashboardSummary;
  recentOrders = this.dashboardService.pedidosRecentes;
  topProducts = this.dashboardService.topProdutos;

  @ViewChild('vendasMensaisCanvas') vendasMensaisCanvas: any;
  @ViewChild('popularCategoriesCanvas') popularCategoriesCanvas: any;
  @ViewChild('productSalesCanvas') productSalesCanvas: any;

  constructor() {
    // Usamos 'effect' para reagir a mudanças nos Signals de dados dos gráficos
    // e chamar a função para atualizar/recriar os gráficos.
    // Qualquer Signal lido dentro de um 'effect' se torna uma dependência.
    effect(() => {
      // Ao ler os signals, o Angular sabe que este effect precisa ser reexecutado
      // quando qualquer um deles mudar.
      this.dashboardService.vendasMensais(); 
      this.dashboardService.popularCategories();
      this.dashboardService.topProdutos(); 

      // Precisamos garantir que a DOM foi atualizada e os <canvas> estão prontos
      // antes de tentar recriar os gráficos. Um pequeno setTimeout resolve isso.
      setTimeout(() => {
        if (this.vendasMensaisCanvas && this.popularCategoriesCanvas && this.productSalesCanvas) {
          this.updateAllCharts();
        }
      }, 0); 
    });
  }

  ngAfterViewInit(): void {
    // Inicializa os gráficos assim que a view estiver pronta
    this.initCharts();
  }

  ngOnDestroy(): void {
    // Destrói as instâncias dos gráficos para liberar memória
    this.charts.forEach(chart => chart.destroy());
  }

  private initCharts(): void {
    this.charts.forEach(chart => chart.destroy()); // Limpa gráficos antigos
    this.charts = []; // Reseta o array

    // Gráfico de Vendas Mensais
    if (this.vendasMensaisCanvas?.nativeElement) {
      const vendasData = this.dashboardService.vendasMensais();
      const salesChart = new Chart(this.vendasMensaisCanvas.nativeElement, {
        type: 'line',
        data: vendasData,
        options: this.getChartOptions('Vendas Mensais (R$)')
      });
      this.charts.push(salesChart);
    }

    // Gráfico de Categorias Populares
    if (this.popularCategoriesCanvas?.nativeElement) {
      const categoriesData = this.dashboardService.popularCategories();
      const categoriesChart = new Chart(this.popularCategoriesCanvas.nativeElement, {
        type: 'doughnut',
        data: categoriesData,
        options: this.getDoughnutChartOptions('Categorias Populares')
      });
      this.charts.push(categoriesChart);
    }

    // Gráfico de Top Produtos (Exemplo: barras)
    if (this.productSalesCanvas?.nativeElement) {
      const topProductsData = this.dashboardService.topProdutos();
      const productLabels = topProductsData.map(p => p.name);
      // Aqui, garantimos que 'totalQuantitySold' é acessível, pois foi adicionado no DashboardService
      const productSales = topProductsData.map(p => (p as Product & { totalQuantitySold: number }).totalQuantitySold);
      
      const productChart = new Chart(this.productSalesCanvas.nativeElement, {
        type: 'bar',
        data: {
          labels: productLabels,
          datasets: [{
            label: 'Itens Vendidos',
            data: productSales,
            backgroundColor: '#E964BD',
            borderColor: '#E964BD',
            borderWidth: 1
          }]
        },
        options: this.getChartOptions('Top Produtos Vendidos')
      });
      this.charts.push(productChart);
    }
  }

  private updateAllCharts(): void {
    // Destrói os gráficos existentes
    this.charts.forEach(chart => chart.destroy());
    this.charts = []; // Limpa o array de referências
    // Recria todos os gráficos com os dados mais recentes
    this.initCharts(); 
  }

  private getChartOptions(title: string): ChartOptions {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: title,
          font: {
            size: 16
          }
        },
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };
  }

  private getDoughnutChartOptions(title: string): ChartOptions {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: title,
          font: {
            size: 16
          }
        },
        legend: {
          position: 'bottom'
        }
      }
    };
  }
}