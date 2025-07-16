import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-form-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIcon,
    MatButtonModule,
  ],
  templateUrl: './form-login.component.html',
  styleUrl: './form-login.component.scss',
})
export class FormLoginComponent {
  @Output() registerEvent: EventEmitter<any> = new EventEmitter();
  @Output() loginEvent: EventEmitter<any> = new EventEmitter();
  @Input() mode: string = 'LOGIN';

  constructor(private fb: FormBuilder) {}

  form: FormGroup = this.fb.group({
    username: ['', Validators.required],
    email: ['', Validators.required],
    senha: ['', Validators.required],
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
  });

  /**
   * Submete o formulário com base no modo fornecido.
   * @param {string} mode - O modo de operação. Pode ser 'LOGIN' para submeter os dados do formulário de login ou qualquer
   * outro valor para submeter os dados de registro.
   * - Se o modo for 'LOGIN', o evento `loginEvent` é emitido com os valores do formulário.
   * - Caso contrário, o evento `registerEvent` é emitido com os valores do formulário.
   * @emits loginEvent - Emitido quando o modo é 'LOGIN'.
   * @emits registerEvent - Emitido quando o modo não é 'LOGIN'.
   */
  submit(mode: string) {
    if (mode === 'LOGIN') {
      this.loginEvent.emit(this.form.value);
    } else {
      this.registerEvent.emit(this.form.value);
    }
  }

  get senha(): string {
    return this.form.get('senha')?.value || '';
  }

  temMaiuscula(): boolean {
    return /[A-Z]/.test(this.senha);
  }

  temNumero(): boolean {
    return /\d/.test(this.senha);
  }

  temSimbolo(): boolean {
    return /[!@#$%^&*(),.?":{}|<>_\-+=/\\\[\]]/.test(this.senha);
  }
}
