import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalClassComponent } from './modal-class.component';

describe('ModalClassComponent', () => {
  let component: ModalClassComponent;
  let fixture: ComponentFixture<ModalClassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalClassComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
