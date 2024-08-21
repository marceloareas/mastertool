import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { Router, RouterLink } from '@angular/router';
import { response } from 'express';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormLoginComponent } from '../../components/form-login/form-login.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormLoginComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  rota = 'register';
  private _auth = inject(AuthenticationService);
  private _router = inject(Router);

  login(data: any): void {
    this._auth.login(data).subscribe({
      next: (response) => {
        if (response.token) {
          this._router.navigate(['/admin']);
        }
      },
      error: (error) => {
        console.log(error);
        alert(error);
      },
    });
  }
}
