import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUnitGenericComponent } from './dialog-unit-generic.component';

describe('DialogUnitGenericComponent', () => {
  let component: DialogUnitGenericComponent;
  let fixture: ComponentFixture<DialogUnitGenericComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogUnitGenericComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogUnitGenericComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
