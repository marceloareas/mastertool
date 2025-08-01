import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';

@Component({
  selector: 'app-form-project',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatIconModule, 
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule ],
  templateUrl: './form-project.component.html',
  styleUrls: ['./form-project.component.scss'],
})
export class FormProjectComponent {
  showInfo = false;
  @Input() data: any;
  @Input() mode: any;
  @Output() formProject: EventEmitter<any> = new EventEmitter();

  constructor(private fb: FormBuilder) {}

  project: FormGroup = this.fb.group({
    nome: [''],
    periodo: [''],
    turma: [null],
    descricao: [''],
    data_inicio: [''],
    data_fim: [null]
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
        periodo: this.project.value.periodo,
        descricao: this.project.value.descricao,
        data_inicio: this.project.value.data_inicio,
        data_fim: this.project.value.data_fim,
      };
    }
    this.formProject.emit(data);
  }

  /**
   * Preenche o formulário com os dados fornecidos através da entrada `data`.
   */
  populateForm() {
    this.project.patchValue(this.data);
  }
}
