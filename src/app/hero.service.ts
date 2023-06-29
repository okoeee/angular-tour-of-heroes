import { Injectable } from '@angular/core';
import { HEROES } from './mock-heroes';
import { Hero } from './hero';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from './message.service';
import { HttpClient } from '@angular/common/http';

// DIするためのデコレータ
// DIするまえに、プロバイダを登録する必要がある。
// ng generate serviceで生成した場合は、defaultでprovidedIn: 'root'という表記になる。
// 詳しくは(https://angular.jp/guide/providers)
@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroesUrl = 'api/heroes';

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  // DBなどと連携する場合は、同期処理ではなく非同期処理にするのが適切である。
  // ここでは、RxJSライブラリのObservableとof()関数を使うことで、Observableの値を返すようにする。
  // ※Angularで使用するHttpClient.get()メソッドはObservableを返す。
  // Observableについて(https://angular.jp/guide/observables)
  // getHeroes(): Observable<Hero[]> {
  //   const heroes = of(HEROES)
  //   this.messageService.add('HeroService: fetched heroes');
  //   return heroes;
  // }

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl).pipe(catchError(this.handleError<Hero[]>('getHeroes', [])));
  }

  getHero(id: number): Observable<Hero> {
    const hero = HEROES.find(h => h.id == id)!; // non null assertion
    this.messageService.add(`HeroService: fetched hero id=${id}`);
    return of(hero);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // リモート上のロギング基盤にエラーを出力
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    }
  }

  // TODO ここから！

}
