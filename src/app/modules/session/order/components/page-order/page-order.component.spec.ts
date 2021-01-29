import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageOrderComponent } from './page-order.component';

describe('PageOrderComponent', () => {
  let component: PageOrderComponent;
  let fixture: ComponentFixture<PageOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
