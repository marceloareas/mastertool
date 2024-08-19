import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ClassService } from '../../../../services/class/class.service';

@Component({
  selector: 'app-form-class',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './form-class.component.html',
  styleUrl: './form-class.component.scss',
})
export class FormClassComponent {
  private classService = inject(ClassService);
  @Output() formClass: EventEmitter<any> = new EventEmitter();

  class: FormGroup = new FormGroup({
    nome: new FormControl(),
    periodo: new FormControl(),
    turma: new FormControl(),
  });
  file!: any;

  onFileChange(event: any) {
    this.file = event.target.files[0];
  }

  save(){
    const formData = new FormData();
    formData.append('file', this.file);

    this.formClass.emit(formData);
  }

  /*  save() {
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
  } */
}
