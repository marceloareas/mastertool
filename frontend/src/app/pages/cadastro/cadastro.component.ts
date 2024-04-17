import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent {
  private _auth = inject(AuthenticationService);
  private router = inject(Router)

  form = {
    email: '',
    senha: ''
  };

  onSubmit(){
    console.log(this.form)
    this._auth.post(this.form).subscribe(() => {
      alert('Cadastrado com sucesso')
      this.router.navigate([''])
    })
  }
}
