import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BagModalComponent } from './bag-modal.component';

describe('BagModalComponent', () => {
  let component: BagModalComponent;
  let fixture: ComponentFixture<BagModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BagModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BagModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
