import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeroesComponent } from './heroes/heroes.component';
import { FormsModule } from '@angular/forms';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';
import { MessagesComponent } from './messages/messages.component';

@NgModule({
  declarations: [
    AppComponent,
    HeroesComponent,
    HeroDetailComponent,
    MessagesComponent //ng generateで作成すると、declarationsに追加される
  ],
  imports: [
    BrowserModule,
    FormsModule //ngModelを使うためには、←をimportする必要がある
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
