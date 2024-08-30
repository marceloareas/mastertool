import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormLoginComponent } from '../../components/form-login/form-login.component';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIcon,
    MatButtonModule,
    FormLoginComponent,
  ],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss',
})
export class CadastroComponent {
  private _auth = inject(AuthenticationService);
  private router = inject(Router);

  onSubmit(data: any) {
    this._auth.post(data).subscribe({
      next: () => {
        alert('Cadastrado com sucesso');
        this.router.navigate(['']);
      },
      error: (res) => {
        alert('Usuário já cadastrado');
      },
    });
  }

  voltar() {
    this.router.navigate(['']);
  }
}
