import { Component, Output, EventEmitter, Input, ViewChild, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../../../services/project/project.service';
import { ModalProjectComponent } from '../modal-project/modal-project.component';
import { StudentProjectModalComponent } from '../student-project-modal/student-project-modal.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // Importando MatSnackBar

@Component({
	selector: 'app-single-project',
	standalone: true,
	imports: [
		MatIcon,
		MatButtonModule,
		MatTableModule,
		MatPaginatorModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		FormsModule,
		CommonModule,
		MatMenuModule,
		MatSnackBarModule, // Importando MatSnackBarModule
	],
	templateUrl: './single-project.component.html',
	styleUrls: ['./single-project.component.scss'],
})

export class SingleProjectComponent implements OnInit {
	private projectService = inject(ProjectService);
	private snackBar = inject(MatSnackBar);  // Injetando MatSnackBar

	@Output() closeProjectEvent: EventEmitter<any> = new EventEmitter();
	@Output() closeModalEvent: EventEmitter<any> = new EventEmitter();
	@Input() project!: any;

	@ViewChild(MatPaginator) paginator!: MatPaginator;

	displayedColumns: string[] = ['nome', 'editar'];
	dataSource!: MatTableDataSource<any>;

	mode: string = 'VIEW';

	constructor(public dialog: MatDialog) { }

	ngOnInit() {
		this.refreshTable();
		this.evaluateStatus();
	}

	ngOnChanges() {
		this.evaluateStatus();
	}

	/**
	 * Atualiza os dados na tabela.
	 */
	refreshTable() {
		this.dataSource = new MatTableDataSource(this.project.turma);
		this.dataSource.paginator = this.paginator;
		// console.log('data', this.dataSource.data);
	}

	/**
	 * Obtém os detalhes do projeto do serviço e atualiza a tabela.
	 */
	getProject() {
		this.projectService.get(this.project.id).subscribe((data) => {
			this.project = data;
			this.refreshTable();
			this.evaluateStatus();
		});
	}

	/**
	 * Abre um modal para adicionar ou editar um projeto.
	 * Após o fechamento, atualiza os dados do projeto.
	 *  @param singleProject Objeto do projeto.
	 * @param mode Modo de operação do modal ('ADD' ou 'EDIT').
	 */
	openModalProject(singleProject?: any, mode = 'ADD') {
		this.dialog
			.open(ModalProjectComponent, {
				data: { singleProject, mode },
				width: '600px',
			})
			.afterClosed()
			.subscribe(() => {
				this.getProject();
				this.closeModal();
			});
	}

	/**
	 * Deleta um projeto e emite um evento para fechar a visualização.
	 */
	deleteProject() {
		this.projectService.delete(this.project.id).subscribe(() => {
			this.snackBar.open('Projeto deletado com sucesso!', 'Fechar', {
				duration: 5000,
			});
			this.closeProject();
		});
	}

	/**
	 * Salva as alterações no projeto e muda o modo para `VIEW`.
	 */
	save() {
		this.mode = 'VIEW';
		this.projectService.put(this.project.id, this.project).subscribe(() => {
			this.snackBar.open('Projeto atualizado com sucesso!', 'Fechar', {
				duration: 5000,
			});
			this.getProject();
		});
	}

	/**
	 * Altera o modo do componente (por exemplo, `VIEW` ou `EDIT`).
	 * @param mode Novo modo para o componente.
	 */
	changeMode(mode: string) {
		this.mode = mode;
	}

	/**
	 * Emite um evento para fechar a visualização do projeto.
	 */
	closeProject() {
		this.closeProjectEvent.emit();
	}

	/**
	 * Emite um evento para fechar o modal aberto.
	 */
	closeModal() {
		this.closeModalEvent.emit();
	}

	/**
	 * Abre um modal para adicionar um novo aluno ao projeto. Após o fechamento do modal, atualiza os dados do projeto.
	 */
	openModalStudent() {
		this.dialog
			.open(StudentProjectModalComponent, {
				data: { project: this.project },
			})
			.afterClosed()
			.subscribe(() => {
				this.getProject();
				this.closeModal();
			});
	}

	/**
	 * Lógica para avaliação de status do projeto.
	 */
	evaluateStatus() {
		const today = new Date();
		const dataInicio = this.project?.data_inicio ? new Date(this.project.data_inicio) : null;
		const dataFim = this.project?.data_fim ? new Date(this.project.data_fim) : null;

		if (dataInicio && dataInicio > today) {
			this.project.status = 'A INICIAR';
		} else if (dataFim && dataFim <= today) {
			this.project.status = 'CONCLUÍDO';
		} else {
			this.project.status = 'ANDAMENTO';
		}
	}

	status(element: any): string {
		return element.status || 'INDEFINIDO';
	}

	/**
	 * Deleta um aluno com base na matrícula fornecida e atualiza a visualização.
	 * @param matriculaAluno Matrícula do aluno a ser removido.
	 */
	deleteStudent(matriculaAluno: any) {
		const data = { matricula: matriculaAluno, remove: true };
		this.projectService.put(this.project.id, data).subscribe(() => {
			this.snackBar.open('Registro deletado', 'Fechar', {
				duration: 5000,
			});
			this.getProject();
			this.closeModal();
		});
	}
}
