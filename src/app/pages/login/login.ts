import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html'
})
export class LoginComponent {
  form = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(5)])
  });

  error = signal('');
  loading = signal(false);

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set('');

    this.auth.login(this.form.value as { username: string; password: string }).subscribe({
      next: () => {
        const role = this.auth.getPayload()?.rol;
          this.router.navigate(['/home']);
      },
      error: () => {
        this.error.set('Usuario o contraseña incorrectos.');
        this.loading.set(false);
      }
    });
  }
}