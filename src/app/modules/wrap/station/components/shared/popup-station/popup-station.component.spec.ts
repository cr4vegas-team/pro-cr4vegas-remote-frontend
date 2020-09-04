import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupStationComponent } from './popup-station.component';

describe('PopupStationComponent', () => {
  let component: PopupStationComponent;
  let fixture: ComponentFixture<PopupStationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupStationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupStationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
