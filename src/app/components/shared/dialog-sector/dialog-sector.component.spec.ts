import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSectorComponent } from './dialog-sector.component';

describe('DialogSectorComponent', () => {
  let component: DialogSectorComponent;
  let fixture: ComponentFixture<DialogSectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogSectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
