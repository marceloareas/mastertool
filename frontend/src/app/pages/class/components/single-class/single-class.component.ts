import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewChild,
  inject,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ModalClassComponent } from '../modal-class/modal-class.component';
import { MatMenuModule } from '@angular/material/menu';
import { StudentClassModalComponent } from '../student-class-modal/student-class-modal.component';
import { ClassService } from '../../../../services/class/class.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-single-class',
  standalone: true,
  imports: [
    MatIcon,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatMenuModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './single-class.component.html',
  styleUrls: ['./single-class.component.scss'],
})
export class SingleClassComponent implements OnInit {
  private classService = inject(ClassService);

  @Output() closeClassEvent: EventEmitter<any> = new EventEmitter();
  @Output() closeModalEvent: EventEmitter<any> = new EventEmitter();
  @Input() class!: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['nome', 'editar'];
  notaColumns: string[] = [];
  dataSource!: MatTableDataSource<any>;

  mode: string = 'VIEW';

  data = [
    {
      matricula: '1234567BCC',
      nome: 'JOTTAp',
      notas: [
        { titulo: 'P1', valor: 9 },
        { titulo: 'EXTRA1', valor: 7 },
        { titulo: 'P2', valor: 10 },
        { titulo: 'EXTRA2', valor: 9 },
      ],
    },
    {
      matricula: '2345673BCC',
      nome: 'LARISSA ',
      notas: [
        { titulo: 'P1', valor: 9 },
        { titulo: 'EXTRA1', valor: null },
        { titulo: 'P2', valor: 10 },
        { titulo: 'EXTRA2', valor: 9 },
      ],
    },
  ];

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    this.initializeColumns();
    this.refreshTable();
  }

  getClass() {
    this.classService.get(this.class.id).subscribe((data) => {
      this.class = data;
      this.refreshTable();
    });
  }

  refreshTable() {
    this.dataSource = new MatTableDataSource(this.data);
    this.dataSource.paginator = this.paginator;
  }

  initializeColumns() {
    // Verifica se a classe e seus alunos estão disponíveis
    if (this.class && this.class.alunos && this.class.alunos.length > 0) {
      // Mapeia as colunas de 'notas' a partir do primeiro aluno, assumindo que todos têm as mesmas notas
      this.notaColumns = this.data[0].notas.map((nota: any) => nota.titulo);

      // Combina 'nome', as colunas de notas, e as colunas adicionais ('media' e 'editar')
      this.displayedColumns = ['nome', ...this.notaColumns, 'media', 'editar'];
    }
  }

  updateColumnName(event: any, columnIndex: any) {
    const newName = event.target.value.trim();
    if (newName) {
      this.notaColumns[columnIndex] = newName;
      this.displayedColumns[this.displayedColumns.indexOf(`novaNota${columnIndex + 1}`)] = newName;
    }
  }

    addNewColumn() {
      const newColumn = `novaNota${this.notaColumns.length + 1}`; // Nome temporário da coluna
      this.notaColumns.push(newColumn); // Adiciona o nome temporário à lista de colunas
      this.displayedColumns.splice(this.displayedColumns.length - 2, 0, newColumn); // Adiciona a nova coluna antes da coluna 'media'

  // Atualiza os dados para adicionar a nova nota como null para todos os alunos
  this.dataSource.data.forEach((aluno: any) => {
    aluno.notas.push({ titulo: newColumn, valor: null });
  });

  // Atualiza a tabela com os novos dados
  this.dataSource._updateChangeSubscription();
    }


  removeColumn(name: string) {
    this.classService
      .postNota(this.class.id, name)
      .subscribe(() => {
        alert('Coluna removida com sucesso!');
        this.closeModal();
        this.getClass(); // Atualiza os dados
      });
  }

  getNota(element: any, index: number): number {
    return element.notas && element.notas[index].valor !== undefined
      ? element.notas[index].valor
      : 0;
  }

  setNota(element: any, index: number, value: string) {
    if (!element.notas) {
      element.notas = [];
    }
    element.notas[index] = +value;
  }

  notaColIndex(notaCol: string): number {
      const index = this.notaColumns.indexOf(notaCol);
      return index;
  }

  handleNotaChange(event: Event, element: any, index: number) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      const value = Number(inputElement.value);
      element.notas[index].valie = value;
    }
  }

  teste3(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    // if (inputElement) {
    //   const value = Number(inputElement.value); // Converta o valor para número se necessário
    //   element.notas[index].nome = value;
    // }
  }

  delete(matricula: any) {
    const data = { removerMatricula: matricula };
    this.classService.put(this.class.id, data).subscribe(() => {
      alert('Registro deletado');
      this.getClass();
      this.closeModal();
    });
  }

  closeClass() {
    this.closeClassEvent.emit();
  }

  openModal(singleClass?: any, mode = 'ADD') {
    this.dialog
      .open(ModalClassComponent, {
        data: { singleClass, mode },
        width: '600px',
      })
      .afterClosed()
      .subscribe(() => {
        this.getClass();
        this.closeModal();
      });
  }

  openModalStudent() {
    this.dialog
      .open(StudentClassModalComponent, {
        data: { class: this.class.id },
      })
      .afterClosed()
      .subscribe(() => {
        this.getClass();
        this.closeModal();
      });
  }

  closeModal() {
    this.closeModalEvent.emit();
  }

  save() {
    const a = this.dataSource.data.map((item) => ({
      ...item,
      notas: item.notas?.filter((elemento: null) => elemento !== null),
    }));

    this.mode = 'VIEW';
    this.classService
      .postNota(this.class.id, this.dataSource.data)
      .subscribe(() => {
        alert('Notas atualizadas com sucesso!');
      });
  }

  teste() {
    this.mode = 'EDIT';
  }
  teste2() {
    this.mode = 'VIEW';
  }

  media(element: any) {
    const arraySemNulls = element.notas?.filter(
      (elemento: any) => elemento.valor !== null
    );
    const teste = arraySemNulls.map((item: { valor: any; }) => item.valor)
    const soma =
    teste?.reduce(
        (acumulador: number, elemento: number) => acumulador + elemento,
        0
      ) || 0;
    const media = teste?.length ? soma / teste.length : 0;

    return media.toFixed(1);
  }
}
