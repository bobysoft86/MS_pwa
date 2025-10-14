import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import {
  IonContent, IonItem, IonLabel, IonList, IonText, IonButton, IonInput
} from '@ionic/angular/standalone';
import { NavController, ModalController, ToastController } from '@ionic/angular/standalone'; // ✅ controllers aquí
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { User } from 'src/app/core/interfaces/user.interface';
import { AddCreditModalComponent } from 'src/app/components/modals/add-credit-modal/add-credit-modal.component';
import { UserService } from 'src/app/services/userService/user-service';
import { HistoricCreditsTableComponent } from "./historic-credits-table/historic-credits-table.component"; // deja tu ruta real

@Component({
  selector: 'app-detail-user',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    IonContent, IonItem, IonLabel, IonList, IonText, IonButton, IonInput,
    HistoricCreditsTableComponent
],
  templateUrl: './detail-user.component.html',
  styleUrls: ['./detail-user.component.scss'],
})
export class DetailUserComponent implements OnInit {
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private navCtrl = inject(NavController);
  private modalCtrl = inject(ModalController);
  private fb = inject(FormBuilder);
  private toastCtrl = inject(ToastController);

  userId = '';
  user!: User;

  editMode = false;
  saving = false;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
  });

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.userId = params['id'];
      this.getUser();
    });
  }

  getUser() {
    this.userService.getUserById(Number(this.userId)).subscribe({ // ✅ asegura número
      next: (res) => {
        this.user = res;
        this.form.patchValue({ name: res.name, email: res.email });
      },
      error: (e) => console.error('Error fetching user:', e),
    });
  }

  goBack() { this.navCtrl.back(); }

  onEdit() {
    this.editMode = true;
    this.form.patchValue({ name: this.user.name, email: this.user.email });
  }

  cancelEdit() {
    this.editMode = false;
    this.form.reset({ name: this.user.name, email: this.user.email });
  }

  async save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;

    const payload = {
      name: this.form.value.name!,
      email: this.form.value.email!,
    };

    this.userService.updateUser(this.user.id, payload).subscribe({
      next: async (updated) => {
        this.user = { ...this.user, ...updated }; // o merge local si tu API no devuelve todo
        this.editMode = false;
        this.saving = false;
        (await this.toastCtrl.create({
          message: 'Usuario actualizado',
          duration: 1800,
          color: 'success',
        })).present();
      },
      error: async (e) => {
        this.saving = false;
        (await this.toastCtrl.create({
          message: e?.error?.message || 'Error al actualizar',
          duration: 2000,
          color: 'danger',
        })).present();
        console.error('Error updating user:', e);
      },
    });
  }

  addCredits() {
    this.modalCtrl.create({
      component: AddCreditModalComponent,
      componentProps: { user: this.user },
    }).then(modal => {
      modal.present();
      return modal.onDidDismiss();
    }).then(({ role }) => {
      if (role === 'confirm') this.getUser();
    });
  }
}