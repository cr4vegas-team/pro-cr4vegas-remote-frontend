import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageUnitHydrantComponent } from './page-unit-hydrant.component';


describe('HydrantComponent', () => {
  let component: PageUnitHydrantComponent;
  let fixture: ComponentFixture<PageUnitHydrantComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ PageUnitHydrantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageUnitHydrantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
