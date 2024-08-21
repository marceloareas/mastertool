import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
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
  constructor(private fb: FormBuilder) {}

  @Input() data: any;
  @Input() mode: any;
  @Output() formClass: EventEmitter<any> = new EventEmitter();

  class: FormGroup = this.fb.group({
    nome: [''],
    periodo: [''],
    turma: [null], // Campo para referência, mas não vincule diretamente ao input de arquivo
  });

  ngOnInit() {
    if (this.data) {
      this.populateForm();
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.class.patchValue({
          turma: reader.result, // Armazena o conteúdo original do arquivo
        });
      };
      reader.readAsText(file); // Lê o conteúdo do arquivo como texto
    }
  }

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

  populateForm() {
    this.class.patchValue(this.data);
  }
}
