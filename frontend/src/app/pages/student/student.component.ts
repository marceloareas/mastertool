import { Component, inject } from '@angular/core';
import { TopBarComponent } from '../../components/top-bar/top-bar.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ModalStudentComponent } from './components/modal-student/modal-student.component';
import { MatTableModule } from '@angular/material/table';
import { FormControl, FormGroup } from '@angular/forms';
import { ClassService } from '../../services/class/class.service';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [TopBarComponent, MatDialogModule, MatTableModule],
  templateUrl: './student.component.html',
  styleUrl: './student.component.scss',
})
export class StudentComponent {
  private dialog = inject(MatDialog);
  private classService = inject(ClassService);
  showUpload: boolean = false;
  displayedColumns: string[] = ['nome'];
  dataSource: any;

     ngOnInit(){
    this.classService.get().subscribe( data => {
      this.dataSource = data;
    })
  }
  openModal() {
    this.dialog
      .open(ModalStudentComponent, {
        width: '600px',
      })
      .afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
  }
}
