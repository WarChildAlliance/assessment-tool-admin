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
      code: 'ara',
      direction: 'rtl'
    },
    {
      name: 'English',
      code: 'eng',
      direction: 'ltr'
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

  public getLanguage(): { name: string, code: string, direction: 'rtl' | 'ltr' } {
    return this.language;
  }

  public getLanguages(): { name: string, code: string, direction: 'rtl' | 'ltr' }[] {
    return this.languages;
  }

  public setLanguage(language: { name: string, code: string, direction: 'rtl' | 'ltr' }): void {
    this.language = language;
    localStorage.setItem('la-language', language.code.toLowerCase());
    this.translateService.use(language.code);
    this.setDirection();
    // moment.locale(language.code);
  }

  public getDirection(): BehaviorSubject<'rtl' | 'ltr'> {
    this.setDirection();
    return this.direction;
  }

  private setDirection(): void {
    document.getElementsByTagName('html')[0].setAttribute('dir', 'ltr');
    document.getElementsByTagName('html')[0].className = 'ltr';
 // WARNING! We currently dont change the UI according to language but might need to do so in the future.
  // To do so, uncomment the following two lines
/*   document.getElementsByTagName('html')[0].setAttribute('dir', this.language.direction);
    document.getElementsByTagName('html')[0].className = this.language.direction; */
    this.direction.next(this.language.direction);
  }
}
