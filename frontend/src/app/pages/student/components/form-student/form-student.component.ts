import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
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
  @Output() formStudentEvent: EventEmitter<any> = new EventEmitter();
  @Input() data: any;
  @Input() mode: any;

  constructor(private fb: FormBuilder) {}

  formStudent: FormGroup = this.fb.group({
    matricula: [''],
    nome: [''],
  });

  ngOnInit() {
    if (this.data) {
      this.populateForm();
    }
  }

  /**
   * Método de ciclo de vida chamado quando uma propriedade de entrada é alterada.
   * @param changes Contém as mudanças nas propriedades de entrada.
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && this.data) {
      this.populateForm();
    }
  }

  /**
   * Emite os dados do formulário através do evento `formStudentEvent`.
   */
  save() {
    this.formStudentEvent.emit(this.formStudent.value);
  }

  /**
   * Preenche o formulário com os dados fornecidos.
   */
  populateForm() {
    this.formStudent.patchValue(this.data);
  }
}
