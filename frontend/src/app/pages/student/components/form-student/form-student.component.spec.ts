import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormStudentComponent } from './form-student.component';

describe('FormStudentComponent', () => {
  let component: FormStudentComponent;
  let fixture: ComponentFixture<FormStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormStudentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
