import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewChild,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ClassService } from '../../../../services/class/class.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalClassComponent } from '../modal-class/modal-class.component';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-single-class',
  standalone: true,
  imports: [
    MatIcon,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatMenuModule,
  ],
  templateUrl: './single-class.component.html',
  styleUrl: './single-class.component.scss',
})
export class SingleClassComponent {
  private classService = inject(ClassService);

  @Input() class!: any;
  @Output() closeClassEvent: EventEmitter<any> = new EventEmitter();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['nome', 'editar'];
  dataSource!: MatTableDataSource<MatPaginator>;

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    this.getClass();
  }

  getClass() {
    this.dataSource = new MatTableDataSource(this.class.alunos);
    this.dataSource.paginator = this.paginator;
  }

  closeClass() {
    this.closeClassEvent.emit();
  }

  openModal(data?: any, mode = 'ADD') {
    this.dialog
      .open(ModalClassComponent, {
        data: { data: data, mode },
        width: '600px',
      })
      .afterClosed()
      .subscribe(() => {
        this.getClass();
      });
  }

  delete(id: string) {
    // this.student.delete(id).subscribe(() => {
    //   alert('Aluno excluído');
    //   this.getStudent();
    // });
  }
}
