import { Injectable } from '@angular/core';
import { HEROES } from './mock-heroes';
import { Hero } from './hero';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';

// DIするためのデコレータ
// DIするまえに、プロバイダを登録する必要がある。
// ng generate serviceで生成した場合は、defaultでprovidedIn: 'root'という表記になる。
// 詳しくは(https://angular.jp/guide/providers)
@Injectable({
  providedIn: 'root'
})
export class HeroService {

  constructor(private messageService: MessageService) { }

  // DBなどと連携する場合は、同期処理ではなく非同期処理にするのが適切である。
  // ここでは、RxJSライブラリのObservableとof()関数を使うことで、Observableの値を返すようにする。
  // ※Angularで使用するHttpClient.get()メソッドはObservableを返す。
  // Observableについて(https://angular.jp/guide/observables)
  getHeroes(): Observable<Hero[]> {
    const heroes = of(HEROES)
    this.messageService.add('HeroService: fetched heroes');
    return heroes;
  }

  getHero(id: number): Observable<Hero> {
    const hero = HEROES.find(h => h.id == id)!; // non null assertion
    this.messageService.add(`HeroService: fetched hero id=${id}`);
    return of(hero);
  }

}
