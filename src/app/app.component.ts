//
import { Component, OnInit } from '@angular/core';
import { LogService } from './log/log.service';
import { WisardService } from './wisard/wisard.service';
//
@Component({
  selector: 'app-root',
  template: `
  <div class="wrow">
    <div class="wcolumn">
      <h1>Soft WISARD</h1>
    </div>
    <div class="wcolumn">
      <h6>Status: {{ status }}</h6>
      <h6>Render Rate: {{ renderRate }}</h6>
      <h6>Texture Count: {{ textureCount }}</h6>
    </div>
  </div>
  <nav>
    <a routerLink="/intro" routerLinkActive="active">Intro</a>
    <a routerLink="/overview" routerLinkActive="active">Overview</a>
    <a routerLink="/source" routerLinkActive="active">Source</a>
    <a routerLink="/view" routerLinkActive="active">View</a>
    <a routerLink="/threshold" routerLinkActive="active">Threshold</a>
    <a routerLink="/scramble" routerLinkActive="active">Scramble</a>
    <a routerLink="/features" routerLinkActive="active">Features</a>
    <a routerLink="/decoder" routerLinkActive="active">Decoder</a>
    <a routerLink="/store1" routerLinkActive="active">Store 1</a>
    <a routerLink="/match1" routerLinkActive="active">Match 1</a>
    <a routerLink="/score1" routerLinkActive="active">Score 1</a>
    <a routerLink="/store4" routerLinkActive="active">Store 1-4</a>
    <a routerLink="/result" routerLinkActive="active">Result</a>
    <!--
    <a routerLink="/setup" routerLinkActive="active">Setup</a>
    -->
  </nav>
  <router-outlet></router-outlet>

  <!--
  <button (click)="onInvoke()">Invoke</button>
  <button (click)="onReallocate()">Reallocate</button>
  <app-log></app-log>
  -->

  <br/>
  <p style="text-align:center;">
  Copyright 2019 Binstead Systems Ltd. All rights reserved.

  `,
  styles: [
    `
    .wrow:after {
      content: "";
      display: table;
      clear: both;
    }

    .wcolumn {
      float: left;
      width: 50%;
      padding: 5px;
    }
  `
  ]
})
export class AppComponent implements OnInit {

  constructor(private theLog: LogService, private theWisard: WisardService) { }

  /**
   *
   */
  ngOnInit() {
    if (this.theWisard.open() === false) {
      this.log('Unable to open Wisard Service');
      return;
    }
    //
    const aParams1 = {
      Id: 1,
      Name: 'sample1.mp4',
      ViewW: 16,
      ViewH: 16,
      TupleW: 4,
      StoreCount: 1
    };
    //
    const aParams2 = {
      Id: 2,
      Name: 'sample2.jpg', // text still.
      ViewW: 28,
      ViewH: 32,
      TupleW: 6,
      StoreCount: 1
    };
    //
    const aParams3 = {
      Id: 3,
      Name: 'sample2.jpg', // text still.
      ViewW: 28,
      ViewH: 32,
      TupleW: 6,
      StoreCount: 4,
      IconNames: ['unknown', 'a', 'b', 'c', 'd']
    };
    //
    this.theWisard.createClassifier(aParams1);
    this.theWisard.createClassifier(aParams2);
    this.theWisard.createClassifier(aParams3);
  }
  /**
   *
   */
  get status(): string {
    return this.theWisard.getStatus();
  }
  /**
   *
   */
  get renderCounter(): number {
    return this.theWisard.getRenderCounter();
  }
  /**
   *
   */
  get renderRate(): number {
    return this.theWisard.getRenderRate();
  }
  /**
   *
   */
  get textureCount(): number {
    return this.theWisard.getTextureCount();
  }
  /**
   *
   */
  get bufferCount(): number {
    return this.theWisard.getBufferCount();
  }
  /**
   *
   */
  get framebufferCount(): number {
    return this.theWisard.getFramebufferCount();
  }
  /**
   *
   */
  get vertexArrayCount(): number {
    return this.theWisard.getVertexArrayCount();
  }
  /**
   *
   */
  onInvoke() {
    this.log('onInvoke');
    this.theWisard.findElements();
  }
  /**
   * Testing - reallocate storage.
   */
  onReallocate() {
    this.log('onReallocate');
    this.theWisard.reallocate();
  }
  // ----
  /**
   *
   */
  log(theMessage: string) {
    this.theLog.add('App:' + theMessage);
  }
  //
}
