import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { StatsMapPageModule } from './components/stats-map/stats-map.page.module';
import { HomePageModule } from './components/home/home.page.module';
import { AppRoutingModule } from './app.routing.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  providers: [

  ],
  imports: [
    BrowserModule,
    HomePageModule,
    StatsMapPageModule,
    AppRoutingModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
