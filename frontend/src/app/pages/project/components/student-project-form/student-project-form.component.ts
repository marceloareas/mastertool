import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { StudentService } from '../../../../services/student/student.service';
import { Observable, map, startWith } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-student-project-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    AsyncPipe,
  ],
  templateUrl: './student-project-form.component.html',
  styleUrls: ['./student-project-form.component.scss'],
})
export class StudentProjectFormComponent {
  private studentService = inject(StudentService);

  @Input() project: any;
  @Output() formProject: EventEmitter<any> = new EventEmitter();

  constructor(private fb: FormBuilder) { }
  
  students: any[] = [];
  filteredStudents!: Observable<any[]>;
  studentControl = new FormControl('');
  
  form: FormGroup = this.fb.group({
    matricula: [''],
    remove: false
  });

  ngOnInit() {
    this.filteredStudents = this.studentControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['project'] && this.project) {
      setTimeout(() => {
        this.getStudents();
      });
    }
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

  getStudents() {
    this.studentService.get().subscribe((data) => {
      const alunosProjeto = this.project?.alunos ?? [];
      
      this.students = data.filter(
        (alunoData: { nome: any; matricula: any }) =>
          !alunosProjeto.some(
            (alunoProjeto: { nome: any; matricula: any }) =>
              alunoData.matricula === alunoProjeto.matricula &&
              alunoData.nome === alunoProjeto.nome
          )
      );
      
      // Atualiza o filtro após carregar os estudantes
      this.studentControl.updateValueAndValidity();
    });
  }

  save() {
    this.formProject.emit(this.form.value);
  }
}