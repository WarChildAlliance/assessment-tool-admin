import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { Language } from '../models/language.model';

// import * as moment from 'moment';
// import 'moment/locale/ar';
// import 'moment/locale/es';
// import 'moment/locale/fr';
@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private direction = new BehaviorSubject<'rtl' | 'ltr'>(null);
  private language: Language;
  private languages: Language[] = [
    {
      name: 'العربية',
      code: 'ara',
      direction: 'rtl',
      flag: '../assets/images/jo.svg'
    },
    {
      name: 'English',
      code: 'eng',
      direction: 'ltr',
      flag: '../assets/images/gb.svg'
    }
  ];
  constructor(
    private translateService: TranslateService
  ) {
    this.translateService.setDefaultLang('eng');
    const savedLanguage = localStorage.getItem('la-language') || 'eng';
    const l = this.languages.find((language) => language.code === savedLanguage.toLowerCase());
    this.setLanguage(l);
    this.translateService.use(savedLanguage);
  }

  public getLanguageCode(): string {
    return this.translateService.currentLang;
  }

  public getLanguage(): Language {
    return this.language;
  }

  public getLanguages(): Language[] {
    return this.languages;
  }

  public setLanguage(language: Language): void {
    this.language = language;
    localStorage.setItem('la-language', language.code.toLowerCase());
    this.translateService.use(language.code);
    this.setDirection(language.direction);
    // moment.locale(language.code);
  }

  public getDirection(): BehaviorSubject<'rtl' | 'ltr'> {
    this.setDirection();
    return this.direction;
  }

  private setDirection(direction?: string): void {
    document.getElementsByTagName('html')[0].setAttribute('dir', 'ltr');
    document.getElementsByTagName('html')[0].classList.add('ltr');
    if (direction === 'rtl') {
      document.getElementsByTagName('html')[0].classList.add('arabic');
    } else {
      document.getElementsByTagName('html')[0].classList.remove('arabic');
    }
 // WARNING! We currently dont change the UI according to language but might need to do so in the future.
  // To do so, uncomment the following two lines
/*   document.getElementsByTagName('html')[0].setAttribute('dir', this.language.direction);
    document.getElementsByTagName('html')[0].className = this.language.direction; */
    this.direction.next(this.language.direction);
  }
}
