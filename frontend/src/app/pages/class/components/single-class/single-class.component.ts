import { Component, Output, EventEmitter, Input, ViewChild, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ModalClassComponent } from '../modal-class/modal-class.component';
import { MatMenuModule } from '@angular/material/menu';
import { StudentClassModalComponent } from '../student-class-modal/student-class-modal.component';
import { ClassService } from '../../../../services/class/class.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import saveAs from 'file-saver';

interface Note {
  id?: number;
  title: string;
  value: number | null;
  weight: number;
}

interface Student {
  matricula: string;
  nome: string;
  notas: Note[];
  media: number | undefined;
}

interface ProcessedNote {
  value: number;
  weight: number;
  title: string;
  isDiscarded?: boolean;
}


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
    MatTooltipModule,
    MatCheckboxModule,
    MatDialogModule
  ],
  templateUrl: './single-class.component.html',
  styleUrls: ['./single-class.component.scss'],
})
export class SingleClassComponent implements OnInit {
  private classService = inject(ClassService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  @Input() set class(value: any) {
    this._class = value;
    this.loadClassData();
  }
  get class(): any {
    return this._class;
  }
  private _class: any;

  @Output() closeClassEvent = new EventEmitter();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource = new MatTableDataSource<Student>([]);
  noteColumns: string[] = [];
  displayedColumns: string[] = ['nome'];
  discardLowestNote = false;
  isEditMode = false;
  originalState: any;

  ngOnInit() {
    this.loadClassData();
  }

  loadClassData() {
    if (this.class?.id) {
      this.classService.get(this.class.id).subscribe({
        next: (data) => {
          this._class = data;
          this.initializeTable();
        },
        error: (err) => {
          this.snackBar.open('Erro ao carregar dados da turma', 'Fechar', { duration: 3000 });
          console.error(err);
        }
      });
    } else if (this.class?.alunos) {
      this.initializeTable();
    }
  }

  initializeTable() {
    if (this.class?.alunos?.length) {
      // Get unique note titles (only N1-N4)
      const allowedNotes = ['N1', 'N2', 'N3', 'N4'];
      this.noteColumns = allowedNotes.filter(note =>
        this.class.alunos.some((aluno: any) =>
          aluno.notas?.some((n: any) => n.titulo === note)
        )
      );

      // Format students data
      const students: Student[] = this.class.alunos.map((aluno: any) => {
        const notes: Note[] = this.noteColumns.map(title => {
          const existingNote = aluno.notas?.find((n: any) => n.titulo === title);
          return {
            id: existingNote?.id,
            title,
            value: existingNote?.valor !== null && existingNote?.valor !== undefined
              ? parseFloat(existingNote.valor)
              : null,
            weight: existingNote?.peso ?? 1
          };
        });

        return {
          matricula: aluno.matricula,
          nome: aluno.nome,
          notas: notes,
          media: this.calculateStudentMedia(notes)
        };
      });

      this.dataSource.data = students;
      this.displayedColumns = ['nome', ...this.noteColumns, 'media', 'editar'];
    } else {
      this.dataSource.data = [];
      this.noteColumns = [];
      this.displayedColumns = ['nome'];
    }

    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }


  toggleEditMode() {
    if (this.isEditMode) {
      // Cancel editing - restore original state
      this.loadClassData();
    } else {
      // Start editing - save original state
      this.originalState = JSON.parse(JSON.stringify({
        noteColumns: [...this.noteColumns],
        data: [...this.dataSource.data]
      }));
    }
    this.isEditMode = !this.isEditMode;
  }

  addNewNoteColumn() {
    const newIndex = this.noteColumns.length + 1;
    const newTitle = `N${newIndex}`;

    if (this.noteColumns.includes(newTitle)) {
      this.snackBar.open('Já existe uma nota com este nome', 'Fechar', { duration: 3000 });
      return;
    }

    this.noteColumns.push(newTitle);
    this.displayedColumns = ['nome', ...this.noteColumns, 'media', 'editar'];

    // Add the new note to all students
    this.dataSource.data = this.dataSource.data.map(student => ({
      ...student,
      notas: [...student.notas, { title: newTitle, value: null, weight: 1 }],
      media: this.calculateStudentMedia([...student.notas, { title: newTitle, value: null, weight: 1 }])
    }));
  }

  removeNoteColumn(title: string) {
    const index = this.noteColumns.indexOf(title);
    if (index > -1) {
      this.noteColumns.splice(index, 1);
      this.displayedColumns = ['nome', ...this.noteColumns, 'media', 'editar'];

      // Remove the note from all students
      this.dataSource.data = this.dataSource.data.map(student => ({
        ...student,
        notas: student.notas.filter(note => note.title !== title),
        media: this.calculateStudentMedia(student.notas.filter(note => note.title !== title))
      }));
    }
  }

  getNoteValue(student: Student, noteTitle: string): number | null {
    const note = student.notas.find(n => n.title === noteTitle);
    return note ? note.value : null;
  }

  getNoteWeight(noteTitle: string): number {
    const student = this.dataSource.data[0];
    if (!student) return 1;
    const note = student.notas.find(n => n.title === noteTitle);
    return note ? note.weight : 1;
  }



  updateNoteWeight(event: Event, noteTitle: string) {
    const input = event.target as HTMLInputElement;
    const weight = input.value ? parseFloat(input.value) : 1;

    this.dataSource.data = this.dataSource.data.map(student => {
      const updatedNotes = student.notas.map(note =>
        note.title === noteTitle ? { ...note, weight } : note
      );
      return {
        ...student,
        notas: updatedNotes,
        media: this.calculateStudentMedia(updatedNotes)
      };
    });
  }

calculateStudentMedia(notes: Note[]): number {
  // Filter valid notes (not null and not NaN)
  let validNotes: ProcessedNote[] = notes
    .filter(note => note.value !== null && !isNaN(note.value))
    .map(note => ({
      value: note.value as number,
      weight: note.weight,
      title: note.title
    }));

  // Find and discard the lowest note if enabled
  if (this.discardLowestNote && validNotes.length > 1) {
    const minValue = Math.min(...validNotes.map(n => n.value));
    
    // Find all notes with minimum value
    const minNotes = validNotes.filter(n => n.value === minValue);
    
    // If there are multiple notes with same minimum value, discard only one
    if (minNotes.length > 1) {
      // Mark the first occurrence as discarded
      let discarded = false;
      validNotes = validNotes.map(note => {
        if (!discarded && note.value === minValue) {
          discarded = true;
          return { ...note, isDiscarded: true };
        }
        return note;
      });
    } else {
      // Only one minimum note, mark it as discarded
      validNotes = validNotes.map(note => ({
        ...note,
        isDiscarded: note.value === minValue
      }));
    }
  }

  // Filter out discarded notes
  const notesForCalculation = validNotes.filter(note => !note.isDiscarded);

  if (notesForCalculation.length === 0) return 0;

  const totalWeight = notesForCalculation.reduce((sum, note) => sum + note.weight, 0);
  const weightedSum = notesForCalculation.reduce((sum, note) => sum + (note.value * note.weight), 0);

  return parseFloat((weightedSum / totalWeight).toFixed(2));
}

isDiscardedNote(student: Student, noteTitle: string): boolean {
  if (!this.discardLowestNote || student.notas.length < 2) return false;

  const validNotes = student.notas
    .filter(note => note.value !== null && !isNaN(note.value as number));

  if (validNotes.length < 2) return false;

  const minValue = Math.min(...validNotes.map(note => note.value as number));
  const note = student.notas.find(n => n.title === noteTitle);

  // Check if this is the first occurrence of the lowest note
  if (note?.value === minValue) {
    const firstMinNoteIndex = student.notas.findIndex(n => 
      n.value !== null && !isNaN(n.value as number) && n.value === minValue
    );
    return student.notas.findIndex(n => n.title === noteTitle) === firstMinNoteIndex;
  }

  return false;
}

updateNoteValue(event: Event, student: Student, noteTitle: string) {
  const input = event.target as HTMLInputElement;
  const value = input.value !== '' ? parseFloat(input.value) : null;
  
  this.dataSource.data = this.dataSource.data.map(s => {
    if (s.matricula === student.matricula) {
      const updatedNotes = s.notas.map(note => 
        note.title === noteTitle ? { ...note, value } : note
      );
      return {
        ...s,
        notas: updatedNotes,
        media: this.calculateStudentMedia(updatedNotes)
      };
    }
    return s;
  });
}

saveChanges() {
  const studentsToUpdate = this.dataSource.data.map(student => ({
    matricula: student.matricula,
    nome: student.nome,
    notas: student.notas.map(note => ({
      id: note.id, // Inclua o ID da nota se existir
      titulo: note.title,
      valor: note.value,
      peso: note.weight
    }))
  }));

  this.classService.postNota(this.class.id, studentsToUpdate).subscribe({
    next: () => {
      this.snackBar.open('Notas salvas com sucesso!', 'Fechar', { duration: 3000 });
      this.isEditMode = false;
      this.loadClassData();
    },
    error: (err) => {
      this.snackBar.open('Erro ao salvar notas', 'Fechar', { duration: 3000 });
      console.error(err);
    }
  });
}

  toggleDiscardLowestNote() {
    this.dataSource.data = this.dataSource.data.map(student => ({
      ...student,
      media: this.calculateStudentMedia(student.notas)
    }));
  }

  exportReport(type: 'resumido' | 'detalhado') {
    if (type === 'resumido') {
      this.exportCSVResumido();
    } else {
      this.exportCSVDetalhado();
    }
  }

	private exportCSVResumido() {
		let csv = `Turma: ${this.class.nome},Menor Nota Descartada: ${this.discardLowestNote ? 'Sim' : 'Não'}`;
		csv += `\n`;
		csv += `Matricula,Nome,Media\n`;

		let sum = 0;
		let totalAlunos = 0;

		this.dataSource.data.forEach(student => {
			csv += `${student.matricula},${student.nome},${student.media}\n`;
			if (student.media !== undefined) {
				sum += student.media;
				totalAlunos++;
			}
		});

		const mediaGeral = totalAlunos > 0 ? (sum / totalAlunos).toFixed(2) : 0;
		csv += `Médias:,,${mediaGeral}\n`;

		const filename = `${this.class.periodo}_${this.class.nome.split(' ').join('_')}_relatorio_notas_resumido.csv`;
		this.downloadCSV(csv, filename);
	}

	private exportCSVDetalhado() {
		let csv = `Turma: ${this.class.nome},Menor Nota Descartada: ${this.discardLowestNote ? 'Sim' : 'Não'}`;
		csv += `\n`;
		csv += `Matricula,Nome,${this.noteColumns.join(',')},Media\n`;

		// Para cada estudante
		this.dataSource.data.forEach(student => {

			// Array de notas do estudante
			const notes = this.noteColumns.map(title => {
				const note = student.notas.find(n => n.title === title);
				return note?.value ?? '';
			}).join(',');

			csv += `${student.matricula},${student.nome},${notes},${student.media}\n`;
		});

		let sum = this.dataSource.data.reduce((sum, student) => sum + (student.media ?? 0), 0);
		let totalAlunos = this.dataSource.data.filter(student => student.media !== undefined).length;

		const averageRow: any[] = [];
		const averages = this.noteColumns.reduce((acc, title) => ({ ...acc, [title]: [] }), {} as { [key: string]: number[] });
		
		this.dataSource.data.forEach(student => {
			student.notas.forEach(note => {
				if (averages[note.title] !== null) {
					averages[note.title].push(note.value as number);
				}
			});
		});

		this.noteColumns.forEach(title => {
			const values = averages[title];
			// Seleciona apenas notas que estão preenchidas
			const validValues = values.filter(value => value !== null && !isNaN(value));
			const average = validValues.length > 0 ? (validValues.reduce((a, b) => a + b) / validValues.length).toFixed(2): '';
			averageRow.push(average);
		});
		// Adiciona a linha de médias
		csv += `Médias:,,${averageRow.join(',')},${(sum/totalAlunos).toFixed(2)}\n`;

		const filename = `${this.class.periodo}_${this.class.nome.split(' ').join('_')}_relatorio_notas_detalhado.csv`;
		this.downloadCSV(csv, filename);

	}

  private downloadCSV(data: string, filename: string) {
    const blob = new Blob([data], { type: 'text/csv' });
    saveAs(blob, filename);
  }

  deleteStudent(matricula: string) {
    this.classService.put(this.class.id, { removerMatricula: matricula }).subscribe(() => {
      this.snackBar.open('Aluno removido', 'Fechar', { duration: 3000 });
      this.loadClassData();
    });
  }

  openModalStudent() {
    this.dialog.open(StudentClassModalComponent, {
      data: { class: this.class }
    }).afterClosed().subscribe(() => this.loadClassData());
  }

  openModalClass(mode: 'EDIT' | 'ADD' = 'EDIT') {
    this.dialog.open(ModalClassComponent, {
      data: { singleClass: this.class, mode },
      width: '600px'
    }).afterClosed().subscribe(() => this.loadClassData());
  }

  get hasStudents(): boolean {
    return this.dataSource.data?.length > 0;
  }
}