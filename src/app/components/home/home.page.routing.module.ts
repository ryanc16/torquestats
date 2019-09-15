import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomePageComponent } from './home.page';
import { HomePageModule } from './home.page.module';

@NgModule({
  imports: [
    HomePageModule,
    RouterModule.forRoot([
      {path: 'home', component: HomePageComponent}
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class HomePageRoutingModule {}