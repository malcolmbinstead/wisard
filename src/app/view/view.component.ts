//
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LogService } from '../log/log.service';
import { WisardService } from '../wisard/wisard.service';
import { IWObjectRef } from '../wisard/weakref';
import { ISource, IView } from '../wisard/interfaces';
//
@Component({
  selector: 'app-view',
  template: `
    <br/>
    <h2>View:</h2>
    <br/>

    <p>The 'View' creates a window of the 'Source' that can be moved, scaled or rotated.</p>
    <p>The 'View' size (in pixels) is configured when the pipeline is created.</p>
    <p>The 'View' size within the browser is controlled by CSS.</p>
    <p>You can move the 'View' by clicking/dragging the mouse within the 'Source'.</p>
    <p>You can move the 'View' by clicking the up/down/left/right buttons which send
    requests to the 'Source'.</p>
    <p>You can scale the 'View' by dragging the 'Scale' slider.</p>
    <p>You can rotate the 'View' by dragging the 'Rotate' slider.</p>
    <p>An overlay is displayed within the 'Source' to show where the the 'View' is currently located.</p>
    <br/>

    <div class="WBorder0">
      Source<br/>
      <div class="W1Source0 W200 H200"></div>
      <br/>
      <table style="text-align:center">
        <tr>
          <td>{{mx}}</td>
          <td>{{my}}</td>
        </tr>
        <tr>
          <td><button class="WButton" (click)="onUp()">Up</button></td>
          <td><button class="WButton" (click)="onDown()">Down</button></td>
        </tr>
        <tr>
          <td><button class="WButton" (click)="onLeft()">Left</button></td>
          <td><button class="WButton" (click)="onRight()">Right</button></td>
        </tr>
      </table>
    </div>
    <div class="WBorder0 W10 H200"></div>

    <div class="WBorder0">
      View<br/>
      <div class="W1View0 W200 H200"></div>
      <br/>
      Scale: <mat-slider [(ngModel)]="itsUIScale" min="50" max="300" horizontal (input)="onScaleChange($event)"></mat-slider>
      {{scale}}<br/>
      Rotate: <mat-slider [(ngModel)]="itsUIRotate" min="-45" max="45" horivontal (input)="onRotateChange($event)"></mat-slider>
      {{rotate}}
    </div>
    <br/>
    <br/>
    `,
  styles: []
})
export class ViewComponent implements OnInit, OnDestroy {
  //
  private itsSourceRef = null;
  private itsViewRef = null;
  //
  itsUIScale = 300.0;
  private itsScale = 300.0;
  itsUIRotate = 0.0;
  private itsRotate = 0.0;
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
    this.itsSourceRef = this.theWisard.findObjectRefByClassIdNameId('W1Source0');
    this.itsViewRef = this.theWisard.findObjectRefByClassIdNameId('W1View0');
    //
    this.loadScale();
    this.loadRotate();
  }
  /**
   *
   */
  ngOnDestroy() {
    this.log('ngOnDestroy:');
    //
    this.itsSourceRef = null;
    this.itsViewRef = null;
  }
  // ----
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
  private getSourceObject(): ISource {
    return this.getObject(this.itsSourceRef);
  }
  /**
   *
   */
  private getViewObject(): IView {
    return this.getObject(this.itsViewRef);
  }
  // ----
  onUp() {
    const aSource = this.getSourceObject();
    if (aSource === null) { return; }
    aSource.moveDY(-1);
  }
  onDown() {
    const aSource = this.getSourceObject();
    if (aSource === null) { return; }
    aSource.moveDY(1);
  }
  onLeft() {
    const aSource = this.getSourceObject();
    if (aSource === null) { return; }
    aSource.moveDX(-1);
  }
  onRight() {
    const aSource = this.getSourceObject();
    if (aSource === null) { return; }
    aSource.moveDX(1);
  }
  get mx(): string {
    const aSource = this.getSourceObject();
    if (aSource === null) { return ''; }
    return aSource.getX().toFixed(0);
  }
  get my(): string {
    const aSource = this.getSourceObject();
    if (aSource === null) { return ''; }
    return aSource.getY().toFixed(0);
  }
  // ----Scale----
  /**
   * Respond to changes of scale.
   */
  onScaleChange(theEvent: any) {
    const aView = this.getViewObject();
    if (aView === null) { return; }
    this.itsUIScale = theEvent.value;
    this.itsScale = this.itsUIScale * 0.01;
    aView.setScale(this.itsScale);
  }
  /**
   *
   */
  loadScale() {
    const aView = this.getViewObject();
    if (aView === null) { return; }
    this.itsScale = aView.getScale();
    this.itsUIScale = this.itsScale * 100.0;
  }
  /**
   *
   */
  get scale(): string {
    return this.itsScale.toFixed(2);
  }
  // ----Rotate----
  /**
   * Respond to changes of rotation.
   */
  onRotateChange(theEvent: any) {
    const aView = this.getViewObject();
    if (aView === null) { return; }
    this.itsUIRotate = theEvent.value;
    this.itsRotate = this.itsUIRotate;
    aView.setRotate(this.itsRotate);
  }
  /**
   *
   */
  loadRotate() {
    const aView = this.getViewObject();
    if (aView === null) { return; }
    this.itsRotate = aView.getRotate();
    this.itsUIRotate = this.itsRotate;
  }
  /**
   *
   */
  get rotate(): string {
    return this.itsRotate.toFixed(1);
  }
  // ----
  /**
   *
   */
  log(theMessage: string) {
    this.theLog.add('View:' + theMessage);
  }
  //
}
