import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentClassFormComponent } from './student-class-form.component';

describe('StudentClassFormComponent', () => {
  let component: StudentClassFormComponent;
  let fixture: ComponentFixture<StudentClassFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentClassFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentClassFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
