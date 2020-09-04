import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageUnitPondComponent } from './page-unit-pond.component';

describe('UnitPondComponent', () => {
  let component: PageUnitPondComponent;
  let fixture: ComponentFixture<PageUnitPondComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageUnitPondComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageUnitPondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
