import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogOrderComponent } from './dialog-order.component';

describe('DialogOrderComponent', () => {
  let component: DialogOrderComponent;
  let fixture: ComponentFixture<DialogOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
