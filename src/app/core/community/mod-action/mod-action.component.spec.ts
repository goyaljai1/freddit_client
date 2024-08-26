import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModActionComponent } from './mod-action.component';

describe('ModActionComponent', () => {
  let component: ModActionComponent;
  let fixture: ComponentFixture<ModActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModActionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
