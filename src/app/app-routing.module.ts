import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//
import { IntroComponent } from './intro/intro.component';
import { OverviewComponent } from './overview/overview.component';
//
import { SourceComponent } from './source/source.component';
import { ViewComponent } from './view/view.component';
import { ThresholdComponent } from './threshold/threshold.component';
import { ScrambleComponent } from './scramble/scramble.component';
import { TupleComponent } from './tuple/tuple.component';
import { DecoderComponent } from './decoder/decoder.component';
//
import { Store1Component } from './store1/store1.component';
import { Match1Component } from './match1/match1.component';
import { Score1Component } from './score1/score1.component';
//
import { Store4Component } from './store4/store4.component';
//
import { ResultComponent } from './result/result.component';
//
// the following is only used during site development.
import { SetupComponent } from './setup/setup.component';
//
const routes: Routes = [
  { path: '', component: IntroComponent },
  { path: 'intro', component: IntroComponent },
  { path: 'overview', component: OverviewComponent },
  { path: 'source', component: SourceComponent },
  { path: 'view', component: ViewComponent },
  { path: 'threshold', component: ThresholdComponent },
  { path: 'scramble', component: ScrambleComponent },
  { path: 'features', component: TupleComponent },
  { path: 'decoder', component: DecoderComponent },
  { path: 'store1', component: Store1Component },
  { path: 'match1', component: Match1Component },
  { path: 'score1', component: Score1Component },
  { path: 'store4', component: Store4Component },
  { path: 'result', component: ResultComponent },
  { path: 'setup' , component: SetupComponent }
];
//
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
//
export const RoutingComponents = [
  IntroComponent,
  OverviewComponent,
  SourceComponent,
  ViewComponent,
  ThresholdComponent,
  ScrambleComponent,
  TupleComponent,
  DecoderComponent,
  Store1Component,
  Match1Component,
  Score1Component,
  Store4Component,
  ResultComponent,
  SetupComponent
];
//
