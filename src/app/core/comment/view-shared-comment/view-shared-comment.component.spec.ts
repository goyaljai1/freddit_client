import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSharedCommentComponent } from './view-shared-comment.component';

describe('ViewSharedCommentComponent', () => {
  let component: ViewSharedCommentComponent;
  let fixture: ComponentFixture<ViewSharedCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewSharedCommentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewSharedCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
