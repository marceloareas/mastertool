import { Component } from '@angular/core';
import { TopBarComponent } from '../../components/top-bar/top-bar.component';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [TopBarComponent],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss'
})
export class ProjectComponent {
  showUpload: boolean = false;

  setShowUpload(){
    this.showUpload = true;
  };
}
