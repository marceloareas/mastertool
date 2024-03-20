import { Component, inject } from '@angular/core';
import { TopBarComponent } from '../../components/top-bar/top-bar.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ClassService } from '../../services/class/class.service';

@Component({
  selector: 'app-class',
  standalone: true,
  imports: [TopBarComponent, ReactiveFormsModule],
  templateUrl: './class.component.html',
  styleUrl: './class.component.scss',
})
export class ClassComponent {
  private classService = inject(ClassService);

  class: FormGroup = new FormGroup({
    nome: new FormControl(),
    periodo: new FormControl(),
    turma: new FormControl(),
  });
  showUpload: boolean = false;

  setShowUpload() {
    this.showUpload = true;
  }

  onChange(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.class.patchValue({
        turma: file,
      });
    }
  }


  onSubmit() {
    const formData = new FormData();
    formData.append('nome', this.class.value.nome);
    formData.append('periodo', this.class.value.periodo);
    formData.append('arquivo', this.class.value.turma);

    this.classService.post(formData).subscribe((response) => {
      console.log('Arquivo enviado com sucesso!', response);
    });
  }
}