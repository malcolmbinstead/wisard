//
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
//
import { AppRoutingModule, RoutingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { LogComponent } from './log/log.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { IntroComponent } from './intro/intro.component';
import { SourceComponent } from './source/source.component';
import { ViewComponent } from './view/view.component';
import { ThresholdComponent } from './threshold/threshold.component';
import { ScrambleComponent } from './scramble/scramble.component';
import { TupleComponent } from './tuple/tuple.component';
import { DecoderComponent } from './decoder/decoder.component';
import { Store1Component } from './store1/store1.component';
import { Match1Component } from './match1/match1.component';
import { Score1Component } from './score1/score1.component';
import { SetupComponent } from './setup/setup.component';
import { ResultComponent } from './result/result.component';
import { Store4Component } from './store4/store4.component';
import { OverviewComponent } from './overview/overview.component';
//
@NgModule({
  //
  declarations: [
    AppComponent,
    LogComponent,
    RoutingComponents,
    IntroComponent,
    SourceComponent,
    ViewComponent,
    ThresholdComponent,
    ScrambleComponent,
    TupleComponent,
    DecoderComponent,
    Store1Component,
    Match1Component,
    Score1Component,
    SetupComponent,
    ResultComponent,
    Store4Component,
    OverviewComponent],
  //
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule
  ],
  //
  providers: [],
  //
  bootstrap: [AppComponent]
  //
})
export class AppModule { }
