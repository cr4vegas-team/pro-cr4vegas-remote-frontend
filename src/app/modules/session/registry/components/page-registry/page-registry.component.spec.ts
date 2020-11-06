import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageRegistryComponent } from './page-registry.component';

describe('PageRegistryComponent', () => {
  let component: PageRegistryComponent;
  let fixture: ComponentFixture<PageRegistryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageRegistryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageRegistryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
