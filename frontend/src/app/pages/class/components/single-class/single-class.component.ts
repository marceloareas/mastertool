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

@Component({
  selector: 'app-single-class',
  standalone: true,
  imports: [MatIcon, MatButtonModule, MatTableModule, MatPaginatorModule],
  templateUrl: './single-class.component.html',
  styleUrl: './single-class.component.scss',
})
export class SingleClassComponent {
  private classService = inject(ClassService);

  @Input() class!: any;
  @Output() closeClassEvent: EventEmitter<any> = new EventEmitter();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['nome'];
  dataSource!: MatTableDataSource<MatPaginator>;

  ngOnInit() {
    this.getClass();
    console.log(this.class);
  }

  getClass() {
    this.dataSource = new MatTableDataSource(this.class.alunos);
    this.dataSource.paginator = this.paginator;
  }

  closeClass() {
    this.closeClassEvent.emit();
  }

  delete(id: string) {
    this.classService.delete(id).subscribe(() => {
      alert('Turma excluída');
    });
  }
}
