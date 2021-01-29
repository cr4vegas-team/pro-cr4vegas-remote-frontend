import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSettingCreateComponent } from './dialog-setting-create.component';

describe('DialogSettingCreateComponent', () => {
  let component: DialogSettingCreateComponent;
  let fixture: ComponentFixture<DialogSettingCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogSettingCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSettingCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
