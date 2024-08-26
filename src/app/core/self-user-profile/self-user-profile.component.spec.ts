import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfUserProfileComponent } from './self-user-profile.component';

describe('SelfUserProfileComponent', () => {
  let component: SelfUserProfileComponent;
  let fixture: ComponentFixture<SelfUserProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelfUserProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelfUserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
