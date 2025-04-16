import { Component, Output, EventEmitter, Input, ViewChild, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import saveAs from 'file-saver';

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
		MatSnackBarModule, 
		MatTooltipModule
	],
	templateUrl: './single-class.component.html',
	styleUrls: ['./single-class.component.scss'],
})

export class SingleClassComponent implements OnInit {

	private classService = inject(ClassService);

	@Input() class!: any;
	@Output() closeClassEvent: EventEmitter<any> = new EventEmitter();
	@Output() closeModalEvent: EventEmitter<any> = new EventEmitter();

	@ViewChild(MatPaginator) paginator!: MatPaginator;

	displayedColumns: string[] = ['nome', 'editar'];
	notaColumns: string[] = [];
	dataSource!: MatTableDataSource<any>;
	pesos: Record<string, number> = {};

	mode: string = 'VIEW';

	constructor(public dialog: MatDialog, private snackBar: MatSnackBar) { }


	/**
   * Recalcula todas as médias após atualizar as notas.
   */
	recalculateAllMedia() {
		this.dataSource.data.forEach((aluno: any) => {
			aluno.media = this.media(aluno);
		});
		this.refreshTable();
	}

	/**
	 * Atualiza os dados no localStorage após qualquer alteração.
	 */
	// TODO: Usa localStorage...???
	updateLocalStorage() {
		localStorage.setItem(`class_${this.class.id}_pesos`, JSON.stringify(this.pesos));
		localStorage.setItem(`class_${this.class.id}_alunos`, JSON.stringify(this.class.alunos));
	}


	removeMultipleColumns(quantity: number) {
		if (quantity < 1) {
			this.snackBar.open('A quantidade de notas a remover deve ser pelo menos 1.', 'Fechar', { duration: 3000 });
			return;
		}

		if (quantity > this.notaColumns.length) {
			this.snackBar.open(`Não é possível remover mais notas do que existem. Total de notas: ${this.notaColumns.length}`, 'Fechar', { duration: 3000 });
			return;
		}

		// Remove as menores notas
		this.class.alunos.forEach((aluno: any) => {
			aluno.notas = aluno.notas
				.sort((a: any, b: any) => parseFloat(a.valor || 0) - parseFloat(b.valor || 0))
				.slice(quantity); // Remove as menores
		});

		// Atualiza colunas e sincroniza dados
		this.notaColumns = this.notaColumns.slice(quantity);
		this.displayedColumns = ['nome', ...this.notaColumns, 'media', 'editar'];
		this.updateLocalStorage();
		this.recalculateAllMedia();
		this.snackBar.open(`${quantity} notas removidas com sucesso!`, 'Fechar', { duration: 3000 });
	}


	/**
	 * Solicita ao usuário a quantidade de notas a serem removidas.
	 */
	promptRemoveColumns() {
		const quantity = parseInt(prompt('Digite a quantidade de notas que deseja remover:') || '0', 10);
		this.removeMultipleColumns(quantity);
	}


	/**
	 * Método do ciclo de vida do Angular que é chamado após a construção do componente.
	 * Inicializa as colunas da tabela e atualiza os dados.
	 */
	ngOnInit() {
		// Recupera pesos do localStorage
		const storedPesos = localStorage.getItem(`class_${this.class.id}_pesos`);
		if (storedPesos) {
			this.pesos = JSON.parse(storedPesos);
		}

		// Recupera alunos do localStorage
		const storedAlunos = localStorage.getItem(`class_${this.class.id}_alunos`);
		if (storedAlunos) {
			this.class.alunos = JSON.parse(storedAlunos);
		}

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
		if (this.class && this.class.alunos) {
			this.class.alunos.sort((a: any, b: any) => a.nome.localeCompare(b.nome));
		}

		this.dataSource = new MatTableDataSource(this.class.alunos);
		this.dataSource.paginator = this.paginator;
		this.updateLocalStorage();
	}


	/**
	 * Obtém os dados da classe do serviço `classService` e atualiza a tabela.
	 */
	getClass(resetPesos: boolean = true) {
		this.classService.get(this.class.id).subscribe((data) => {
			this.class = data;

			if (resetPesos) {
				this.pesos = {};
				this.class.alunos.forEach((aluno: any) => {
					aluno.notas.forEach((nota: any) => {
						this.pesos[nota.titulo] = parseFloat(nota.peso) || 1.0;
					});
				});

				localStorage.setItem(`class_${this.class.id}_pesos`, JSON.stringify(this.pesos));
			}

			this.refreshTable();
		});
	}

	/**
	 * Adiciona uma nova coluna de notas à tabela e atualiza os dados dos alunos para incluir um objeto de nota vazio.
	 */
	addNewColumn() {
		const newColumn = `Nota ${this.notaColumns.length + 1}`;

		this.notaColumns.push(newColumn);

		this.displayedColumns.splice(this.displayedColumns.length - 2, 0, newColumn);

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

			const notaIndex = element.notas.findIndex((nota: any) => nota.titulo === columnName);
			if (notaIndex !== -1) {
				element.notas[notaIndex].valor = value === '' ? null : value;
				this.updateLocalStorage(); // Atualiza localStorage ao alterar a nota
				console.log(`Nota atualizada: ${columnName} = ${value}`);
			}
		}
	}


	updatePeso(event: Event, columnName: string) {
		const inputElement = event.target as HTMLInputElement;
		if (inputElement) {
			const newPeso = parseFloat(inputElement.value);
			if (!isNaN(newPeso) && newPeso > 0) {
				this.pesos[columnName] = newPeso;
				this.updateLocalStorage(); // Atualiza localStorage ao alterar o peso
				console.log(`Peso atualizado para "${columnName}": ${newPeso}`);
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
			this.snackBar.open('Registro deletado', 'Fechar', { duration: 3000 });
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
		this.mode = 'SAVING';

		console.log("Salvando o estado:")
		console.log("datasource", this.dataSource.data)

		const updatedData = this.dataSource.data.map((aluno: any) => ({
			matricula: aluno.matricula,
			notas: aluno.notas.map((nota: any) => ({
				id: nota.id,
				titulo: nota.titulo,
				valor: nota.valor,
				peso: this.pesos[nota.titulo] || 1.0,
			})),
		}));

		this.classService.postNota(this.class.id, updatedData).subscribe({
			next: () => {
				this.updateLocalStorage();
				this.snackBar.open('Notas e pesos atualizados com sucesso!', 'Fechar', { duration: 3000 });
				this.getClass(false);
				this.mode = 'VIEW';
			},
			error: (err) => {
				this.snackBar.open('Erro ao salvar notas. Tente novamente.', 'Fechar', { duration: 3000 });
				console.error(err);
				this.mode = 'EDIT';
			},
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
		csvData += 'Matricula,Nome,Media\n';
		this.class.alunos.forEach((aluno: any) => {
			csvData += `${aluno.matricula},${aluno.nome},${this.media(aluno)}\n`;
		});
		csvData += `,,Media da turma: ${this.calculateClassAverage()}`;
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
		csvData += 'Matricula,Nome,' + this.notaColumns.join(',') + ',Media\n';

		this.class.alunos.forEach((aluno: any) => {
			const notas = this.notaColumns.map(col => {
				const nota = aluno.notas.find((nota: any) => nota.titulo === col);
				return nota ? nota.valor ?? '' : '';
			}).join(',');

			const alunoMedia = parseFloat(this.media(aluno));
			const mediaFormatada = isNaN(alunoMedia) || alunoMedia === 0 ? '' : alunoMedia;
			const media = notas.includes('') ? '' : parseFloat(this.media(aluno));
			csvData += `${aluno.matricula},${aluno.nome},${notas},${mediaFormatada}\n`;
		});

		csvData += `,,,,Media da turma: ${this.calculateClassAverage()}`;
		return csvData;
	}

	/**
	 * Calcula a média ponderada das notas de um aluno.
	 * Ignora valores nulos ou inválidos e retorna a média formatada com uma casa decimal.
	 * @param element Objeto do aluno.
	 * @returns Média ponderada das notas formatada com uma casa decimal.
	 */
	media(element: any): string {
		const notasValidas = element.notas?.filter((nota: any) => {
			const valor = parseFloat(nota.valor);
			const peso = this.pesos[nota.titulo] || 1;
			return !isNaN(valor) && valor !== null && peso > 0;
		});

		if (!notasValidas || notasValidas.length === 0) {
			return "0.0";
		}

		const { somaPonderada, somaPesos } = notasValidas.reduce(
			(acc: { somaPonderada: number; somaPesos: number }, nota: any) => {
				const valorNota = parseFloat(nota.valor);
				const peso = this.pesos[nota.titulo] || 1;
				acc.somaPonderada += valorNota * peso;
				acc.somaPesos += peso;
				return acc;
			},
			{ somaPonderada: 0, somaPesos: 0 }
		);

		const media = somaPesos > 0 ? somaPonderada / somaPesos : 0;
		return media.toFixed(1);
	}

	// Função utilizada no html para checar se há alunos na turma.
	get hasAlunos(): boolean {
		return this.class?.alunos?.length > 0;
	}


}
// ENTENDIMENTOS:
// ! Não há uma verificação que impeça os professor de: Adicionar/Editar Notas, Descartar Menor Nota, Exportar relatório resumido e Exportar relatório detalhado QUANDO NÃO HÁ ALUNOS

// As informações de notas e pesos estão sendo armazenadas no localStorage
// 	class_id_notas
// 	class_id_pesos