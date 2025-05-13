import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTableDataSource } from '@angular/material/table';
import { StudentService } from '../../../../services/student/student.service';
import { AsyncPipe } from '@angular/common';
import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'app-student-class-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    AsyncPipe, // Adicionado para suportar o pipe async
  ],
  templateUrl: './student-class-form.component.html',
  styleUrl: './student-class-form.component.scss',
})
export class StudentClassFormComponent {
  private student = inject(StudentService);

  @Output() formClass: EventEmitter<any> = new EventEmitter();
  @Input() class: any;

  constructor(private fb: FormBuilder) { }
  
  students: any[] = [];
  filteredStudents!: Observable<any[]>;
  studentControl = new FormControl('');
  
  form: FormGroup = this.fb.group({
    matricula: [''],
  });

  ngOnInit() {
    this.filteredStudents = this.studentControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
    
    this.getStudent();
  }

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.students.filter(student => 
      student.nome.toLowerCase().includes(filterValue) || 
      student.matricula.toLowerCase().includes(filterValue)
    );
  }

  onOptionSelected(event: any) {
    const selectedStudent = this.students.find(student => 
      student.nome === event.option.value
    );
    
    if (selectedStudent) {
      this.form.patchValue({
        matricula: selectedStudent.matricula
      });
    }
  }

  getStudent() {
    this.student.get().subscribe((data) => {
      this.students = this.class.alunos
        .filter(
          (aluno1: { nome: any; matricula: any }) =>
            !data.some(
              (aluno2: { nome: any; matricula: any }) =>
                aluno1.nome === aluno2.nome &&
                aluno1.matricula === aluno2.matricula
            )
        )
        .concat(
          data.filter(
            (aluno2: { nome: any; matricula: any }) =>
              !this.class.alunos.some(
                (aluno1: { nome: any; matricula: any }) =>
                  aluno2.nome === aluno1.nome &&
                  aluno2.matricula === aluno1.matricula
              )
          )
        );
      
      // Atualiza o filtro após carregar os estudantes
      this.studentControl.updateValueAndValidity();
    });
  }

  save() {
    this.formClass.emit(this.form.value);
  }
}