import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopularPostsComponent } from './popular-posts.component';

describe('PopularPostsComponent', () => {
  let component: PopularPostsComponent;
  let fixture: ComponentFixture<PopularPostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PopularPostsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopularPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
