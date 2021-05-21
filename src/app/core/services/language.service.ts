import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
// import * as moment from 'moment';
// import 'moment/locale/ar';
// import 'moment/locale/es';
// import 'moment/locale/fr';
@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private direction = new BehaviorSubject<'rtl' | 'ltr'>(null);
  private language: { name: string, code: string, direction: 'rtl' | 'ltr' };
  private languages: { name: string, code: string, direction: 'rtl' | 'ltr' }[] = [
    {
      name: 'العربية',
      code: 'ar',
      direction: 'rtl'
    },
    {
      name: 'English',
      code: 'en',
      direction: 'ltr'
    }
  ];
  constructor(
    private translateService: TranslateService
  ) {
    this.translateService.setDefaultLang('en');
    const savedLanguage = localStorage.getItem('cwtl-language') || 'en';
    this.setLanguage(this.languages.find((language) => language.code === savedLanguage));
    this.translateService.use(savedLanguage);
  }

  getLanguageCode(): string {
    return this.translateService.currentLang;
  }

  getLanguage(): { name: string, code: string, direction: 'rtl' | 'ltr' } {
    return this.language;
  }

  getLanguages(): { name: string, code: string, direction: 'rtl' | 'ltr' }[] {
    return this.languages;
  }

  setLanguage(language: { name: string, code: string, direction: 'rtl' | 'ltr' }): void {

    console.log('LANGUAGE: ', language);

    this.language = language;
    localStorage.setItem('cwtl-language', language.code);
    this.translateService.use(language.code);
    this.setDirection();
    // moment.locale(language.code);
  }

  getDirection(): BehaviorSubject<'rtl' | 'ltr'> {
    this.setDirection();
    return this.direction;
  }

  private setDirection(): void {
    document.getElementsByTagName('html')[0].setAttribute('dir', this.language.direction);
    document.getElementsByTagName('html')[0].className = this.language.direction;
    this.direction.next(this.language.direction);
  }
}
