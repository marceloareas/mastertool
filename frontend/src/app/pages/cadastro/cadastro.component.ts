import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
	imports: [ReactiveFormsModule, FormsModule, MatFormFieldModule, MatInputModule, MatIcon, MatButtonModule, FormLoginComponent, MatSnackBarModule],
	templateUrl: './cadastro.component.html',
	styleUrl: './cadastro.component.scss',
})

export class CadastroComponent {
	private _auth = inject(AuthenticationService);
	private router = inject(Router);
	private snackbar = inject(MatSnackBar);

	onSubmit(data: any) {

		// Checa se todos os campos estão preenchidos
		if (!data.username || !data.email || !data.senha || !data.first_name || !data.last_name) {
			this.snackbar.open('Preencha todos os campos!', 'Fechar', {
				duration: 3000,
				panelClass: ['snackbar-error'],
			});
			return;
		}

		this._auth.post(data).subscribe({
			next: () => {
				this.snackbar.open('Cadastrado com sucesso!', 'Fechar', {
					duration: 3000,
					panelClass: ['snackbar-success'],
				});
				this.router.navigate(['']);
			},

			error: (res) => {
				this.snackbar.open(res.error.message, 'Fechar', {
					duration: 3000,
					panelClass: ['snackbar-error'],
				});
				return;
			},
		});
	}


	voltar() {
		this.router.navigate(['']);
	}
}
