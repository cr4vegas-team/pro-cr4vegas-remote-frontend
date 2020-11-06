import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogUnitPondCreateComponent } from './dialog-unit-pond-create.component';


describe('DialogUnitPondCreateComponent', () => {
  let component: DialogUnitPondCreateComponent;
  let fixture: ComponentFixture<DialogUnitPondCreateComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ DialogUnitPondCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogUnitPondCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
