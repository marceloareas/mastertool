import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
rota = 'register'
private _auth = inject(AuthenticationService);

  form = {
    email: '',
    senha: ''
  };

  onSubmit(){
    console.log(this.form)
    this._auth.post_login(this.form).subscribe(() => {
      alert('Cadastrado com sucesso')
    })
  }
}
