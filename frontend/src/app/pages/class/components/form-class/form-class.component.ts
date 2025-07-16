import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-form-class',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatIconModule,
    MatButtonModule],
  templateUrl: './form-class.component.html',
  styleUrl: './form-class.component.scss',
})
export class FormClassComponent {
  showInfo = false;
  @Input() data: any;
  @Input() mode: any;
  @Output() formClass: EventEmitter<any> = new EventEmitter();

  constructor(private fb: FormBuilder) { }

  class: FormGroup = this.fb.group({
    nome: [''],
    periodo: [''],
    turma: [null],
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
        this.class.patchValue({
          turma: reader.result,
        });
      };
      reader.readAsText(file);
    }
  }

  /**
   * Emite os dados do formulário. Dependendo do modo, pode emitir dados para adicionar ou editar uma classe.
   */
  save() {
    let data;
    if (this.mode == 'ADD') {
      data = this.class.value;
    } else {
      data = {
        nome: this.class.value.nome,
        periodo: this.class.value.periodo,
      };
    }

    this.formClass.emit(data);
  }

  /**
   * Preenche o formulário com os dados fornecidos através da entrada `data`.
   */
  populateForm() {
    this.class.patchValue(this.data);
  }
}
