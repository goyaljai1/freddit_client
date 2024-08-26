import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCommuniyPostComponent } from './view-communiy-post.component';

describe('ViewCommuniyPostComponent', () => {
  let component: ViewCommuniyPostComponent;
  let fixture: ComponentFixture<ViewCommuniyPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewCommuniyPostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCommuniyPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
