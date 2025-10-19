import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements AfterViewInit, OnDestroy {
  private router = inject(Router);
  private charts: Chart[] = [];

  // Dados mockados para o dashboard
  dashboardData = signal({
    totalVendas: 12458.00,
    novosClientes: 47,
    totalPedidos: 89,
    ticketMedio: 139.97
  });

  @ViewChild('vendasMensaisChart') vendasMensaisCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('topProdutosChart') topProdutosCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('categoriasPopularesChart') categoriasPopularesCanvas!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit(): void {
    this.initCharts();
  }

  ngOnDestroy(): void {
    this.destroyCharts();
  }

  private initCharts(): void {
    this.createVendasMensaisChart();
    this.createTopProdutosChart();
    this.createCategoriasPopularesChart();
  }

  private destroyCharts(): void {
    this.charts.forEach(chart => chart.destroy());
    this.charts = [];
  }

  private createVendasMensaisChart(): void {
    if (!this.vendasMensaisCanvas?.nativeElement) return;

    const chart = new Chart(this.vendasMensaisCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        datasets: [{
          label: 'Vendas (R$)',
          data: [8500, 9200, 7800, 11000, 10500, 12458, 9800, 11200, 10800, 11500, 12000, 12500],
          borderColor: '#E964BD',
          backgroundColor: 'rgba(233, 100, 189, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0, 0, 0, 0.1)' },
            ticks: {
              callback: (value) => `R$ ${value}`
            }
          },
          x: {
            grid: { display: false }
          }
        },
        interaction: {
          intersect: false,
          mode: 'nearest'
        }
      }
    });
    
    this.charts.push(chart);
  }

  private createTopProdutosChart(): void {
    if (!this.topProdutosCanvas?.nativeElement) return;

    const chart = new Chart(this.topProdutosCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Base Líquida', 'Pó Compacto', 'Batom Vermelho', 'Paleta Sombras', 'Delineador'],
        datasets: [{
          label: 'Unidades Vendidas',
          data: [45, 38, 32, 28, 25],
          backgroundColor: ['#E964BD', '#F28EC9', '#F8B6D9', '#FFDDEE', '#E0E0E0'],
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: { color: 'rgba(0, 0, 0, 0.1)' }
          },
          y: {
            grid: { display: false }
          }
        }
      }
    });
    
    this.charts.push(chart);
  }

  private createCategoriasPopularesChart(): void {
    if (!this.categoriasPopularesCanvas?.nativeElement) return;

    const chart = new Chart(this.categoriasPopularesCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Lançamentos', 'Rosto', 'Lábios', 'Olhos', 'Pincéis'],
        datasets: [{
          data: [45, 25, 15, 10, 5],
          backgroundColor: ['#E964BD', '#F28EC9', '#F8B6D9', '#FFDDEE', '#F5F5F5'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              padding: 20
            }
          }
        },
        cutout: '60%'
      }
    });
    
    this.charts.push(chart);
  }

  voltarParaHome(): void {
    this.router.navigate(['/']);
  }
}