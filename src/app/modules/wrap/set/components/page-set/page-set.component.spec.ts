import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PageSetComponent } from './page-set.component';

describe('SetComponent', () => {
  let component: PageSetComponent;
  let fixture: ComponentFixture<PageSetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PageSetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
