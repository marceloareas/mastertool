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
import {MatDialogModule} from '@angular/material/dialog';

import { saveAs } from 'file-saver';

@Component({
  selector: 'app-single-class',
  standalone: true,
  imports: [
    MatDialogModule,
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
  @ViewChild('removeNotesDialog') removeNotesDialog!: any; // Referência ao modal

  displayedColumns: string[] = ['nome', 'editar'];
  notaColumns: string[] = [];
  dataSource!: MatTableDataSource<any>;
  pesos: Record<string, number> = {};
  quantityToRemove: number = 1;

  mode: string = 'VIEW';

  constructor(public dialog: MatDialog) { }

  openRemoveNotesModal() {
    this.dialog.open(this.removeNotesDialog);
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  /**
 * Confirma a remoção de notas.
 * Remove a quantidade especificada de notas da tabela.
 */
  confirmRemoveNotes() {
    const notesToRemove = this.quantityToRemove;
  
    // Verificação: impede remoção se a quantidade for inválida
    if (notesToRemove <= 0) {
      alert('Por favor, insira uma quantidade válida.');
      return;
    }
  
    // Verificação: impede remoção se a quantidade for maior que o número de colunas
    const totalColumns = this.notaColumns.length;
    if (notesToRemove > totalColumns) {
      alert(`Quantidade inválida! Existem apenas ${totalColumns} colunas de notas.`);
      return;
    }
  
    const columnsToCheck: Set<string> = new Set();
  
    this.class.alunos.forEach((aluno: any) => {
      // Filtra e ordena as notas válidas em ordem crescente
      const notasOrdenadas = aluno.notas
        .filter((nota: any) => nota.valor !== null && nota.valor !== '')
        .sort((a: any, b: any) => parseFloat(a.valor) - parseFloat(b.valor));
  
      let removedCount = 0;
  
      // Remove as menores notas
      notasOrdenadas.forEach((nota: any) => {
        if (removedCount < notesToRemove) {
          // Encontra a nota correspondente e define o valor como nulo
          const index = aluno.notas.findIndex((n: any) => n.titulo === nota.titulo);
          if (index !== -1) {
            columnsToCheck.add(aluno.notas[index].titulo);
            aluno.notas[index].valor = null;
            removedCount++;
          }
        }
      });
    });
  
    // Verifica e remove colunas onde todas as notas são nulas
    columnsToCheck.forEach((coluna) => {
      const allNull = this.class.alunos.every((aluno: any) =>
        aluno.notas.some(
          (nota: any) => nota.titulo === coluna && (nota.valor === null || nota.valor === '')
        )
      );
  
      if (allNull) {
        this.removeColumn(coluna);
      }
    });
  
    this.refreshTable();
    this.closeDialog();
    alert(`${notesToRemove} notas foram removidas.`);
  }
  
  
  
  
  /**
   * Remove a menor nota válida (primeira encontrada) de cada aluno
   * e remove a coluna correspondente se todas as notas dela forem nulas.
   */
  removeLowestGrade() {
    this.class.alunos.forEach((aluno: any) => {
      let menorNotaIndex = -1;
      let menorNota = Infinity;
  
      aluno.notas.forEach((nota: any, index: number) => {
        if (nota.valor !== null && nota.valor !== '' && parseFloat(nota.valor) < menorNota) {
          menorNota = parseFloat(nota.valor);
          menorNotaIndex = index;
        }
      });
  
      if (menorNotaIndex !== -1) {
        aluno.notas[menorNotaIndex].valor = null; // Remove a menor nota
      }
    });
  
    this.refreshTable();
  }
  


  /**
   * Método do ciclo de vida do Angular que é chamado após a construção do componente.
   * Inicializa as colunas da tabela e atualiza os dados.
   */
  ngOnInit() {
    this.loadPesosFromLocalStorage();
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
  /**
 * Salva o objeto 'pesos' no LocalStorage.
 */
  savePesosToLocalStorage() {
    localStorage.setItem('pesos', JSON.stringify(this.pesos));
  }
  /**
 * Carrega os pesos salvos do LocalStorage, se existirem.
 */
  loadPesosFromLocalStorage() {
    const savedPesos = localStorage.getItem('pesos');
    if (savedPesos) {
      this.pesos = JSON.parse(savedPesos);
      console.log('Pesos carregados do LocalStorage:', this.pesos);
    }
  }

  updatePeso(event: Event, columnName: string) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      const newPeso = parseFloat(inputElement.value);
      if (!isNaN(newPeso) && newPeso > 0) {
        this.pesos[columnName] = newPeso; // Atualiza o peso no objeto 'pesos'
        this.savePesosToLocalStorage();  // Salva os pesos no localStorage
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


  exportReport(type: string) {
    if (type === 'resumido') {
      this.exportCSVResumido();
    } else if (type === 'detalhado') {
      this.exportCSVDetalhado();
    }
  }

  exportCSVResumido() {
    const csvData = this.generateCSVDataResumido();
    const blob = new Blob([csvData], { type: 'text/csv' });
    saveAs(blob, 'relatorio_turma_resumido.csv');
  }

  generateCSVDataResumido(): string {
    let csvData = `Nome da Turma: ${this.class.nome}\n`;
    csvData += 'Matrícula,Nome,Média\n';
    this.class.alunos.forEach((aluno: any) => {
      csvData += `${aluno.matricula},${aluno.nome},${this.media(aluno)}\n`;
    });
    csvData += `,,Média da turma: ${this.calculateClassAverage()}`;
    return csvData;
  }

  calculateClassAverage(): string {
    const totalAlunos = this.class.alunos.length;
    const somaMedias = this.class.alunos.reduce((acc: number, aluno: any) => acc + parseFloat(this.media(aluno)), 0);
    const mediaTurma = totalAlunos > 0 ? somaMedias / totalAlunos : 0;
    return mediaTurma.toFixed(1);
  }

  exportCSVDetalhado() {
    const csvData = this.generateCSVDataDetalhado();
    const blob = new Blob([csvData], { type: 'text/csv' });
    saveAs(blob, 'relatorio_turma_detalhado.csv');
  }

  generateCSVDataDetalhado(): string {
    let csvData = `Nome da Turma: ${this.class.nome}\n`;
    csvData += 'Matrícula,Nome,' + this.notaColumns.join(',') + ',Média\n';
    this.class.alunos.forEach((aluno: any) => {
      const notas = this.notaColumns.map(col => aluno.notas[col] !== undefined ? aluno.notas[col] : '').join(',');
      csvData += `${aluno.matricula},${aluno.nome},${notas},${this.media(aluno)}\n`;
    });
    csvData += `,,,,Média da turma: ${this.calculateClassAverage()}`;
    return csvData;
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
