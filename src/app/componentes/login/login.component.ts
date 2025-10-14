import { Component, inject, signal, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { NgOptimizedImage } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, MatFormFieldModule, MatInputModule, 
    MatIconModule, MatButtonModule, FormsModule, 
    NgOptimizedImage
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements AfterViewInit, OnDestroy {
  usuario: string = '';
  senha: string = '';
  isLoading = false;

  private authService = inject(AuthService);
  private router = inject(Router);

  hide = signal(true);

  // Carousel properties
  currentSlide = signal(0);
  private carouselInterval: any;
  isTransitioning = signal(false);
  
  slides = [
    { imageUrl: '/img/card-login-1.png', alt: 'Imagem de login - duas garotas sorrindo em um fundo cor de rosa' },
    { imageUrl: '/img/card-login-2.png', alt: 'Imagem de login - produto de maquiagem' },
    { imageUrl: '/img/card-login-3.png', alt: 'Imagem de login - modelo com maquiagem' }
  ];

  ngAfterViewInit() {
    this.startCarousel();
  }

  ngOnDestroy() {
    this.stopCarousel();
  }

  // Carousel methods
  startCarousel() {
    this.carouselInterval = setInterval(() => {
      this.nextSlide();
    }, 4000); // Change slide every 4 seconds
  }

  stopCarousel() {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }

  nextSlide() {
    if (this.isTransitioning()) return;
    
    this.isTransitioning.set(true);
    const nextIndex = this.currentSlide() === this.slides.length - 1 ? 0 : this.currentSlide() + 1;
    
    // Update slide classes for transition
    this.currentSlide.set(nextIndex);
    
    // Reset transitioning state after animation completes
    setTimeout(() => {
      this.isTransitioning.set(false);
    }, 800);
  }

  goToSlide(index: number) {
    if (this.isTransitioning() || index === this.currentSlide()) return;
    
    this.isTransitioning.set(true);
    this.currentSlide.set(index);
    this.resetCarousel();
    
    setTimeout(() => {
      this.isTransitioning.set(false);
    }, 800);
  }

  private resetCarousel() {
    this.stopCarousel();
    this.startCarousel();
  }

  // Helper method to get slide class
  getSlideClass(index: number): string {
    if (index === this.currentSlide()) {
      return 'active';
    } else if (index === (this.currentSlide() + 1) % this.slides.length) {
      return 'next';
    } else if (index === (this.currentSlide() - 1 + this.slides.length) % this.slides.length) {
      return 'previous';
    } else {
      return '';
    }
  }

  clickEvent(event: MouseEvent) {
    event.preventDefault();
    this.hide.set(!this.hide());
  }

  navegarParaRegister() {
    setTimeout(() => {
      this.router.navigate(['/register']);
    }, 150);
  }

  login() {
    if (!this.usuario || !this.senha) return;

    this.isLoading = true;
    this.authService.login(this.usuario, this.senha)
      .subscribe({
        next: (success) => {
          this.isLoading = false;
          if (success) {
            this.router.navigate(['/']);
          } else {
            alert('E-mail ou senha inválidos');
          }
        },
        error: () => {
          this.isLoading = false;
          alert('Erro ao fazer login');
        }
      });
  }

  continueAsGuest() {
    this.router.navigate(['/']);
  }
}