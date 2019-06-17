import { NgModule } from '@angular/core';
import { MatButtonModule, MatFormFieldModule } from '@angular/material';
import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select';
//
const MaterialComponents = [
  MatFormFieldModule,
  MatButtonModule,
  MatSliderModule,
  MatSelectModule
];
//
@NgModule({
  imports: [MaterialComponents],
  exports: [MaterialComponents]
})
export class MaterialModule {}
//