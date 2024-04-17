import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-form-class',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './form-class.component.html',
  styleUrl: './form-class.component.scss',
})
export class FormClassComponent {
  @Output() formClass: EventEmitter<any> = new EventEmitter();

  class: FormGroup = new FormGroup({
    nome: new FormControl(),
    periodo: new FormControl(),
    turma: new FormControl(),
  });

  onFileChange(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.class.patchValue({
        turma: file,
      });
    }
  }

  save() {
    const formData = new FormData();
    formData.append('nome', this.class.value.nome);
    formData.append('periodo', this.class.value.periodo);
    const turmaValue = this.class.get('turma')?.value; // Obtendo o valor do campo 'turma'
    if (turmaValue instanceof File) {
      formData.append('arquivo', turmaValue, turmaValue.name); // Adicionando o arquivo ao FormData
    }

    // Criar um novo objeto para emitir
    const formDataToSend = {
      nome: this.class.value.nome,
      periodo: this.class.value.periodo,
      turma: turmaValue, // Adicionando o objeto de arquivo
    };

    this.formClass.emit(formDataToSend);
  }
}
