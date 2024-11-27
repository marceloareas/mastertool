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
  pesos: Record<string, number> = {};

  mode: string = 'VIEW';

  constructor(public dialog: MatDialog) {}

  /**
   * Método do ciclo de vida do Angular que é chamado após a construção do componente.
   * Inicializa as colunas da tabela e atualiza os dados.
   */
  ngOnInit() {
    this.initializeColumns();
    this.refreshTable();
  }

  /**
   * Inicializa as colunas da tabela com base nos títulos de cada notas dos alunos.
   * Configura `notaColumns` e `displayedColumns`.
   */
  initializeColumns() {
    if (this.class && this.class.alunos && this.class.alunos.length > 0) {
      this.notaColumns = this.class.alunos[0].notas.map(
        (nota: any) => nota.titulo
      );
      this.displayedColumns = ['nome', ...this.notaColumns, 'media', 'editar'];
    }
  }

  /**
   * Atualiza a fonte de dados da tabela e configura o paginador.
   */
  refreshTable() {
    this.dataSource = new MatTableDataSource(this.class.alunos);
    this.dataSource.paginator = this.paginator;
    console.log('data', this.dataSource.data);
  }

  /**
   * Obtém os dados da classe do serviço `classService` e atualiza a tabela.
   */
  getClass() {
    this.classService.get(this.class.id).subscribe((data) => {
      this.class = data;
      this.refreshTable();
    });
  }

  /**
   * Adiciona uma nova coluna de notas à tabela e atualiza os dados dos alunos para incluir um objeto de nota vazio.
   */
  addNewColumn() {
    const newColumn = `novaNota ${this.notaColumns.length + 1}`;
    this.notaColumns.push(newColumn);
    this.displayedColumns.splice(
      this.displayedColumns.length - 2,
      0,
      newColumn
    );
  
    // Define o peso inicial como 1
    this.pesos[newColumn] = 1;
  
    this.dataSource.data.forEach((aluno: any) => {
      aluno.notas.push({ titulo: newColumn, valor: null });
    });
  
    this.refreshTable();
  }

  /**
   * Remove uma coluna de notas com base no nome e notifica o serviço `classService` para atualizar os dados no backend.
   * @param name Nome da coluna a ser removida.
   */
  removeColumn(name: string) {
    const data = { titulo: name };
    // Remove a coluna da lista de notas
    const index = this.notaColumns.indexOf(name);
    if (index !== -1) {
      this.notaColumns.splice(index, 1);
    }

    // Remove a coluna da lista de colunas exibidas
    const colIndex = this.displayedColumns.indexOf(name);
    if (colIndex !== -1) {
      this.displayedColumns.splice(colIndex, 1);
    }

    this.classService.postNota(this.class.id, data).subscribe(() => {
      alert('Coluna removida com sucesso!');
      this.closeModal();
      this.getClass();
    });
  }

  /**
   * Atualiza o nome da coluna com base na entrada do usuário.
   * @param event Evento de alteração do input.
   * @param columnIndex Índice da coluna a ser atualizada.
   */
  updateColumnName(event: any, columnIndex: any) {
    const newName = event.target.value.trim();
    if (newName) {
      const oldName = this.notaColumns[columnIndex];
      this.notaColumns[columnIndex] = newName;
      const oldTitleIndex = this.displayedColumns.indexOf(oldName);
      if (oldTitleIndex !== -1) {
        this.displayedColumns[oldTitleIndex] = newName;
      }

      // Atualiza o título da nota para todos os alunos
      this.class.alunos.forEach((item: any) => {
        item.notas.forEach((nota: any) => {
          if (nota.titulo === oldName) {
            nota.titulo = newName;
          }
        });
      });

      // Atualiza a tabela para refletir as mudanças
      this.refreshTable();
    }
  }

  /**
   * Atualiza o valor da nota para um aluno em uma posição específica com base na entrada do usuário.
   * @param event Evento de alteração do input.
   * @param element Objeto do aluno.
   * @param columnName Nome da coluna da nota a ser atualizada.
   */
  updateNota(event: Event, element: any, columnName: string) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      const value = inputElement.value;

      const notaIndex = element.notas.findIndex(
        (nota: any) => nota.titulo === columnName
      );

      if (notaIndex !== -1) {
        element.notas[notaIndex].valor = value === '' ? null : value;
        console.log('nota', value);
      } else {
        console.error(
          `Nota com título "${columnName}" não encontrada para o aluno.`
        );
      }
    }
  }

  updatePeso(event: Event, columnName: string) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      const newPeso = parseFloat(inputElement.value);
      if (!isNaN(newPeso) && newPeso > 0) {
        this.pesos[columnName] = newPeso; // Atualiza o peso no objeto 'pesos'
        console.log(`Peso atualizado para a coluna "${columnName}":`, newPeso);
      }
    }
  }
  

  /**
   * Altera o modo do componente (por exemplo, `VIEW` ou `EDIT`).
   * @param mode Novo modo para o componente.
   */
  changeMode(mode: string) {
    this.mode = mode;
  }

  /**
   * Deleta um aluno com base na matrícula fornecida e atualiza a visualização.
   * @param matricula Matrícula do aluno a ser removido.
   */
  deleteStudent(matricula: any) {
    const data = { removerMatricula: matricula };
    this.classService.put(this.class.id, data).subscribe(() => {
      alert('Registro deletado');
      this.getClass();
      this.closeModal();
    });
  }

  /**
   * Abre um modal para adicionar ou editar uma turma. Após o fechamento do modal, atualiza os dados da classe.
   * @param singleClass Objeto da turma.
   * @param mode Modo de operação do modal ('ADD' ou 'EDIT').
   */
  openModalClass(singleClass?: any, mode = 'ADD') {
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

  /**
   * Abre um modal para adicionar um novo aluno à classe. Após o fechamento do modal, atualiza os dados da classe.
   */
  openModalStudent() {
    this.dialog
      .open(StudentClassModalComponent, {
        data: { class: this.class },
      })
      .afterClosed()
      .subscribe(() => {
        this.getClass();
        this.closeModal();
      });
  }

  /**
   * Emite um evento para fechar a visualização da classe.
   */
  closeClass() {
    this.closeClassEvent.emit();
  }

  /**
   * Emite um evento para fechar o modal aberto.
   */
  closeModal() {
    this.closeModalEvent.emit();
  }

  /**
   * Salva as notas atualizadas no backend e muda o modo para `VIEW`.
   */
  save() {
    this.mode = 'VIEW';
    console.log('salvar', this.dataSource.data);
    this.classService
      .postNota(this.class.id, this.dataSource.data)
      .subscribe(() => {
        alert('Notas atualizadas com sucesso!');
        this.getClass();
      });
  }

  getPeso(columnName: string): number {
    return this.pesos[columnName] || 1; // Retorna 1 como padrão se não houver peso definido
  }

/**
 * Calcula a média ponderada das notas de um aluno.
 * Ignora valores nulos ou inválidos e retorna a média formatada com uma casa decimal.
 * @param element Objeto do aluno.
 * @returns Média ponderada das notas formatada com uma casa decimal.
 */
media(element: any): string {
  // Filtra as notas válidas que possuem valor e peso
  const notasValidas = element.notas?.filter((nota: any) => {
    const valor = parseFloat(nota.valor);
    const peso = this.pesos[nota.titulo] || 1; // Obtém o peso atualizado ou usa 1 como padrão
    return !isNaN(valor) && valor !== null && peso > 0;
  });

  // Se não houver notas válidas, retorna "0.0"
  if (!notasValidas || notasValidas.length === 0) {
    return "0.0";
  }

  // Calcula o somatório ponderado das notas e o somatório dos pesos
  const { somaPonderada, somaPesos } = notasValidas.reduce(
    (acc: { somaPonderada: number; somaPesos: number }, nota: any) => {
      const valorNota = parseFloat(nota.valor);
      const peso = this.pesos[nota.titulo] || 1; // Obtém o peso atualizado ou usa 1 como padrão
      acc.somaPonderada += valorNota * peso;
      acc.somaPesos += peso;
      return acc;
    },
    { somaPonderada: 0, somaPesos: 0 }
  );

  // Calcula a média ponderada (evitando divisão por zero)
  const media = somaPesos > 0 ? somaPonderada / somaPesos : 0;

  // Retorna a média formatada com uma casa decimal
  return media.toFixed(1);
}

}
