import { Component } from '@angular/core';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private authService: AuthService) {}

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }

  logout(): void {
    if(window.confirm('Are you sure you want to logout?')) {
      this.authService.logout();
    }
  }
}
