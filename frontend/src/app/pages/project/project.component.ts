import { Component, inject } from '@angular/core';
import { TopBarComponent } from '../../components/top-bar/top-bar.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProjectModalComponent } from './components/project-modal/project-modal.component';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [TopBarComponent, MatDialogModule],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss'
})
export class ProjectComponent {
  private dialog = inject(MatDialog);

  openModal(){
    this.dialog.open(ProjectModalComponent,{
      width:'600px',
    });
  }
}
