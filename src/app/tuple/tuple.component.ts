//
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LogService } from '../log/log.service';
import { WisardService } from '../wisard/wisard.service';
import { IWObjectRef } from '../wisard/weakref';
import { IView } from '../wisard/interfaces';
//
@Component({
  selector: 'app-tuple',
  template: `
    <br/>
    <h2>Features:</h2>
    <br/>

    <p>A collection of bits is called a 'feature'.</p>

    <p>The Scrambled image is sequentially broken down into an array of 'features'.</p>
    
    <p>Each 'feature' represents a random collection of bits from within the 'View'.</p>
    
    <p>The 'feature' size (in bits) can be configured when the pipeline is constructed.</p>
    
    <p>If the 'View' has a size of (W,H) then the total number of bits will be WxH.</p>
    
    <p>If the 'feature' size is (F) then the number of features collected will be (WxH)/F.</p>
    
    <p>For example if The 'View' size is (16,16) there will be 256 bits,
    if the 'feature' size is (4) then there will be 64 features.</p>
    
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
      Scram<br/>
      <div class="W1Scramble0 W64 H64 WBorder1"></div>
    </div>
    
    <div class="WBorder0 W10 H200"></div>

    <div class="WBorder0">
      Features<br/>
      <div class="W1Tuple0 W16 H256 WBorder1"></div>
     </div>
    <br/>
  `,
  styles: []
})
export class TupleComponent implements OnInit, OnDestroy {
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
  ngOnDestroy(){
    this.log('ngOnDestroy:');
  }
  // ----
  /**
   *
   */
  log(theMessage: string) {
    this.theLog.add('Tuple:' + theMessage);
  }
  //
}
