import { Component, ViewChild, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ModalStudentComponent } from './components/modal-student/modal-student.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatInput } from '@angular/material/input';
import { StudentService } from '../../services/student/student.service';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [
    MatDialogModule,
    MatTableModule,
    MatFormFieldModule,
    MatInput,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
  ],
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss'],
})
export class StudentComponent {
  private dialog = inject(MatDialog);
  private student = inject(StudentService);
  private snackBar = inject(MatSnackBar);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['matricula', 'nome', 'editar'];
  dataSource!: MatTableDataSource<any>;

  studentControl = new FormControl('');
  studentsList: any[] = [];
  filteredStudents: any[] = [];

  ngOnInit() {
    this.getStudent();

    this.studentControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value || ''))
      )
      .subscribe(filtered => {
        this.filteredStudents = filtered;
        this.dataSource.filter = (this.studentControl.value || '').trim().toLowerCase();
      });
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
    }
  }

  /**
   * Obtém a lista de estudantes e configura a tabela e autocomplete.
   */
  getStudent() {
    this.student.get().subscribe((data) => {
      this.studentsList = data;
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;

      // Configura função de filtro personalizada (para pegar nome no dataSource)
      this.dataSource.filterPredicate = (data: any, filter: string) =>
        data.nome.toLowerCase().includes(filter);
      
      this.filteredStudents = data;
    });
  }

  /**
   * Exclui um estudante pelo ID fornecido.
   * @param id ID do estudante a ser excluído.
   */
  delete(id: string) {
    this.student.delete(id).subscribe(() => {
      this.snackBar.open('Aluno excluído com sucesso!', 'Fechar', {
        duration: 5000,
      });
      this.getStudent();
    });
  }

  /**
   * Abre um modal para adicionar ou editar um estudante.
   * @param matricula Matrícula do estudante para edição, se disponível.
   * @param mode Modo do modal, padrão é 'ADD' para adicionar.
   */
  openModal(matricula?: string, mode = 'ADD') {
    this.dialog
      .open(ModalStudentComponent, {
        width: '600px',
        data: { matricula, mode },
      })
      .afterClosed()
      .subscribe(() => {
        this.getStudent();
      });
  }

  /**
   * Função para filtrar lista de alunos no autocomplete.
   */
  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.studentsList.filter(student =>
      student.nome.toLowerCase().includes(filterValue)
    );
  }
}
