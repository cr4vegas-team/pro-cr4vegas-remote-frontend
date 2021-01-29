import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DialogResultComponent } from './dialog-result.component';

describe('DialogResultComponent', () => {
  let component: DialogResultComponent;
  let fixture: ComponentFixture<DialogResultComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
