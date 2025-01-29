import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { StudentService } from '../../../../services/student/student.service';

@Component({
  selector: 'app-student-project-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './student-project-form.component.html',
  styleUrls: ['./student-project-form.component.scss'],
})
export class StudentProjectFormComponent {
  private studentService = inject(StudentService);

  @Output() formProject: EventEmitter<any> = new EventEmitter();
  @Input() project: any; 

  constructor(private fb: FormBuilder) {}
  students: any;
  form: FormGroup = this.fb.group({
    matricula: [''], 
  });

  ngOnInit() {
    this.getStudents();
  }

  /**
   * Busca a lista de estudantes e ajusta a lógica com base nos dados de projetos.
   */
  getStudents() {
    this.studentService.get().subscribe((data) => {
      this.students = this.project.estudantes
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
              !this.project.estudantes.some(
                (aluno1: { nome: any; matricula: any }) =>
                  aluno2.nome === aluno1.nome &&
                  aluno2.matricula === aluno1.matricula
              )
          )
        );
      console.log(this.students);
    });
  }

  /**
   * Emite os dados do formulário. Dependendo do modo, pode emitir dados para adicionar ou editar uma classe.
   */
  save() {
    this.formProject.emit(this.form.value);
  }
}
