import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProjectModalComponent } from './components/project-modal/project-modal.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [ MatDialogModule, MatIcon, MatButtonModule],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss',
})
export class ProjectComponent {
  private dialog = inject(MatDialog);

  openModal() {
    this.dialog.open(ProjectModalComponent, {
      width: '600px',
    });
  }
}
