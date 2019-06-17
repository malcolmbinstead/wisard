//
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LogService } from '../log/log.service';
import { WisardService } from '../wisard/wisard.service';
import { IWObjectRef, IClassifierRef } from '../wisard/weakref';
import { ISource, IView, IThreshold } from '../wisard/interfaces';
import { IClassifier } from '../wisard/iclassifier';
import { IConfig } from '../wisard/iconfig';
import { IActions } from '../wisard/iactions';
import { IMacros } from '../wisard/imacros';
import { Utils } from '../wisard/utils';
//
@Component({
  selector: 'app-setup',
  template: `
    <br />
    <h2>Setup:</h2>
    <br />

    <div class="WBorder0">
      Source<br />
      <div class="W2Source0 W200 H200"></div>
      <br />
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
      View<br />
      <div class="W2View0 W64 H64"></div>
      <br/>
      <mat-slider class="W32 H128" [(ngModel)]="itsUIScale" min="50" max="300" vertical (input)="onScaleChange($event)"></mat-slider>
      <mat-slider class="W32 H128" [(ngModel)]="itsUIRotate" min="-45" max="45" vertical (input)="onRotateChange($event)"></mat-slider>
      <br/>
      S:{{scale}}<br/>
      R:{{rotate}}
    </div>

    <div class="WBorder0 W10 H200"></div>

    <div class="WBorder0">
      Thresh<br />
      <div class="W2Threshold0 W64 H64 WBorder1"></div>
      <br/>
      <mat-slider class="W32 H128"
        [(ngModel)]="itsUIThreshold" min="0" max="100" vertical
        (input)="onThresholdChange($event)" ></mat-slider>
      <br/>
      T:{{thresh}}
    </div>

    <div class="WBorder0 W10 H200"></div>

    <div class="WBorder0">
      Decoder<br />
      <div class="W2Decoder0 W64 H256 WBorder1"></div>
    </div>

    <br />

    <select class="WButton" [(ngModel)]="itsUIGoto">
      <option *ngFor="let aItem of itsGotoList" [value]="aItem">{{aItem}}</option>
    </select>
    <button class="WButton" (click)="onGotoClick()">Goto</button>
  `,
  styles: []
})
export class SetupComponent implements OnInit, OnDestroy {
  //
  private itsClassifierRef = null;
  private itsSourceRef = null;
  private itsViewRef = null;
  private itsThresholdRef = null;
  //
  public itsUIScale = 300.0;
  public itsUIRotate = 0.0;
  public itsUIThreshold = 50;
  //
  private itsScale = 300.0;
  private itsRotate = 0.0;
  private itsThreshold = 0.5;
  //
  public itsGotoList: string[] = ['0'];
  public itsUIGoto = '0';
  //
  private itsIntervalId;
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
    this.itsClassifierRef = this.theWisard.findClassifierRefByClassId('W2');
    this.itsSourceRef = this.theWisard.findObjectRefByClassIdNameId('W2Source0');
    this.itsViewRef = this.theWisard.findObjectRefByClassIdNameId('W2View0');
    this.itsThresholdRef = this.theWisard.findObjectRefByClassIdNameId('W2Threshold0');
    //
    this.invokeInit();
    //
    this.itsIntervalId = setInterval(() => this.tick(), 1000);
    //
  }
  /**
   *
   */
  private tick() {
    this.loadMacros();
    this.loadScale();
    this.loadRotate();
    this.loadThreshold();
  }
  /**
   *
   */
  ngOnDestroy() {
    this.log('ngOnDestroy:');
    //
    this.itsClassifierRef = null;
    this.itsSourceRef = null;
    this.itsViewRef = null;
    this.itsThresholdRef = null;
    //
    clearInterval(this.itsIntervalId);
  }
  // ----
  /**
   *
   */
  private getClassifier(theRef: IClassifierRef): IClassifier {
    let aClassifier = null;
    if (theRef !== null) {
      aClassifier = theRef.getRef();
    }
    return aClassifier;
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
  private getSourceObject(): ISource {
    return this.getObject(this.itsSourceRef);
  }
  /**
   *
   */
  private getViewObject(): IView {
    return this.getObject(this.itsViewRef);
  }
  /**
   *
   */
  private getThresholdObject(): IThreshold {
    return this.getObject(this.itsThresholdRef);
  }
  // ----
  moveDXY(theDX: number, theDY: number) {
    const aSource = this.getSourceObject();
    if (aSource === null) {
      return;
    }
    aSource.moveDXY(theDX, theDY);
  }
  onUp() {
    this.moveDXY(0, -1);
  }
  onDown() {
    this.moveDXY(0, 1);
  }
  onLeft() {
    this.moveDXY(-1, 0);
  }
  onRight() {
    this.moveDXY(1, 0);
  }
  /**
   *
   */
  get mx(): string {
    const aSource = this.getSourceObject();
    if (aSource === null) {
      return '';
    }
    return aSource.getX().toFixed(0);
  }
  /**
   *
   */
  get my(): string {
    const aSource = this.getSourceObject();
    if (aSource === null) {
      return '';
    }
    return aSource.getY().toFixed(0);
  }
  // ----
  /**
   *
   */
  invokeInit() {
    const aClassifier = this.getClassifier(this.itsClassifierRef);
    if (aClassifier === null) {
      return;
    }
    aClassifier.getConfig().getMacros().sendInit();
  }
  /**
   *
   */
  loadMacros() {
    const aClassifier = this.getClassifier(this.itsClassifierRef);
    if (aClassifier === null) {
      return;
    }
    const aMacros = aClassifier.getConfig().getMacros();
    if (aMacros.isLoaded() === false) { return; }
    //
    const aOldLength = this.itsGotoList.length;
    const aNewLength = aMacros.getTeachPos(1).length;
    //
    if (aOldLength !== aNewLength) {
      const aList: string[] = [];
      for (let aIndex = 0; aIndex < aNewLength; aIndex++) {
        aList.push( '' + aIndex );
      }
      this.itsGotoList = aList;
    }
  }
  /**
   *
   */
  onGotoClick() {
    const aClassifier = this.getClassifier(this.itsClassifierRef);
    if (aClassifier === null) {
      return;
    }
    const aGotoNum = Utils.parseInt(this.itsUIGoto);
    aClassifier.getConfig().getMacros().sendTeachPos(1, aGotoNum);
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
    this.theLog.add('Setup:' + theMessage);
  }
  //
}
