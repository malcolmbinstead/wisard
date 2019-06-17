//
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LogService } from '../log/log.service';
import { WisardService } from '../wisard/wisard.service';
import { IWObjectRef } from '../wisard/weakref';
// tslint:disable:max-line-length
@Component({
  selector: 'app-decoder',
  template: `
    <br/>
    <h2>Decoder:</h2>
    <br/>

    <p>The 'Decoder' is a diagnostic tool that can be used to see how
    each 'feature' is used to address each RAM within a Store.</p>

    <p>In the scene below you can see the 'Decoder".</p>

    <p>The 'Decoder' has as many rows as there are rows in the 'Features' array.</p>

    <p>Each row within the 'Decoder' represents a single RAM.</p>

    <p>If the 'feature' size is (F) then each RAM will contain (2<span class="WSuper">F</span>) bits of storage.</p>

    <p>i.e. if F is 4 then there will be 16 pigeon holes within each row.</p>

    <p>The 'View' is broken up into multiple 'features', each row shows the decode for each feature.</p>

    <p>i.e. If the 'View' size is (16,16) then there will be image 256 bits,
    and if F is 4 then there will be 64 features (rows).</p>

    <p>The total Decoder size is the Row size times the number of Rows, ((WH)/F)(2<span class="WSuper">F</span>) bits.</p>

    <p>i.e. If the 'View' size is (16,16) and F is 4 then the Decoder size is 1024 bits (64 x 16).</p>

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
      F<br/>
      <div class="W1Tuple0 W16 H256 WBorder1"></div>
    </div>
    
    <div class="WBorder0 W10 H200"></div>
    
    <div class="WBorder0">
      Decoder<br/>
      <div class="W1Decoder0 W64 H256 WBorder1"></div>
    </div>

    <br/>
  `,
  styles: []
})
export class DecoderComponent implements OnInit, OnDestroy {
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
    this.theLog.add('Decoder:' + theMessage);
  }
  //
}
