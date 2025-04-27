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

	dataSource!: MatTableDataSource<any>;

	pesos: Record<string, number> = {};
	notaColumns: string[] = [];
	displayedColumns: string[] = ['nome', 'editar'];
	toDelete: string[] = [];

	private checkpoint: {
		class: any;
		pesos: Record<string, number>;
		notaColumns: string[];
		displayedColumns: string[];
	} | null = null;


	mode: string = 'VIEW';

	constructor(public dialog: MatDialog, private snackBar: MatSnackBar) { }

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

			this.notaColumns = this.class.alunos[0].notas.map((nota: any) => nota.titulo);

			this.displayedColumns = ['nome', ...this.notaColumns, 'media', 'editar'];

			this.class.alunos[0].notas.forEach((nota: { titulo: string | number; peso: number; }) => {
				this.pesos[nota.titulo] = nota.peso
			});
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

	}

	/**
   * Recalcula todas as médias após atualizar as notas.
   */
	recalculateAllMedia() {
		this.dataSource.data.forEach((aluno: any) => { aluno.media = this.media(aluno); });
		this.refreshTable();
	}

	/**
	 * Atualiza os dados no localStorage após qualquer alteração.
	 */
	updateLocalStorage() {
		localStorage.setItem(`class_${this.class.id}_pesos`, JSON.stringify(this.pesos));
		localStorage.setItem(`class_${this.class.id}_alunos`, JSON.stringify(this.class.alunos));
	}

	/**
	 * Solicita ao usuário a quantidade de notas a serem removidas.
	 */
	promptRemoveColumns() {
		const quantity = parseInt(prompt('Digite a quantidade de notas que deseja remover:') || '0', 10);
		this.removeMultipleColumns(quantity);
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
						this.pesos[nota.titulo] = parseInt(nota.peso) || 1.0;
					});
				});

			}

			this.refreshTable();
		});
	}

	/**
	 * Adiciona uma nova coluna de notas à tabela e atualiza os dados dos alunos para incluir um objeto de nota vazio.
	 */
	addNewColumn() {
		const newColumn = `Nota ${this.notaColumns.length + 1}`;

		let columnExists = this.notaColumns.some(Column => Column === newColumn);

		if (!columnExists) {

			this.notaColumns.push(newColumn);

			// Add uma nova 'coluna' em this.displayedColumns.length - 2
			this.displayedColumns.splice(this.displayedColumns.length - 2, 0, newColumn);

			// Define o peso inicial como 1
			this.pesos[newColumn] = 1;

			this.dataSource.data.forEach((aluno: any) => {
				aluno.notas.push({ titulo: newColumn, valor: null, peso: this.pesos[newColumn] });
			});
		} else {
			this.snackBar.open(`Renomeie o titulo "${newColumn}" para adicionar uma nova nota.`, 'Fechar', { duration: 7000 });
		}

		this.refreshTable();
	}

	/**
	 * Remove do dado centralizado (data_source?) uma coluna de notas (e peso) com base no nome. Após isso, fica a mercer do botão 'Salvar' para enviar os dados ao backend.
	 * @param name Nome da coluna a ser removida.
	 */
	removeColumn(name: string) {

		// Devo ajustar a variável data_source (acho) e remover a coluna X (ref a nota que quero remover) de TODOS os alunos e seus respectivos PESOS


		// ! Como essa função não deveria fazer isso, ela está temporáriamente inutilizada
		// const data = { titulo: name };

		// Coleta e remove o indice da coluna
		const index = this.notaColumns.indexOf(name);
		if (index !== -1) {
			this.notaColumns.splice(index, 1);
		}

		// Remove a coluna da lista de colunas exibidas
		const colIndex = this.displayedColumns.indexOf(name);
		if (colIndex !== -1) {
			this.displayedColumns.splice(colIndex, 1);
		}

		// Remove a coluna da info de pesos
		delete this.pesos[name];

		// Remove a prova de cada aluno
		this.dataSource.data.forEach((aluno: any) => {
			console.log("Aluno", aluno);
			aluno.notas = aluno.notas.filter((prova: { titulo: string; }) => prova.titulo !== name);
		});

		// Adiciona o nome da coluna removida na lista de colunas a serem deletadas
		this.toDelete.push(name);

		this.print_status();


		// ! ISSO ESTÁ ERRADO!!!!!!!
		// this.classService.postNota(this.class.id, data).subscribe(() => {
		// 	this.closeModal();
		// 	this.getClass();
		// });
	}

	/**
	 * Atualiza o nome da coluna com base na entrada do usuário.
	 * @param event Evento de alteração do input.
	 * @param columnIndex Índice da coluna a ser atualizada.
	 */
	updateColumnName(event: any, columnIndex: any) {

		const oldName = this.notaColumns[columnIndex];
		const newName = event.target.value.trim();

		// Se o novo nome for vazio, restaura o valor antigo
		if (!newName) { event.target.value = oldName; return; }

		// Checar se já existe alguma coluna com newName, se existe, cancela tudo e avisa o usuário
		const columnExists = this.notaColumns.some((column: string) => column === newName);
		if (!columnExists) {

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

			let temp_peso = this.pesos[oldName];
			delete this.pesos[oldName]
			this.pesos[newName] = temp_peso;


		} else {
			this.snackBar.open(`Já existe uma coluna com o nome "${newName}".`, 'Fechar', { duration: 5000 });
			event.target.value = oldName; // Restaura o valor antigo
		}

		// Atualiza a tabela para refletir as mudanças
		this.refreshTable();
	}


	/**
	 * Atualiza o valor da nota para um aluno em uma posição específica com base na entrada do usuário.
	 * @param event Evento de alteração do input.
	 * @param aluno Objeto do aluno.
	 * @param columnName Nome da coluna da nota a ser atualizada.
	 */
	updateNota(event: Event, aluno: any, columnName: string) {
		const inputElement = event.target as HTMLInputElement;

		if (inputElement) {
			const value = inputElement.value;

			const notaIndex = aluno.notas.findIndex((nota: any) => nota.titulo === columnName);

			if (notaIndex !== -1) {

				aluno.notas[notaIndex].valor = value === '' ? null : value;
				// console.log(`Nota atualizada: ${aluno.nome} - ${columnName} = ${value}`);
			}
		}
	}


	updatePeso(event: Event, columnName: string) {
		const inputElement = event.target as HTMLInputElement;
		if (inputElement) {
			const newPeso = parseFloat(inputElement.value);
			if (!isNaN(newPeso) && newPeso > 0) {
				this.pesos[columnName] = newPeso;
				// console.log(`Peso atualizado para "${columnName}": ${newPeso}`);
			}
		}
	}

	/**
	 * Altera o modo do componente (por exemplo, `VIEW` ou `EDIT`).
	 * @param mode Novo modo para o componente.
	 */
	changeMode(mode: string) {

		if (mode === 'EDIT') {
			// Define um ponto de verificação para restaurar os dados se necessário
			this.checkpoint = {
				class: JSON.parse(JSON.stringify(this.class)),
				pesos: JSON.parse(JSON.stringify(this.pesos)),
				notaColumns: [...this.notaColumns],
				displayedColumns: [...this.displayedColumns],
			};
			this.toDelete = [];
		}

		if (mode === 'VIEW' && this.checkpoint) {
			this.class = JSON.parse(JSON.stringify(this.checkpoint.class));
			this.pesos = JSON.parse(JSON.stringify(this.checkpoint.pesos));
			this.notaColumns = [...this.checkpoint.notaColumns];
			this.displayedColumns = [...this.checkpoint.displayedColumns];
			this.toDelete = [];

			// Atualiza dataSource com os dados restaurados
			this.dataSource = new MatTableDataSource(this.class.alunos);
			this.dataSource.paginator = this.paginator;

			this.checkpoint = null;
		}

		this.mode = mode;
	}

	/**
	 * Deleta um aluno com base na matrícula fornecida e atualiza a visualização.
	 * @param matricula Matrícula do aluno a ser removido.
	 */
	deleteStudent(matricula: any) {
		const data = { removerMatricula: matricula };
		this.classService.put(this.class.id, data).subscribe(() => {
			this.snackBar.open('Aluno removido da Turma', 'Fechar', { duration: 3000 });
			this.getClass();
			this.closeModal();
		});
	}

	/**
	 * Salva as notas atualizadas no backend e muda o modo para `VIEW`.
	 */
	save() {
		this.mode = 'SAVING';
		this.print_status();
		const updatedData = this.dataSource.data.map((aluno: any) => ({
			matricula: aluno.matricula,
			nome: aluno.nome,
			notas: aluno.notas.map((nota: any) => ({
				// Id tem a caracteristica de um campo opcional, se o id existir, sobreescreve as info. 
				// Se for undefined, é uma nova nota a se registrar no bd
				id: nota.id,

				titulo: nota.titulo,
				valor: nota.valor,
				peso: this.pesos[nota.titulo] || 1.0,
			})),
		}));

		console.log("Dados pos-tratamento", updatedData);


		// Remove as notas deletadas
		if (this.toDelete.length > 0) {

			// Pode ser melhorado...
			this.classService.deleteNota(this.class.id, this.toDelete).subscribe();
		}

		// TODO: Ideia: Quero que caso a operação de deletar notas falhe não haja post de notas..

		this.classService.postNota(this.class.id, updatedData).subscribe({
			next: () => {
				this.snackBar.open('Notas e pesos atualizados com sucesso!', 'Fechar', { duration: 3000 });
				this.checkpoint = null;
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


	// Função utilizada no html para checar se há alunos na turma.
	get hasAlunos(): boolean {
		return this.class?.alunos?.length > 0;
	}

	// -----------------------------------------------------------------------------------------------
	// -------------------------------- Seção para emissão de relatórios -----------------------------
	// -----------------------------------------------------------------------------------------------

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


	// -----------------------------------------------------------------------------------------------
	// --------------------------------- FIM DA SEÇÃO DE RELATÓRIOS ----------------------------------
	// -----------------------------------------------------------------------------------------------


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
		this.recalculateAllMedia();
		this.snackBar.open(`${quantity} notas removidas com sucesso!`, 'Fechar', { duration: 3000 });
	}

	print_status() {
		console.log("Classe", this.class);
		console.log("Displayed columns:", this.displayedColumns);
		console.log("notaColumns:", this.notaColumns);
		console.log("Pesos:", this.pesos);
		console.log("Data_source", this.dataSource.data);
	}
}