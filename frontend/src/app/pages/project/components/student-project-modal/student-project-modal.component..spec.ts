import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentProjectModalComponent } from './student-project-modal.component';

describe('StudentProjectModalComponent', () => {
  let component: StudentProjectModalComponent;
  let fixture: ComponentFixture<StudentProjectModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentProjectModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentProjectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
