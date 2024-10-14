import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { LoginService, FireBaseLoginResponse } from '../../services/login.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  redirectUrl: string = '/home';
  loginMessage: string = '';

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  constructor(
    private loginService: LoginService, 
    private route: ActivatedRoute, 
    private router: Router) {

  }
  
  ngOnInit(): void {
    // Get the 'redirect' query parameter
    this.route.queryParams.subscribe(params => {
      this.redirectUrl = params['redirect'] || '/home';
    });
  }

  async onLogin() {
    const username: string = this.loginForm.get('username')?.value || '';
    const password: string = this.loginForm.get('password')?.value || '';
    
    if (password) {
      const maskedPassword = password.length > 4 
        ? '*'.repeat(password.length - 4) + password.slice(-4) 
        : password;
      console.log(`Username: ${username}`);
      console.log(`Password: ${maskedPassword}`);

      const response: FireBaseLoginResponse = await this.loginService.login(username, password);
      if (this.loginService.idToken) {
        console.log(`idToken: ${this.loginService.idToken}`);
        console.log(JSON.stringify(response, null, 2));
        this.router.navigate([this.redirectUrl]);        
      } else {
        this.loginMessage = 'Login failed.';
        console.log('Login failed.');
      }
    }
  }
}