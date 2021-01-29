import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogUnitHydrantComponent } from './dialog-unit-hydrant.component';


describe('DialogHydrantComponent', () => {
  let component: DialogUnitHydrantComponent;
  let fixture: ComponentFixture<DialogUnitHydrantComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ DialogUnitHydrantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogUnitHydrantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
