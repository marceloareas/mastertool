import { Component, EventEmitter, Output } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-project',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, ReactiveFormsModule],
  templateUrl: './form-project.component.html',
  styleUrl: './form-project.component.scss',
})
export class FormProjectComponent {
 @Output() projectForm: EventEmitter<any> = new EventEmitter();

<<<<<<< HEAD
  project: FormGroup = new FormGroup({
    nome: new FormControl(),
    periodo: new FormControl(),
    descrição: new FormControl(),
    alunos: new FormControl(),
=======
  constructor(private fb: FormBuilder) {}

  project: FormGroup = this.fb.group({
    nome: [''],
    periodo: [''],
    alunos: [null],
    descricao: [''],
    data_inicio: [''],
    data_fim: ['']
>>>>>>> 1e5bce4 (feat: cadastro de projeto)
  });

}
