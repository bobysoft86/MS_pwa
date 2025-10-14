import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonItem, IonLabel, IonInput, IonButton } from '@ionic/angular/standalone';
import { UserService } from 'src/app/services/userService/user-service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent, IonItem, IonLabel, IonInput, IonButton
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);

  loading = false;
  error = '';

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  ngOnInit(): void {}

  submit() {
    this.error = '';
    if (this.form.invalid) return;

    this.loading = true;
    const { email, password } = this.form.value;

    this.userService.login({ email: email!, password: password! }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigateByUrl('/private/home', { replaceUrl: true });
      },
      error: (e) => {
        this.loading = false;
        this.error = e?.error?.message || 'Credenciales inválidas';
      },
    });
  }
}