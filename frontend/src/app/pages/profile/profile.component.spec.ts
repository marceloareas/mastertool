import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let mockAuthService: jasmine.SpyObj<AuthenticationService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthenticationService', ['getToken']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        ProfileComponent,
        MatSidenavModule,
        MatIconModule,
        MatButtonModule,
        RouterTestingModule
      ],
      providers: [
        { provide: AuthenticationService, useValue: mockAuthService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: MatSnackBar, useValue: mockSnackBar }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user data on init', () => {
    const mockToken = 'mock.token.here';
    const mockPayload = { username: 'test@example.com' };
    spyOn(window, 'atob').and.returnValue(JSON.stringify(mockPayload));
    mockAuthService.getToken.and.returnValue(mockToken);

    component.ngOnInit();

    expect(component.userEmail).toBe(mockPayload.username);
  });

  it('should open change password dialog', () => {
    component.userEmail = 'test@example.com';
    mockDialog.open.and.returnValue({ afterClosed: () => of(null) } as any);

    component.openChangePasswordDialog();

    expect(mockDialog.open).toHaveBeenCalled();
  });
});