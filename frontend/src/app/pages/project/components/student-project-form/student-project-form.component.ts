import {
	Component,
	EventEmitter,
	inject,
	Input,
	Output,
	SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { StudentService } from '../../../../services/student/student.service';

@Component({
	selector: 'app-student-project-form',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
	],
	templateUrl: './student-project-form.component.html',
	styleUrls: ['./student-project-form.component.scss'],
})

export class StudentProjectFormComponent {
	private studentService = inject(StudentService);

	@Input() project: any;
	@Output() formProject: EventEmitter<any> = new EventEmitter();

	constructor(private fb: FormBuilder) { }
	students: any;
	form: FormGroup = this.fb.group({
		matricula: [''],
		remove: false
	});

	ngOnChanges(changes: SimpleChanges) {
		if (changes['project'] && this.project) {
			// Aguarda o Angular terminar o ciclo de renderização antes de chamar getStudents
			setTimeout(() => {
				this.getStudents();
			});
		}
	}

	/**
	 * Busca a lista de estudantes e ajusta a lógica com base nos dados de projetos.
	 */
	getStudents() {
		this.studentService.get().subscribe((data) => {
			// Info do projeto (id, nome, descricao, alunos[], ...)
			const alunosProjeto = this.project?.alunos ?? [];

			console.log('Alunos do Projeto:', alunosProjeto);

			// Dados de TODOS OS ALUNOS
			console.log("Todos os alunos", data);

			this.students = data.filter(
				(alunoData: { nome: any; matricula: any }) =>
					!alunosProjeto.some(
						(alunoProjeto: { nome: any; matricula: any }) =>
							alunoData.matricula === alunoProjeto.matricula &&
							alunoData.nome === alunoProjeto.nome
					)
			);

			// Ordenar a exibição ??
			// this.students.sort((a: any, b: any) => a.nome.localeCompare(b.nome));

			console.log("Alunos disponíveis:", this.students);
		});
	}

	/**
	 * Emite os dados do formulário. Dependendo do modo, pode emitir dados para adicionar ou editar uma classe.
	 */
	save() {
		this.formProject.emit(this.form.value);
	}
}
