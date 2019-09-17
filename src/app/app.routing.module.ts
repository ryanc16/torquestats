import { NgModule } from '@angular/core';
import { StatsMapPageRoutingModule } from './components/stats-map/stats-map.page.routing.module';
import { RouterModule } from '@angular/router';
import { HomePageRoutingModule } from './components/home/home.page.routing.module';
import { HomePageComponent } from './components/home/home.page';

@NgModule({
  imports: [
    HomePageRoutingModule,
    StatsMapPageRoutingModule,
    RouterModule.forRoot([
      {path: '', component: HomePageComponent}
    ])
  ],
  exports: [
    HomePageRoutingModule,
    StatsMapPageRoutingModule
  ]
})
export class AppRoutingModule {}