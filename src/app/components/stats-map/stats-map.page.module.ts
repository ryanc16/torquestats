import { NgModule } from '@angular/core';
import { StatsMapPageComponent } from './stats-map.page';
import { RestServicesModule } from 'src/app/services/rest/rest-services.module';

@NgModule({
  declarations: [
    StatsMapPageComponent
  ],
  providers: [
    
  ],
  imports: [
    RestServicesModule
  ],
  exports: [
    StatsMapPageComponent
  ]
})
export class StatsMapPageModule {}