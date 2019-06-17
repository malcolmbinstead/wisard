import { Component, OnInit, OnDestroy } from '@angular/core';
import { LogService } from '../log/log.service';
import { WisardService } from '../wisard/wisard.service';
import { IWObjectRef } from '../wisard/weakref';
import { ISource } from '../wisard/interfaces';
//
@Component({
  selector: 'app-source',
  template: `
    <br/>
    <h2>Source:</h2>
    <br/>

    <p>The 'Source' is responsible for taking imagery into the processing pipeline.</p>
    <p>The imagery can be a still frame or a video file.</p>
    <p>The image size (in pixels) is defined by the file being read.</p>
    <p>The size of the 'Source' within the browser is controlled by CSS.</p>
    <br/>
    <div class="WBorder0">
      Source<br/>
      <div class="W1Source0 WBorder2 W200 H200"></div><br/>
      <b>{{ filename }}</b><br/>
      <button class="WButton" (click)="onClickVideo1()">Video1</button><br/>
      <button class="WButton" (click)="onClickVideo2()">Video2</button><br/>
    </div>
    <br/>
    <br/>
  `,
  styles: []
})
export class SourceComponent implements OnInit, OnDestroy {
  //
  private itsVideoRef = null;
  //
  private itsFileName = '';
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
    this.itsVideoRef = this.theWisard.findObjectRefByClassIdNameId('W1Source0');
    this.loadFileName();
  }
  /**
   *
   */
  ngOnDestroy() {
    this.log('ngOnDestroy:');
    this.itsVideoRef = null;
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
  private getVideoObject(): ISource {
    return this.getObject(this.itsVideoRef);
  }
  /**
   *
   */
   onClickVideo1() {
    this.setFileName('sample1.mp4');
  }
  /**
   *
   */
  onClickVideo2() {
    this.setFileName('sample2.mp4');
  }
  /**
   *
   */
  loadFileName() {
    const aVideo = this.getVideoObject();
    if (aVideo === null) { return; }
    this.itsFileName = aVideo.getFileName();
  }
  /**
   *
   */
  setFileName(theFileName: string) {
    this.itsFileName = theFileName;
    const aVideo = this.getVideoObject();
    if (aVideo === null) { return; }
    aVideo.setFileName(this.itsFileName);
  }
  /**
   *
   */
  get filename(): string {
    return this.itsFileName;
  }
  // ----
  /**
   *
   */
  log(theMessage: string) {
    this.theLog.add('Source:' + theMessage);
  }
  //
}
