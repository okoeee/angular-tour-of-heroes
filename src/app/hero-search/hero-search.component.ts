import { Component } from '@angular/core';
import { Hero } from '../hero';
import { Observable, Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.scss']
})
export class HeroSearchComponent {
  heroes$!: Observable<Hero[]>;
  private searchTerms = new Subject<string>();

  constructor(
    private heroService: HeroService
  ) {}

  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      debounceTime(300), // キーストロークのあと、検索前に300ms待つ
      distinctUntilChanged(), // 直前の検索語と同じ場合は虫する
      switchMap((term: string) => this.heroService.searchHeroes(term)) // 検索語が変わるたびに、新しい検索observableにスイッチする
    )
  }
}
