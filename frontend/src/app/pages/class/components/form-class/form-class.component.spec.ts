import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormClassComponent } from './form-class.component';

describe('FormClassComponent', () => {
  let component: FormClassComponent;
  let fixture: ComponentFixture<FormClassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormClassComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
