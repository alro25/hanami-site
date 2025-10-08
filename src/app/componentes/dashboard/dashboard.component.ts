import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables, ChartOptions } from 'chart.js';
import { DashboardService } from '../../services/dashboard.service';
import { Product } from '../models/product.model';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements AfterViewInit, OnDestroy {
  private dashboardService = inject(DashboardService);
  private charts: Chart[] = [];

  summary = this.dashboardService.dashboardSummary;
  recentOrders = this.dashboardService.pedidosRecentes;
  topProducts = this.dashboardService.topProdutos;

  @ViewChild('vendasMensaisChart') vendasMensaisCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('topProdutosChart') topProdutosCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('categoriasPopularesChart') categoriasPopularesCanvas!: ElementRef<HTMLCanvasElement>;

  constructor() {
    effect(() => {
      // Reage a mudanças nos dados e atualiza os gráficos
      this.dashboardService.vendasMensais();
      this.dashboardService.popularCategories();
      this.dashboardService.topProdutos();

      // O setTimeout garante que a recriação aconteça após o DOM estar pronto
      setTimeout(() => this.updateAllCharts(), 0);
    });
  }

  ngAfterViewInit(): void {
    this.initCharts();
  }

  ngOnDestroy(): void {
    this.charts.forEach(chart => chart.destroy());
  }

  private initCharts(): void {
    if (this.vendasMensaisCanvas?.nativeElement) {
      const vendasData = this.dashboardService.vendasMensais();
      const salesChart = new Chart(this.vendasMensaisCanvas.nativeElement, {
        type: 'line',
        data: vendasData,
        options: { responsive: true, maintainAspectRatio: false }
      });
      this.charts.push(salesChart);
    }

    if (this.topProdutosCanvas?.nativeElement) {
      const topProductsData = this.dashboardService.topProdutos();
      // Transforma os dados para o formato que o Chart.js espera
      const productLabels = topProductsData.map(p => p.name);
      const productSales = topProductsData.map(p => (p as any).totalQuantitySold);

      const productsChart = new Chart(this.topProdutosCanvas.nativeElement, {
        type: 'bar',
        data: {
          labels: productLabels,
          datasets: [{
            label: 'Unidades Vendidas',
            data: productSales,
            backgroundColor: ['#E964BD', '#F28EC9', '#F8B6D9', '#FFDDEE', '#cccccc'],
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } }
        }
      });
      this.charts.push(productsChart);
    }

    if (this.categoriasPopularesCanvas?.nativeElement) {
      const categoriesData = this.dashboardService.popularCategories();
      const categoriesChart = new Chart(this.categoriasPopularesCanvas.nativeElement, {
        type: 'doughnut',
        data: categoriesData,
        options: { responsive: true, maintainAspectRatio: false }
      });
      this.charts.push(categoriesChart);
    }
  }

  private updateAllCharts(): void {
    this.charts.forEach(chart => chart.destroy());
    this.charts = [];
    this.initCharts();
  }
}