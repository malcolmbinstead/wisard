//
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LogService } from '../log/log.service';
import { WisardService } from '../wisard/wisard.service';
import { IWObjectRef, IClassifierRef } from '../wisard/weakref';
import { IClassifier } from '../wisard/iclassifier';
import { ISource, IStore } from '../wisard/interfaces';
import { IMacros } from '../wisard/imacros';
import { MacroList } from '../wisard/macro_list';
//
@Component({
  selector: 'app-store1',
  template: `
    <br/>
    <h2>Store 1:</h2>
    <br />

    <p>A 'Store' is used to record features found during training
    and to report on their presence during testing.</p>

    <p>In the scenario below you can see a 'Source' that contains
    some letters of the alphabet that will used for training,<br />
    there is also a single Store that we will train.</p>

    <p>There are two action buttons that are for controlling the Store.</p>

    <p>Pressing the 'Clear' button will empty the Store's contents.</p>

    <p>Pressing the 'Teach' button will instruct the 'View' to move
    to the next letter in the teaching set and then instruct
    the store to record the features found.</p>

    <p>In practice you should attempt to train a Store with a sufficiently
    large training set to ensure that it is capable of recognising
    images that deviate from the training set.</p>

    <br />
    <br />

    <div class="WBorder0">
      Source<br />
      <div class="W2Source0 W200 H200"></div>
      <br />
      <table style="text-align:center">
        <tr>
          <td>{{ mx }}</td>
          <td>{{ my }}</td>
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
    </div>

    <div class="WBorder0 W10 H200"></div>

    <div class="WBorder0">
      Thresh<br />
      <div class="W2Threshold0 W64 H64 WBorder1"></div>
    </div>

    <div class="WBorder0 W10 H200"></div>

    <div class="WBorder0">
      Decoder<br />
      <div class="W2Decoder0 W64 H256 WBorder1"></div>
    </div>

    <div class="WBorder0 W10 H200"></div>

    <div class="WBorder0">
      Store1<br />
      <div class="W2Store1 W64 H256 WBorder1"></div>
    </div>

    <div class="WBorder0 W10 H200"></div>

    <div class="WBorder0">
      Actions:<br />
      <button class="WButton" (click)="onClear()">Clear</button><br/>
      <button class="WButton" (click)="onTeach()">Teach</button><br/>
    </div>

    <br />
    <br />

  `,
  styles: []
})
export class Store1Component implements OnInit, OnDestroy {
  //
  private itsClassifierRef = null;
  private itsSourceRef = null;
  private itsStore1Ref = null;
  //
  private itsTeachMacro1  = new MacroList();
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
    this.itsStore1Ref = this.theWisard.findObjectRefByClassIdNameId('W2Store1');
    //
    this.invokeInit();
    //
    this.itsIntervalId = setInterval(() => this.tick(), 1000);
  }
  /**
   *
   */
  private tick() {
    this.loadMacros();
  }
  /**
   *
   */
  ngOnDestroy() {
    this.log('ngOnDestroy:');
    //
    this.itsClassifierRef = null;
    this.itsSourceRef = null;
    this.itsStore1Ref = null;
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
  private getStore1Object(): IStore {
    return this.getObject(this.itsStore1Ref);
  }
  // ----
  /**
   *
   */
  private getMacros(): IMacros {
    const aClassifier = this.getClassifier(this.itsClassifierRef);
    if (aClassifier === null) {
      return null;
    }
    const aMacros = aClassifier.getConfig().getMacros();
    if (aMacros.isLoaded() === false) { return null; }
    return aMacros;
  }
  /**
   *
   */
  invokeInit() {
    const aMacros = this.getMacros();
    if (aMacros === null) { return; }
    //
    aMacros.sendInit();
  }
  /**
   *
   */
  loadMacros() {
    const aMacros = this.getMacros();
    if (aMacros === null) { return; }
    //
    this.itsTeachMacro1.length = aMacros.getTeachPos(1).length;
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
  onClear() {
    const aMacros = this.getMacros();
    if (aMacros === null) { return; }
    //
    aMacros.sendAction('Store1,clear');
  }
  /**
   *
   */
  onTeach() {
    const aMacros = this.getMacros();
    if (aMacros === null) { return; }
    //
    const aIndex1 = this.itsTeachMacro1.next();
    if (aIndex1 >= 0) {
      aMacros.sendTeachPos(1, aIndex1, 'Store1,teach');
    }
    //
  }
  // ----
  /**
   *
   */
  log(theMessage: string) {
    this.theLog.add('Store1:' + theMessage);
  }
  //
}
