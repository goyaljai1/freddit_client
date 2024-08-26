import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUserCommentComponent } from './view-user-comment.component';

describe('ViewUserCommentComponent', () => {
  let component: ViewUserCommentComponent;
  let fixture: ComponentFixture<ViewUserCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewUserCommentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewUserCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
