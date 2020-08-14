import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSetComponent } from './dialog-set.component';

describe('DialogSetComponent', () => {
  let component: DialogSetComponent;
  let fixture: ComponentFixture<DialogSetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogSetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
