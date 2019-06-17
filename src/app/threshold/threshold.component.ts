import { Component, OnInit, OnDestroy } from '@angular/core';
import { LogService } from '../log/log.service';
import { WisardService } from '../wisard/wisard.service';
import { IWObjectRef } from '../wisard/weakref';
import { IThreshold } from '../wisard/interfaces';
//
@Component({
  selector: 'app-threshold',
  template: `
    <br/>
    <h2>Threshold:</h2>
    <br/>

    <p>The 'Threshold' converts a colour image into a binary image.</p>
    <p>The 'Threshold' uses a pre-settable value to determine what brightness
    each pixel will be deemed to be '0' or '1'.</p>
    <p>The 'Threshold' is the same size (in pixels) as the 'View'.</p>
    <p>The 'Threshold' size within the browser is controlled by CSS.</p>
    <p>You can change the threshold value by dragging the slider.</p>
    <p>NB: If you cannot see anything in the 'Threshold' window you may need
    to go back to the 'View' tab and change it's Scale.</p>

    <br/>

    <div class="WBorder0">
      Source<br/>
      <div class="W1Source0 W200 H200"></div>
    </div>

    <div class="WBorder0 W10 H200"></div>

    <div class="WBorder0">
      View<br/>
      <div class="W1View0 W64 H64"></div>
    </div>

    <div class="WBorder0 W10 H200"></div>

    <div class="WBorder0">
      Threshold<br/>
      <div class="W1Threshold0 W200 H200 WBorder1"></div>
      <br/>
      Thresh: <mat-slider [(ngModel)]="itsUIThreshold" min="0" max="100" horizontal (input)="onThresholdChange($event)" ></mat-slider>
      {{thresh}}
    </div>
    <br/>
    <br/>
    `,
  styles: []
})
export class ThresholdComponent implements OnInit, OnDestroy {
  //
  private itsThresholdRef = null;
  itsUIThreshold = 50;
  private itsThreshold = 0.5;
  //

  /**
   *
   */
  constructor(private theLog: LogService, private theWisard: WisardService) {
    this.log('constructor:');
  }
  /**
   *
   */
  ngOnInit() {
    this.log('ngOnInit:');
    //
    this.itsThresholdRef = this.theWisard.findObjectRefByClassIdNameId('W1Threshold0');
    //
    this.loadThreshold();
  }
  /**
   *
   */
  ngOnDestroy() {
    this.log('ngOnDestroy:');
    this.itsThresholdRef = null;
  }
  /**
   *
   */
  private getObject(theRef: IWObjectRef): any {
    let aObject = null;
    if (theRef !== null) {
      aObject = theRef.getRef();
    }
    return aObject;
  }
  /**
   *
   */
  private getThresholdObject(): IThreshold {
    return this.getObject(this.itsThresholdRef);
  }
  // ----Threshold----
  /**
   * Respond to changes of threshold.
   */
  onThresholdChange(theEvent: any) {
    const aThreshold = this.getThresholdObject();
    if (aThreshold === null) { return; }
    this.itsUIThreshold = theEvent.value;
    this.itsThreshold = this.itsUIThreshold * 0.01;
    aThreshold.setThresh(this.itsThreshold);
  }
  /**
   * Copy objects threshold into the UI.
   */
  loadThreshold() {
    const aThreshold = this.getThresholdObject();
    if (aThreshold === null) { return; }
    this.itsThreshold = aThreshold.getThresh();
    this.itsUIThreshold = this.itsThreshold * 100.0;
  }
  /**
   *
   */
  get thresh(): string {
    return this.itsThreshold.toFixed(2);
  }
  // ----
  /**
   *
   */
  log(theMessage: string) {
    this.theLog.add('Threshold:' + theMessage);
  }
  //
}
