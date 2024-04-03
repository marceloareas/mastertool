import { Component, ViewChild, inject } from '@angular/core';
import { TopBarComponent } from '../../components/top-bar/top-bar.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ModalStudentComponent } from './components/modal-student/modal-student.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ClassService } from '../../services/class/class.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatLabel } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatInput } from '@angular/material/input';

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
    MatPaginatorModule
  ],
  templateUrl: './student.component.html',
  styleUrl: './student.component.scss',
})
export class StudentComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private dialog = inject(MatDialog);
  private classService = inject(ClassService);

  displayedColumns: string[] = ['nome'];
  dataSource!: MatTableDataSource<MatPaginator>;

  constructor() {
    this.classService.get().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  openModal() {
    this.dialog
      .open(ModalStudentComponent, {
        width: '600px',
      })
  }

  filter(event: Event){
    this.dataSource.filter = (event.target as HTMLInputElement)?.value;
  }
}
