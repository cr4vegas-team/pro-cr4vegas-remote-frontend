import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUnitPondComponent } from './dialog-unit-pond.component';

describe('DialogUnitPondComponent', () => {
  let component: DialogUnitPondComponent;
  let fixture: ComponentFixture<DialogUnitPondComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogUnitPondComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogUnitPondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
