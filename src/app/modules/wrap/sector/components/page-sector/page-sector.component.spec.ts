import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PageSectorComponent } from './page-sector.component';

describe('SectorComponent', () => {
  let component: PageSectorComponent;
  let fixture: ComponentFixture<PageSectorComponent>;

  beforeEach(waitForAsync(() => {
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
