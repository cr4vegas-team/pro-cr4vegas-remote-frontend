import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogStationComponent } from './dialog-station.component';

describe('DialogStationComponent', () => {
  let component: DialogStationComponent;
  let fixture: ComponentFixture<DialogStationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogStationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogStationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
