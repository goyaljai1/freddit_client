import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { LocalStorageService } from '../../services/utils/local-storage.service';
import { AuthService } from '../../services/utils/auth.service';
declare var bootstrap: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loginError: string | null = null; // To store the login error message

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private localStorageService: LocalStorageService,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  login(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.userService.login(email, password).subscribe(
        (response: any) => {
          // console.log(response);
          const token = response.token;
          this.localStorageService.setItem('token', JSON.stringify(token));
          this.authService.checkTokenValidity();
          this.authService.setLoginStatus(true);

          this.loginError = null;

          const modalElement = document.getElementById('exampleModal');
          const modalInstance = bootstrap.Modal.getInstance(modalElement);
          modalInstance.hide();
          window.location.reload();
        },
        (error: any) => {
          this.loginError = 'Email or password does not match.';
          console.error('Login failed:', error);
        }
      );
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  resetForm(): void {
    this.loginForm.reset();
    this.loginForm.markAsPristine();
    this.loginForm.markAsUntouched();
    this.loginError = null;
  }
}
