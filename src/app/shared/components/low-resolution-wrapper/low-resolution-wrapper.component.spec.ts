import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LowResolutionWrapperComponent } from './low-resolution-wrapper.component';

describe('LowResolutionWrapperComponent', () => {
  let component: LowResolutionWrapperComponent;
  let fixture: ComponentFixture<LowResolutionWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LowResolutionWrapperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LowResolutionWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
