import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { Router, RouterLink } from '@angular/router';
import { response } from 'express';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  rota = 'register';
  private _auth = inject(AuthenticationService);
  private _router = inject(Router);

  form = {
    email: '',
    senha: '',
  };

  login(): void {
    this._auth.login(this.form).subscribe({
      next: (response) => {
        if (response.token) {
          this._router.navigate(['/admin']);
        }
      },
      error: (error) => {
        alert(error);
      },
    });
  }
}
