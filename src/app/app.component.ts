import { Component } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { UserService } from './core/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  selfUsername : string = '';

  constructor(private authService: AuthService, private userService : UserService) { }

  ngOnInit(): void {

    this.userService.getSelf().subscribe(res => {
      this.selfUsername = res.first_name + ' ' + res.last_name;
    });
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }

  logout(): void {
    if (window.confirm('Are you sure you want to logout?')) {
      this.authService.logout();
    }
  }
}
