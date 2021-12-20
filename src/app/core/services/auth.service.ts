import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Token } from '../models/token.model';
import { CookieService } from './cookie.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated = false;

  private authenticatedSource = new BehaviorSubject(false);
  currentAuthentication = this.authenticatedSource.asObservable();


  constructor(
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService,
  ) {
    this.isAuthenticated = this.cookieService.has('auth-token');
    this.authenticatedSource.next(this.cookieService.has('auth-token'));
  }

  login(username: string, password: string): void {
    this.http.post<Token>(`${environment.API_URL}/users/token-auth/`, { username, password }).subscribe(
      res => {
        this.isAuthenticated = true;
        this.cookieService.set('auth-token', res.token);
        this.router.navigate(['']);
        this.authenticatedSource.next(true);
      }
    );
  }

  logout(): void {
    this.isAuthenticated = false;
    this.cookieService.delete('auth-token');
    this.router.navigate(['/auth']);
    this.authenticatedSource.next(false);
  }

  getToken(): string {
    return this.cookieService.get('auth-token');
  }

}
