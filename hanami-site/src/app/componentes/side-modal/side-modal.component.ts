import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-side-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './side-modal.component.html',
  styleUrl: './side-modal.component.css'
})
export class SideModalComponent {
  @Input() isOpen = false;
  @Input() position: 'left' | 'right' = 'right'; // Configurável!
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}