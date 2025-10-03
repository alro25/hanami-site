/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SideModalComponent } from './side-modal.component';

describe('SideModalComponent', () => {
  let component: SideModalComponent;
  let fixture: ComponentFixture<SideModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
