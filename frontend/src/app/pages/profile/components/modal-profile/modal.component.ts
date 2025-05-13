import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../../../../services/authentication/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
    selector: 'app-change-password-dialog',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        CommonModule,
        MatDialogModule
    ],
    template: `
    <h2 mat-dialog-title>Alterar Senha</h2>
    <mat-dialog-content>
      <form [formGroup]="changePasswordForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Senha Atual</mat-label>
          <input matInput type="password" formControlName="currentPassword" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nova Senha</mat-label>
          <input matInput type="password" formControlName="newPassword" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Confirmar Nova Senha</mat-label>
          <input matInput type="password" formControlName="confirmPassword" required>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" 
              (click)="onSubmit()" 
              [disabled]="!changePasswordForm.valid">
        Salvar
      </button>
    </mat-dialog-actions>
  `,
    styles: [`
    .full-width {
  width: 100%;
  margin-bottom: 16px;

  ::ng-deep .mat-form-field-wrapper {
    padding-bottom: 1.5em; // aumenta espaço para label e erro
  }

  ::ng-deep .mat-form-field-label {
    top: 1.6em !important; // ajusta o posicionamento da label
  }
}

  `]
})
export class ChangePasswordDialogComponent {
    changePasswordForm: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { email: string },
        private fb: FormBuilder,
        private authService: AuthenticationService,
        private snackBar: MatSnackBar
    ) {
        this.changePasswordForm = this.fb.group({
            currentPassword: ['', Validators.required],
            newPassword: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required]
        }, { validator: this.passwordMatchValidator });
    }

    passwordMatchValidator(form: FormGroup) {
        return form.get('newPassword')?.value === form.get('confirmPassword')?.value
            ? null : { mismatch: true };
    }

    onCancel(): void {
        this.dialogRef.close();
    }

    onSubmit(): void {
        if (this.changePasswordForm.valid) {
            const payload = {
                currentPassword: this.changePasswordForm.value.currentPassword,
                newPassword: this.changePasswordForm.value.newPassword,
                confirmPassword: this.changePasswordForm.value.confirmPassword
            };

            this.authService.changePassword(payload).subscribe({
                next: () => {
                    this.snackBar.open('Senha alterada com sucesso!', 'Fechar', { duration: 3000 });
                    this.dialogRef.close('success');
                },
                error: (err) => {
                    this.snackBar.open('Erro ao alterar senha: ' + err.message, 'Fechar', { duration: 3000 });
                }
            });
        }
    }
}