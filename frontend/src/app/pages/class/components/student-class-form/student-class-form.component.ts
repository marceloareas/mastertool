import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { StudentService } from '../../../../services/student/student.service';

@Component({
  selector: 'app-student-class-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './student-class-form.component.html',
  styleUrl: './student-class-form.component.scss',
})
export class StudentClassFormComponent {
  private student = inject(StudentService);

  @Output() formClass: EventEmitter<any> = new EventEmitter();

  constructor(private fb: FormBuilder) {}
  students: any;
  form: FormGroup = this.fb.group({
    matricula: [''],
  });

  ngOnInit() {
    this.getStudent();
  }

  getStudent(){
    this.student.get().subscribe((data) => {
      this.students = data;
    });
  }

  /**
   * Emite os dados do formulário. Dependendo do modo, pode emitir dados para adicionar ou editar uma classe.
   */
  save() {
    this.formClass.emit(this.form.value);
  }
}
