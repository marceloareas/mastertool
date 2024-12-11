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
  @Input() project: any; // Agora é `project` em vez de `class`

  constructor(private fb: FormBuilder) {}

  students: any;
  form: FormGroup = this.fb.group({
    matricula: [''], // Campo de matrícula para associar estudante ao projeto
  });

  /**
   * Método executado após a inicialização do componente.
   */
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
          (student1: { nome: any; matricula: any }) =>
            !data.some(
              (student2: { nome: any; matricula: any }) =>
                student1.nome === student2.nome &&
                student1.matricula === student2.matricula
            )
        )
        .concat(
          data.filter(
            (student2: { nome: any; matricula: any }) =>
              !this.project.estudantes.some(
                (student1: { nome: any; matricula: any }) =>
                  student2.nome === student1.nome &&
                  student2.matricula === student1.matricula
              )
          )
        );
      console.log(this.students);
    });
  }

  /**
   * Emite os dados do formulário ao componente pai.
   */
  save() {
    this.formProject.emit(this.form.value);
  }
}
