import { MatIconModule } from '@angular/material/icon';
import { Component, ViewChild, inject } from '@angular/core';
import { TopBarComponent } from '../../components/top-bar/top-bar.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ModalStudentComponent } from './components/modal-student/modal-student.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatLabel } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatInput } from '@angular/material/input';
import { StudentService } from '../../services/student/student.service';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [
    TopBarComponent,
    MatDialogModule,
    MatTableModule,
    MatLabel,
    MatFormFieldModule,
    MatInput,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
  ],
  templateUrl: './student.component.html',
  styleUrl: './student.component.scss',
})
export class StudentComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private dialog = inject(MatDialog);
  private student = inject(StudentService);

  displayedColumns: string[] = ['matricula', 'nome', 'editar'];
  dataSource!: MatTableDataSource<MatPaginator>;

  constructor() {
    this.getStudent();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getStudent() {
    this.student.get().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;    });
  }

  delete() {}

  openModal(data?: any) {
    this.dialog
      .open(ModalStudentComponent, { width: '600px' })
      .afterClosed()
      .subscribe(() => {
        this.getStudent();
      });
  }

  filter(event: Event) {
    this.dataSource.filter = (event.target as HTMLInputElement)?.value;
  }
}
