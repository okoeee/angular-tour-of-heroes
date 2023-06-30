import { Component } from '@angular/core';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss']
})
export class HeroesComponent {

  // constructorに以下のように定義をすることでDIができる
  // heroServiceをシングルトンインスタンスとして定義する
  constructor(
    private heroService: HeroService,
    private messageService: MessageService
  ) {}

  heroes: Hero[] = [];
  selectedHero?: Hero; // ?をつけることで、省略可能なフィールドを宣言できる

  onSelect(hero: Hero): void {
    this.selectedHero = hero;
    this.messageService.add(`HeroesComponent: Selected hero id=${hero.id}`);
  }

  // getHeroesはconstructorでも呼ぶことができるが、
  // constructorでは簡単な変数宣言のみを行う。
  getHeroes(): void {
    this.heroService.getHeroes().subscribe(heroes => this.heroes = heroes);
  }

  add(name: string): void {
    name = name.trim();
    if(!name) { return; }
    this.heroService.addHero({ name } as Hero).subscribe( hero => {
      this.heroes.push(hero)
    });
  }

  delete(hero: Hero): void {
    this.heroService.deleteHero(hero).subscribe(_ => {
      this.heroes = this.heroes.filter(h => h !== hero);
    });
  }

  // ngOnInitをを使うことで、適切なタイミングでメソッドを呼び出す事ができる
  // ライフサイクルフック(https://angular.jp/guide/lifecycle-hooks)
  ngOnInit(): void {
    this.getHeroes();
  }

}
