import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import {
  IonContent, IonButton, IonItem, IonLabel, IonInput, IonText,
  ToastController
} from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { UserService } from 'src/app/services/userService/user-service';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent, IonItem, IonLabel, IonInput, IonButton, IonText
  ],
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
})
export class CreateUserComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  public navCtrl = inject(NavController);
  private toastCrl = inject(ToastController);
  loading = false;

  form = this.fb.group(
    {
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required, Validators.minLength(2)]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(4),

        ],
      ],
      confirmPassword: ['', [Validators.required, Validators.minLength(4)]],
    },
    { validators: this.passwordsMatchValidator }
  );

  ngOnInit() {}

  // --- Validators / helpers ---
  private passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass && confirm && pass !== confirm ? { passwordsMismatch: true } : null;
  }

  get emailCtrl() { return this.form.get('email'); }
  get nameCtrl() { return this.form.get('name'); }
  get passwordCtrl() { return this.form.get('password'); }
  get confirmPasswordCtrl() { return this.form.get('confirmPassword'); }
  get passwordsMismatch() { return this.form.hasError('passwordsMismatch'); }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    const payload = {
      email: this.emailCtrl?.value!,
      name: this.nameCtrl?.value!,
      password: this.passwordCtrl?.value!,
    };

    this.userService.createUser(payload).subscribe({
      next: () => {

        this.loading = false;
        this.navCtrl.back();

      },
      error: (e) => {
        this.loading = false;
        this.toastCrl.create({
          message: e?.error?.message || 'Error creating user',
          duration: 2000,
          color: 'danger',
        }).then(toast => toast.present());

      },
    }); 
  }
}