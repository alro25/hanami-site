import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-overlay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-overlay.component.html',
  styleUrl: './search-overlay.component.css'
})
export class SearchOverlayComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
}