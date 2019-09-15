import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { StatsMapPageModule } from './components/stats-map/stats-map.page.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    StatsMapPageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
