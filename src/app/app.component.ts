import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { UserRoles } from './core/models/user.model';
import { AuthService } from './core/services/auth.service';
import { LanguageService } from './core/services/language.service';
import { UserService } from './core/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  selfName = '';

  public languageCode: string = this.languageService.getLanguageCode();
  public languages: { name: string, code: string, direction: 'rtl' | 'ltr' }[] = this.languageService.getLanguages();

  constructor(
    private titleService: Title,
    private translateService: TranslateService,
    private authService: AuthService,
    private userService: UserService,
    private languageService: LanguageService
    ) {
      this.translateService.stream('general.adminDashboard').subscribe((translated) => {
        this.titleService.setTitle(translated);
      });
    }

  ngOnInit(): void {
    this.authService.currentAuthentication.subscribe( authenticated => {
      if (authenticated) {
        this.userService.getSelf().subscribe(res => {
          console.log(res);
          if (res.role !== UserRoles.Supervisor) { this.authService.logout(); }
          this.selfName = res.first_name + ' ' + res.last_name;
          const language = {
            name: res.language.name_en,
            code: res.language.code.toLowerCase(),
            direction: res.language.direction
          };
          this.languageService.setLanguage(language);
        });
      }
    });
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }

  logout(): void {
    this.authService.logout();
  }

  changeLanguage(language: { name: string, code: string, direction: 'rtl' | 'ltr' }): void {
    this.languageCode = language.code;
    this.languageService.setLanguage(language);
  }
}
