import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageStationComponent } from './page-station.component';

describe('StationComponent', () => {
  let component: PageStationComponent;
  let fixture: ComponentFixture<PageStationComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [PageStationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageStationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
