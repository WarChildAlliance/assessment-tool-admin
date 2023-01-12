import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @ViewChild('passwordElement') passwordElement: ElementRef<HTMLInputElement>;

  public loginForm = new FormGroup({
    username: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required]),
    keepConnection: new FormControl(true, [Validators.required])
  });

  public passwordType = 'password';

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  public onSubmit(): void {
    this.authService.login(
      this.loginForm.value.username,
      this.loginForm.value.password,
      this.loginForm.value.keepConnection
    );
  }

  public showPassword(): void {
    this.passwordType = this.passwordElement.nativeElement.getAttribute('type') === 'password' ? 'text' : 'password';
    this.passwordElement.nativeElement.setAttribute('type', this.passwordType);
  }

  public onSignup(): void {
    console.log('Sign up!');
  }

  public onForgotPassword(): void {
    console.log('Forgot Password?');
  }
}
