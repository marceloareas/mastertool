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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

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
    MatSnackBarModule
  ],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss',
})
export class CadastroComponent {
  private _auth = inject(AuthenticationService);
  private router = inject(Router);
  private snackbar = inject(MatSnackBar);

  onSubmit(data: any) {
    this._auth.post(data).subscribe({
      next: () => {
        this.snackbar.open('Cadastrado com sucesso!', 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-success'],
        });
        this.router.navigate(['']);
      },
      error: (res) => {
        this.snackbar.open('Usuário já cadastrado.', 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });
      },
    });
  }


  voltar() {
    this.router.navigate(['']);
  }
}
