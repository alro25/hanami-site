/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { BagService } from './bag.service';

describe('Service: Bag', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BagService]
    });
  });

  it('should ...', inject([BagService], (service: BagService) => {
    expect(service).toBeTruthy();
  }));
});