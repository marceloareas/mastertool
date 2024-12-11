import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-form-project',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule],
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
    periodo: [''],
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

  populateForm() {
    console.log('Dados do formulário', this.data);
    this.project.patchValue(this.data);
  }

  save() {
    console.log('Dados do formulário:', this.project.value);
    this.formClass.emit(this.project.value);
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.project.patchValue({
          alunos: reader.result,
        });
      };
      reader.readAsText(file);
    }
  }
  
}
