import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUnitStationPechinaComponent } from './dialog-unit-station-pechina.component';

describe('DialogUnitStationPechinaComponent', () => {
  let component: DialogUnitStationPechinaComponent;
  let fixture: ComponentFixture<DialogUnitStationPechinaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogUnitStationPechinaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogUnitStationPechinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
