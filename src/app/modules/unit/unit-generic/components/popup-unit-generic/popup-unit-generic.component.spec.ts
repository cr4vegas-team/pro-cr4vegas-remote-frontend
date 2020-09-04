import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupUnitGenericComponent } from './popup-unit-generic.component';

describe('PopupUnitGenericComponent', () => {
  let component: PopupUnitGenericComponent;
  let fixture: ComponentFixture<PopupUnitGenericComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupUnitGenericComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupUnitGenericComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
