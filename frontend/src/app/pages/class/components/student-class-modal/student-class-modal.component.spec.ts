import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentClassModalComponent } from './student-class-modal.component';

describe('StudentClassModalComponent', () => {
  let component: StudentClassModalComponent;
  let fixture: ComponentFixture<StudentClassModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentClassModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentClassModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
