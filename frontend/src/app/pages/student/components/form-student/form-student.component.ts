import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
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
  @Input() mode: any;
  @Output() formStudent: EventEmitter<any> = new EventEmitter();

  constructor(private fb: FormBuilder) {}

  form: FormGroup = this.fb.group({
    matricula: [''],
    nome: [''],
  });

  ngOnInit() {
    console.log(this.data)
    if (this.data) {
      this.populateForm();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && this.data) {
      this.populateForm();
    }
  }

  save() {
    console.log('entrei')
    this.formStudent.emit(this.form.value)
  }

  populateForm() {
    this.form.patchValue(this.data);
  }
}
