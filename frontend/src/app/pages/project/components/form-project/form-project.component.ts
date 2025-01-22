import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-form-project',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule ],
  templateUrl: './form-project.component.html',
  styleUrls: ['./form-project.component.scss'],
})
export class FormProjectComponent {
  @Input() data: any;
  @Input() mode: any;
  @Output() formClass: EventEmitter<any> = new EventEmitter();

  constructor(private fb: FormBuilder) {}

  project: FormGroup = this.fb.group({
    nome: [''],
    alunos: [null],
    descricao: [''],
    data_inicio: [''],
    data_fim: ['']
  });

  ngOnInit() {
    if (this.data) {
      this.populateForm();
    }
  }

  /**
   * Lê o conteúdo do arquivo selecionado e o armazena no campo `turma` do formulário.
   * @param event Evento de mudança de arquivo.
   */
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.project.patchValue({
          turma: reader.result,
        });
      };
      reader.readAsText(file);
    }
  }

  /**
   * Emite os dados do formulário. Dependendo do modo, pode emitir dados para adicionar ou editar um projeto.
   */
  save() {
    let data;
    if (this.mode == 'ADD') {
      data = this.project.value;
    } else {
      data = {
        nome: this.project.value.nome,
        descricao: this.project.value.descricao,
        data_inicio: this.project.value.data_inicio,
        data_fim: this.project.value.data_fim,
      };
    }

    this.formClass.emit(data);
  }

  /**
   * Preenche o formulário com os dados fornecidos através da entrada `data`.
   */
  populateForm() {
    this.project.patchValue(this.data);
  }
}
