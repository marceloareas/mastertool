import { Component, Output, EventEmitter, Input } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Class } from '../../class.interface';

@Component({
  selector: 'app-single-class',
  standalone: true,
  imports: [MatIcon, MatButtonModule],
  templateUrl: './single-class.component.html',
  styleUrl: './single-class.component.scss',
})
export class SingleClassComponent {
  @Input() class!: Class;
  @Output() closeClassEvent: EventEmitter<any> = new EventEmitter();

  closeClass() {
    this.closeClassEvent.emit();
  }
}
