import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StatsMapPageComponent } from './stats-map.page';
import { StatsMapPageModule } from './stats-map.page.module';

@NgModule({
  imports: [
    StatsMapPageModule,
    RouterModule.forRoot([
      {path: 'map', component: StatsMapPageComponent}
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class StatsMapPageRoutingModule {}