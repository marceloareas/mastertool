import { MatIconModule } from '@angular/material/icon';
import { Component, ViewChild, inject } from '@angular/core';
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
  private dialog = inject(MatDialog);
  private student = inject(StudentService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['matricula', 'nome', 'editar'];
  dataSource!: MatTableDataSource<MatPaginator>;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.getStudent();
  }

  /**
   * Obtém a lista de estudantes do serviço e popula a fonte de dados da tabela.
   */
  getStudent() {
    this.student.get().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });
  }

  /**
   * Exclui um estudante pelo ID fornecido.
   * @param id ID do estudante a ser excluído.
   */
  delete(id: string) {
    this.student.delete(id).subscribe(() => {
      alert('Aluno excluído');
      this.getStudent();
    });
  }

/**
 * Verifica se um aluno já existe na base de dados.
 * @param matricula Matricula do estudante a ser verificado.
 */
alunoExiste(matricula: string) {
  this.student.alunoExiste(matricula).subscribe(
    (response) => {
      if (response.existe)
        alert(`Aluno com matrícula ${matricula} já existe!`);
    }
  );
}


  /**
   * Abre um modal para adicionar ou editar um estudante.
   * @param data Dados do estudante para edição, se disponível.
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
   * Filtra os dados da tabela com base no valor de entrada.
   * @param event Evento de entrada que acionou o filtro.
   */
  filter(event: Event) {
    this.dataSource.filter = (event.target as HTMLInputElement)?.value;
  }
}
