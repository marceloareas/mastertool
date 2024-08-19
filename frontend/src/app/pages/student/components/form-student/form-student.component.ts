import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-form-student',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './form-student.component.html',
  styleUrl: './form-student.component.scss',
})
export class FormStudentComponent {
  @Input() data: any;
  @Output() formClass: EventEmitter<any> = new EventEmitter();

  constructor(private fb: FormBuilder) {}

  form: FormGroup = this.fb.group({
    matricula: [''],
    nome: [''],
  });

  ngOnInit() {
    if (this.data) {
      this.populateForm();
    }
  }

  save() {}

  populateForm() {
    this.form.patchValue(this.data);
  }
}
