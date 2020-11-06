import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageAlarmComponent } from './page-alarm.component';

describe('PageAlarmComponent', () => {
  let component: PageAlarmComponent;
  let fixture: ComponentFixture<PageAlarmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageAlarmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageAlarmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
