import { PropertyRead } from '@angular/compiler';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-pond',
  templateUrl: './pond.component.html',
  styleUrls: ['./pond.component.css'],
})
export class PondComponent implements OnInit, OnChanges {
  @Input() bouyLow: number = 0;
  @Input() bouyMedium: number = 0;
  @Input() bouyHight: number = 0;
  @Input() valve: number = 0;

  private GREEN = '#00ff00';
  private RED = '#ff0000';

  private agua: HTMLElement;
  private grifo: HTMLElement;
  private grifo_agua: HTMLElement;
  private boya_baja: HTMLElement;
  private boya_media: HTMLElement;
  private boya_alta: HTMLElement;

  ngOnInit(): void {
    this.agua = document.getElementById('agua');
    this.grifo = document.getElementById('grifo');
    this.grifo_agua = document.getElementById('grifo_agua');
    this.boya_baja = document.getElementById('boya_baja');
    this.boya_media = document.getElementById('boya_media');
    this.boya_alta = document.getElementById('boya_alta');
    this.checkStatus();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.agua) {
      for (const propName in changes) {
        const changedProp = changes[propName];
        switch (propName) {
          case 'bouyLow':
            this.bouyLow = changedProp.currentValue;
            break;
          case 'bouyMedium':
            this.bouyMedium = changedProp.currentValue;
            break;
          case 'bouyHight':
            this.bouyHight = changedProp.currentValue;
            break;
          case 'valve':
            this.valve = changedProp.currentValue;
            break;
        }
      }
      this.checkStatus();
    }
  }

  private checkStatus() {
    if (this.valve == 1) {
      this.grifo.style.fill = this.GREEN;
      this.grifo_agua.style.display = 'block';
    } else {
      this.grifo.style.fill = this.RED;
      this.grifo_agua.style.display = 'none';
    }
    this.agua.style.height = '22%';
    if (this.bouyLow == 1) {
      this.agua.style.height = '38%';
      this.boya_baja.style.fill = this.GREEN;
    } else {
      this.boya_baja.style.fill = this.RED;
    }
    if (this.bouyMedium == 1) {
      this.agua.style.height = '54%';
      this.boya_media.style.fill = this.GREEN;
    } else {
      this.boya_media.style.fill = this.RED;
    }
    if (this.bouyHight == 1) {
      this.agua.style.height = '70%';
      this.boya_alta.style.fill = this.GREEN;
    } else {
      this.boya_alta.style.fill = this.RED;
    }
  }
}
