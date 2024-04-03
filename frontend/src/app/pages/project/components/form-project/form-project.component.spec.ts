import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormProjectComponent } from './form-project.component';

describe('FormProjectComponent', () => {
  let component: FormProjectComponent;
  let fixture: ComponentFixture<FormProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormProjectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
