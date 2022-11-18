import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Language } from './core/models/language.model';
import { UserRoles } from './core/models/user.model';
import { AuthService } from './core/services/auth.service';
import { LanguageService } from './core/services/language.service';
import { UserService } from './core/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmModalComponent } from 'src/app/shared/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public selfName = '';
  public showSubmenu = false;

  public languageCode: string = this.languageService.getLanguageCode();
  public languages: Language[] = this.languageService.getLanguages();
  constructor(
    private titleService: Title,
    private translateService: TranslateService,
    private dialog: MatDialog,
    private authService: AuthService,
    private userService: UserService,
    private languageService: LanguageService
  ) {
    this.translateService
      .stream('general.adminDashboard')
      .subscribe((translated) => {
        this.titleService.setTitle(translated);
      });
  }

  public get isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }

  ngOnInit(): void {
    this.authService.currentAuthentication.subscribe((authenticated) => {
      if (authenticated) {
        this.userService.getSelf().subscribe((res) => {
          if (res.role !== UserRoles.Supervisor) {
            this.authService.logout();
          }
          this.selfName =
            res.first_name && res.last_name
              ? res.first_name + ' ' + res.last_name
              : res.username;
          if (res.language) {
            const language = {
              name: res.language.name_en,
              code: res.language.code.toLowerCase(),
              direction: res.language.direction,
              flag: res.language.flag,
            };
            this.languageService.setLanguage(language);
          }
        });
      } else {
        this.authService.logout();
      }
    });
    // window.addEventListener('beforeinstallprompt', (e: any) => {
      // console.log('BEFORE INSTALL PROMPT');
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      // e.preventDefault();
      // // Stash the event so it can be triggered later.
      // let deferredPrompt = e;
      // // Run next line only on user click
      // deferredPrompt.prompt();
      // // Wait for the user to respond to the prompt
      // deferredPrompt.userChoice.then((choiceResult) => {
      //   if (choiceResult.outcome === 'accepted') {
      //     console.log('User accepted the A2HS prompt');
      //   } else {
      //     console.log('User dismissed the A2HS prompt');
      //   }
      //   deferredPrompt = null;
      // });
    // });
  }

  public logout(): void {
    const confirmDialog = this.dialog.open(ConfirmModalComponent, {
      data: {
        title: this.translateService.instant('general.logout'),
        content: this.translateService.instant('general.logoutPrompt'),
        contentType: 'text',
        confirmColor: 'warn',
      },
    });
    confirmDialog.afterClosed().subscribe((res) => {
      if (res) {
        this.authService.logout();
      }
    });
  }

  public changeLanguage(language: Language): void {
    this.languageCode = language.code;
    this.languageService.setLanguage(language);
  }
}
