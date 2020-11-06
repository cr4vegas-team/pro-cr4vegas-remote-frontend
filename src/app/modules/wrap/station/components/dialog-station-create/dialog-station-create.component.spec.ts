import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogStationCreateComponent } from './dialog-station-create.component';


describe('DialogStationCreateComponent', () => {
  let component: DialogStationCreateComponent;
  let fixture: ComponentFixture<DialogStationCreateComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ DialogStationCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogStationCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
