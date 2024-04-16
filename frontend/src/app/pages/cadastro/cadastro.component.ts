import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication/authentication.service';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent {
  private _auth = inject(AuthenticationService);

  form = {
    email: '',
    senha: ''
  };

  onSubmit(){
    console.log(this.form)
    this._auth.post(this.form).subscribe(() => {
      alert('Cadastrado com sucesso')
    })
  }
}
