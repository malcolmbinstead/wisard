//
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LogService } from '../log/log.service';
import { WisardService } from '../wisard/wisard.service';
import { IWObjectRef } from '../wisard/weakref';
import { IView } from '../wisard/interfaces';
//
@Component({
  selector: 'app-scramble',
  template: `
  <br/>
  <h2>Scramble:</h2>
  <br/>

  <p>The 'Scramble' uses a random sequence to shuffle the binary pixels.</p>
  <p>The pixels are scrambled as a precursor to converting them into 'features'.</p>
  <p>A 'feature' is a random collection of binary pixels.</p>
  <p>The 'Scramble' can generate various random sequences and this can be configured
  when the pipeline is constructed.</p>
  <p>The shuffling process ensures that every pixel gets used.</p>
  <p>The size of the scrambled image (in pixels) is the same as the size of the View (in pixels).</p>
  <p>The size of the scrambled image within the browser is controlled by CSS.</p>
  <br/>
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
      Thresh<br/>
      <div class="W1Threshold0 W64 H64 WBorder1"></div>
     </div>
     <div class="WBorder0 W10 H200"></div>
    <div class="WBorder0">
      Scramble<br/>
      <div class="W1Scramble0 W200 H200 WBorder1"></div>
     </div>
    <br/>
  `,
  styles: []
})
export class ScrambleComponent implements OnInit, OnDestroy {
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
  }
  /**
   *
   */
  ngOnDestroy() {
    this.log('ngOnDestroy:');
  }
  // ----
  /**
   *
   */
  log(theMessage: string) {
    this.theLog.add('Scramble:' + theMessage);
  }
  //
}
