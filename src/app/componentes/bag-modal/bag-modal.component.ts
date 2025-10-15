import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BagService } from '../../services/bag.service';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-bag-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bag-modal.component.html',
  styleUrls: ['./bag-modal.component.css']
})
export class BagModalComponent {
  bagService = inject(BagService);
  uiService = inject(UiService);

  purchaseCompleted = signal(false);

  completePurchase(): void {
    this.bagService.checkout();
    this.purchaseCompleted.set(true);
    this.bagService.clearBag();
  }
}