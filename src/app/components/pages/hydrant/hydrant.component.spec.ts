import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HydrantComponent } from './hydrant.component';

describe('HydrantComponent', () => {
  let component: HydrantComponent;
  let fixture: ComponentFixture<HydrantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HydrantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HydrantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
