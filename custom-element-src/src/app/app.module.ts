import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { OptionsModule } from './options/options.module';

@NgModule({
  declarations: [
  ],
  imports: [
    BrowserModule,

    OptionsModule,
  ],
  providers: [],
})
export class AppModule {
  ngDoBootstrap() {}
}
