import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSectorCreateComponent } from './dialog-sector-create.component';

describe('DialogSectorCreateComponent', () => {
  let component: DialogSectorCreateComponent;
  let fixture: ComponentFixture<DialogSectorCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogSectorCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSectorCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
