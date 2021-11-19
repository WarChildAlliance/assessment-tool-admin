import { Component, OnInit } from '@angular/core';
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

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private languageService: LanguageService
    ) { }

  ngOnInit(): void {
    this.userService.getSelf().subscribe(res => {
      if (res.role !== UserRoles.Supervisor) { this.authService.logout(); }
      this.selfName = res.first_name + ' ' + res.last_name;
      const language = { name: res.language.name_en, code: res.language.code.toLowerCase(), direction: res.language.direction };
      this.languageService.setLanguage(language);
    });

  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }

  logout(): void {
    this.authService.logout();
  }
}
