import { Injectable } from '@angular/core';
import { HEROES } from './mock-heroes';
import { Hero } from './hero';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// DIするためのデコレータ
// DIするまえに、プロバイダを登録する必要がある。
// ng generate serviceで生成した場合は、defaultでprovidedIn: 'root'という表記になる。
// 詳しくは(https://angular.jp/guide/providers)
@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroesUrl = 'api/heroes';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

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
    return this.http.get<Hero[]>(this.heroesUrl).pipe(
      tap(heroes => this.log('fetched heroes')), //observable内で副作用を実行するためのオペレータ
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }

  // getHero(id: number): Observable<Hero> {
  //   const hero = HEROES.find(h => h.id == id)!; // non null assertion
  //   this.messageService.add(`HeroService: fetched hero id=${id}`);
  //   return of(hero);
  // }

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w\ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  deleteHero(hero: Hero): Observable<Hero> {
    const url = `${this.heroesUrl}/${hero.id}`;
    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero name=${hero.name}`)),
      catchError(this.handleError<Hero>('deletedHero'))
    );
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if(!term.trim()) { return of([]); }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(_ => this.log(`found heroes matching ${term}`)),
      catchError(this.handleError<Hero[]>('searchHero', []))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // リモート上のロギング基盤にエラーを出力
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    }
  }

}
