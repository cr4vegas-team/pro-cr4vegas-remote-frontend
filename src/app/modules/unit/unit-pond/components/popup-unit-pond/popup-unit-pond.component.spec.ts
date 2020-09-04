import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupUnitPondComponent } from './popup-unit-pond.component';

describe('PopupUnitPondComponent', () => {
  let component: PopupUnitPondComponent;
  let fixture: ComponentFixture<PopupUnitPondComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupUnitPondComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupUnitPondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
