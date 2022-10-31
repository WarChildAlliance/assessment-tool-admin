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

  public isAuthenticated = false;
  public authenticatedSource = new BehaviorSubject(false);
  public currentAuthentication = this.authenticatedSource.asObservable();


  constructor(
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService,
  ) {
    this.isAuthenticated = this.cookieService.has('auth-token');
    const keepConnection = this.cookieService.get('keep-connection') === 'true';
    this.authenticatedSource.next(this.cookieService.has('auth-token') && keepConnection);
  }

  public login(username: string, password: string, keepConnection: boolean): void {
    this.http.post<Token>(`${environment.API_URL}/users/token-auth/`, { username, password }).subscribe(
      res => {
        this.isAuthenticated = true;
        // If keep connection is true set cookie expiration to 7 days (max default), otherwise 1 day
        this.cookieService.set('keep-connection', keepConnection.toString(), keepConnection ? 7 : 1);
        this.cookieService.set('auth-token', res.token);
        this.router.navigate(['']);
        this.authenticatedSource.next(true);
      }
    );
  }

  public logout(): void {
    if (this.isAuthenticated) {
      this.isAuthenticated = false;
      this.cookieService.delete('auth-token');
      this.cookieService.delete('keep-connection');
      this.router.navigate(['/auth']);
      this.authenticatedSource.next(false);
    }
  }

  public getToken(): string {
    return this.cookieService.get('auth-token');
  }

}
