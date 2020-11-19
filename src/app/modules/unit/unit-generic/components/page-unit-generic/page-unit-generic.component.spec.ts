import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PageUnitGenericComponent } from './page-unit-generic.component';

describe('UnitGenericComponent', () => {
  let component: PageUnitGenericComponent;
  let fixture: ComponentFixture<PageUnitGenericComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PageUnitGenericComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageUnitGenericComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
