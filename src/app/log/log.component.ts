import { Component, OnInit } from '@angular/core';
import { LogService } from './log.service';
/**
 *
 */
@Component({
  selector: 'app-log',
  template: `
  <div class='log'>
    <div *ngFor="let aItem of getItems()">
      {{aItem}}
    </div>
  </div> `,
  styles: [`
    div .log {
      border: 2px solid black
      background-color: lightblue;
      width: 100%;
      height: 300px;
      overflow: auto;
    }
  `]
})
export class LogComponent implements OnInit {

  constructor(private itsLog: LogService) { }

  ngOnInit() {
  }
  /**
   *
   */
  getItems(): string[] {
    return this.itsLog.getItems();
  }

}
