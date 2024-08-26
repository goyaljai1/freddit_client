import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDetailedPostComponent } from './view-detailed-post.component';

describe('ViewDetailedPostComponent', () => {
  let component: ViewDetailedPostComponent;
  let fixture: ComponentFixture<ViewDetailedPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewDetailedPostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDetailedPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
