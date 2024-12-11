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
