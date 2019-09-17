import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { TorqueDataService } from './torque-data.service';

@NgModule({
  providers: [
    TorqueDataService
  ],
  imports: [
    HttpClientModule
  ]
})
export class RestServicesModule {}