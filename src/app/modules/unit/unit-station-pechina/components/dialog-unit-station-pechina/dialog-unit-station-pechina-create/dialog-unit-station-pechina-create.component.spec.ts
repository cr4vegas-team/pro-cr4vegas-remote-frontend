import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUnitStationPechinaCreateComponent } from './dialog-unit-station-pechina-create.component';

describe('DialogUnitStationPechinaCreateComponent', () => {
  let component: DialogUnitStationPechinaCreateComponent;
  let fixture: ComponentFixture<DialogUnitStationPechinaCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogUnitStationPechinaCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogUnitStationPechinaCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
