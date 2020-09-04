import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageSectorComponent } from './page-sector.component';

describe('SectorComponent', () => {
  let component: PageSectorComponent;
  let fixture: ComponentFixture<PageSectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageSectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageSectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
