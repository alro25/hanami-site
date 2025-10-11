import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileModalContentComponent } from './profile-modal-content.component';

describe('ProfileModalContentComponent', () => {
  let component: ProfileModalContentComponent;
  let fixture: ComponentFixture<ProfileModalContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileModalContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileModalContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
