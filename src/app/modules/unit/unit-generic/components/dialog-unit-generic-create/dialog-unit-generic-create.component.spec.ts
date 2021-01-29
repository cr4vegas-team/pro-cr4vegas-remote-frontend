import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogUnitGenericCreateComponent } from './dialog-unit-generic-create.component';


describe('DialogUnitGenericCreateComponent', () => {
  let component: DialogUnitGenericCreateComponent;
  let fixture: ComponentFixture<DialogUnitGenericCreateComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ DialogUnitGenericCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogUnitGenericCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
