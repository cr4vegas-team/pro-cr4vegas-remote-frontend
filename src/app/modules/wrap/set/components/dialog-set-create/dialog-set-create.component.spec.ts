import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSetCreateComponent } from './dialog-set-create.component';

describe('DialogSetCreateComponent', () => {
  let component: DialogSetCreateComponent;
  let fixture: ComponentFixture<DialogSetCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogSetCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSetCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
