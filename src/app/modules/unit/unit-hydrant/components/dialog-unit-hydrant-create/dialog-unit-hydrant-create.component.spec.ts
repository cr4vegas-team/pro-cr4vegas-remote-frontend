import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogUnitHydrantCreateComponent } from './dialog-unit-hydrant-create.component';


describe('DialogHydrantCreateComponent', () => {
  let component: DialogUnitHydrantCreateComponent;
  let fixture: ComponentFixture<DialogUnitHydrantCreateComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [DialogUnitHydrantCreateComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogUnitHydrantCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
