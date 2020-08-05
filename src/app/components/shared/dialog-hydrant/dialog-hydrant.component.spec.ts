import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogHydrantComponent } from './dialog-hydrant.component';

describe('DialogHydrantComponent', () => {
  let component: DialogHydrantComponent;
  let fixture: ComponentFixture<DialogHydrantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogHydrantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogHydrantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
