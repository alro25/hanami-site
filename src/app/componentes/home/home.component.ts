// home.component.ts
import { Component, inject, Inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common'; // NgOptimizedImage para as imagens dos produtos!
import { RouterLink } from '@angular/router';
import { UiService } from '../services/ui.service.js';
import { SideModalComponent } from '../side-modal/side-modal.component.js';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterLink, SideModalComponent,], // Adicionaremos mais coisas aqui
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent { 
  uiService = inject(UiService);
}
