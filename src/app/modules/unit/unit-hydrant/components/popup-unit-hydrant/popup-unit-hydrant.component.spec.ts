import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupUnitHydrantComponent } from './popup-unit-hydrant.component';

describe('PopupUnitHydrantComponent', () => {
  let component: PopupUnitHydrantComponent;
  let fixture: ComponentFixture<PopupUnitHydrantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupUnitHydrantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupUnitHydrantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
