import { Component } from '@angular/core';
import { HEROES } from '../mock-heroes';
import { Hero } from '../hero';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss']
})
export class HeroesComponent {

  heroes = HEROES;
  selectedHero?: Hero; // ?をつけることで、省略可能なフィールドを宣言できる

  onSelect(hero: Hero): void {
    this.selectedHero = hero;
  }

}
