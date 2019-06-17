//
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LogService } from '../log/log.service';
import { WisardService } from '../wisard/wisard.service';
import { IWObjectRef, IClassifierRef } from '../wisard/weakref';
import { IClassifier } from '../wisard/iclassifier';
import { ISource, IStore, IMatch, IScoreOut } from '../wisard/interfaces';
import { IMacros } from '../wisard/imacros';
import { MacroList } from '../wisard/macro_list';
//
// tslint:disable:no-redundant-jsdoc
@Component({
  selector: 'app-store4',
  template: `
    <br />
    <h2>Store 1-4:</h2>
    <br />

    <p>Multiple Stores are used when we want recognise a 'type' of scene.</p>

    <p>In the scenario below you can see a 'Source' that contains
    some letters of the alphabet that will used for training and testing,<br />
    and there are four Stores that we will independently train and test.</p>

    <p>The 'Source' contains two sets of letters.
    The letters at the top are for teaching only.
    The letters at the bottom are for testing only</p>

    <p>Each Store has three action control buttons.</p>

    <p>Pressing the 'Clear' button will empty the associated Store.</p>

    <p>Pressing the 'Teach' button will instruct the 'View' to move
    to the next letter in the teaching set and then instruct
    the associated store to record the features found.</p>

    <p>Pressing the 'Test' button will instruct the 'View' to move
    to the next letter in the testing set where its features will be reported.</p>

    <p>You will notice that immediately after teaching,
    the 'Score' window for the 'Store' just taught will be fully populated,
    this is because the software will automatically test the 'View'
    and find all the features to be present.</p>

    <p>You will notice that when testing any 'Store',
    some of the RAMs might not detect a feature and this will lower the score,
    this is because we are using a real world image that contains
    noise, uneven lighting and distortion,
    however many of the RAMs should respond.</p>

    <p>You will notice that when testing a store,
    some of the other stores will also produce a significant response,
    this is becuase there may be many features that are common to both.</p>

    <br />
    <br />

    <div class="WBorder0">
      Source<br />
      <div class="W3Source0 W200 H200"></div>
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
      <div class="W3View0 W64 H64"></div>
    </div>

    <div class="WBorder0 W10 H200"></div>

    <div class="WBorder0">
      Thresh<br />
      <div class="W3Threshold0 W64 H64 WBorder1"></div>
    </div>

    <div class="WBorder0 W10 H200"></div>

    <div class="WBorder0">
      S1<br />
      <div class="W3Store1 W64 H256 WBorder1"></div><br />
      <button class="WButton" (click)="onClear(1)">Clear</button><br/>
      <button class="WButton" (click)="onTeach(1)">Teach</button><br/>
      <button class="WButton" (click)="onTest(1)">Test</button><br/>
       <div class="W3ScoreOut1 W16 H128 WBorder1"></div>
    </div>

    <div class="WBorder0 W10 H200"></div>

    <div class="WBorder0">
      S2<br />
      <div class="W3Store2 W64 H256 WBorder1"></div><br />
      <button class="WButton" (click)="onClear(2)">Clear</button><br/>
      <button class="WButton" (click)="onTeach(2)">Teach</button><br/>
      <button class="WButton" (click)="onTest(2)">Test</button><br/>
      <div class="W3ScoreOut2 W16 H128 WBorder1"></div>
    </div>

    <div class="WBorder0 W10 H200"></div>

    <div class="WBorder0">
      S3<br />
      <div class="W3Store3 W64 H256 WBorder1"></div><br />
      <button class="WButton" (click)="onClear(3)">Clear</button><br/>
      <button class="WButton" (click)="onTeach(3)">Teach</button><br/>
      <button class="WButton" (click)="onTest(3)">Test</button><br/>
      <div class="W3ScoreOut3 W16 H128 WBorder1"></div>
    </div>

    <div class="WBorder0 W10 H200"></div>

    <div class="WBorder0">
      S4<br />
      <div class="W3Store4 W64 H256 WBorder1"></div><br />
      <button class="WButton" (click)="onClear(4)">Clear</button><br/>
      <button class="WButton" (click)="onTeach(4)">Teach</button><br/>
      <button class="WButton" (click)="onTest(4)">Test</button><br/>
      <div class="W3ScoreOut4 W16 H128 WBorder1"></div>
    </div>

    <br />
    <br />
  `,
  styles: []
})
export class Store4Component implements OnInit, OnDestroy {
  //
  private itsClassifierRef = null;
  private itsSourceRef = null;
  private itsStore1Ref = null;
  private itsMatch1Ref = null;
  //
  private itsTeachMacro1 = new MacroList();
  private itsTeachMacro2 = new MacroList();
  private itsTeachMacro3 = new MacroList();
  private itsTeachMacro4 = new MacroList();
  //
  private itsTestMacro1 = new MacroList();
  private itsTestMacro2 = new MacroList();
  private itsTestMacro3 = new MacroList();
  private itsTestMacro4 = new MacroList();
  //
  private itsIntervalId;
  /**
   *
   * @param theLog
   * @param theWisard
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
    this.itsClassifierRef = this.theWisard.findClassifierRefByClassId('W3');
    this.itsSourceRef = this.theWisard.findObjectRefByClassIdNameId('W3Source0');
    this.itsStore1Ref = this.theWisard.findObjectRefByClassIdNameId('W3Store1');
    this.itsMatch1Ref = this.theWisard.findObjectRefByClassIdNameId('W3Match1');
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
    this.itsMatch1Ref = null;
    //
    clearInterval(this.itsIntervalId);
  }
  // ----
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
  /**
   *
   */
  private getMatch1Object(): IMatch {
    return this.getObject(this.itsMatch1Ref);
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
    this.itsTeachMacro2.length = aMacros.getTeachPos(2).length;
    this.itsTeachMacro3.length = aMacros.getTeachPos(3).length;
    this.itsTeachMacro4.length = aMacros.getTeachPos(4).length;
    //
    this.itsTestMacro1.length = aMacros.getTestPos(1).length;
    this.itsTestMacro2.length = aMacros.getTestPos(2).length;
    this.itsTestMacro3.length = aMacros.getTestPos(3).length;
    this.itsTestMacro4.length = aMacros.getTestPos(4).length;
    //
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
  onClear(theId: number) {
    const aMacros = this.getMacros();
    if (aMacros === null) { return; }
    //
    switch (theId) {
      case 1:
        aMacros.sendAction('Store1,clear');
        break;
      case 2:
        aMacros.sendAction('Store2,clear');
        break;
      case 3:
        aMacros.sendAction('Store3,clear');
        break;
      case 4:
        aMacros.sendAction('Store4,clear');
        break;
    }
  }
  /**
   *
   */
  onTeach(theId: number) {
    const aMacros = this.getMacros();
    if (aMacros === null) { return; }
    //
    switch (theId) {
      case 1:
        const aIndex1 = this.itsTeachMacro1.next();
        if (aIndex1 >= 0) {
          aMacros.sendTeachPos(1, aIndex1, 'Store1,teach');
        }
        break;
      case 2:
        const aIndex2 = this.itsTeachMacro2.next();
        if (aIndex2 >= 0) {
          aMacros.sendTeachPos(2, aIndex2, 'Store2,teach');
        }
        break;
      case 3:
        const aIndex3 = this.itsTeachMacro3.next();
        if (aIndex3 >= 0) {
          aMacros.sendTeachPos(3, aIndex3, 'Store3,teach');
        }
        break;
      case 4:
        const aIndex4 = this.itsTeachMacro4.next();
        if (aIndex4 >= 0) {
          aMacros.sendTeachPos(4, aIndex4, 'Store4,teach');
        }
        break;
    }
    //
  }
  /**
   *
   */
  onTest(theId: number) {
    const aMacros = this.getMacros();
    if (aMacros === null) { return; }
    //
    switch (theId) {
      case 1:
        const aIndex1 = this.itsTestMacro1.next();
        if (aIndex1 >= 0) {
          aMacros.sendTestPos(1, aIndex1);
        }
        break;
      case 2:
        const aIndex2 = this.itsTestMacro2.next();
        if (aIndex2 >= 0) {
          aMacros.sendTestPos(2, aIndex2);
        }
        break;
      case 3:
        const aIndex3 = this.itsTestMacro3.next();
        if (aIndex3 >= 0) {
          aMacros.sendTestPos(3, aIndex3);
        }
        break;
      case 4:
        const aIndex4 = this.itsTestMacro4.next();
        if (aIndex4 >= 0) {
          aMacros.sendTestPos(4, aIndex4);
        }
        break;
    }
    //
  }
  // ----
  /**
   *
   */
  log(theMessage: string) {
    this.theLog.add('Store1-4:' + theMessage);
  }
  //
}
