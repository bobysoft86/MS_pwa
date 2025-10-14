import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { IonContent, IonItem, IonLabel, IonInput, IonButton, ModalController, ToastController } from "@ionic/angular/standalone";
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { User } from 'src/app/core/interfaces/user.interface';
import { AddCreditDto, CreditService } from 'src/app/services/creditService/credit.service';
@Component({
  selector: 'app-add-credit-modal',
  standalone: true,
  imports: [IonButton,FormsModule,ReactiveFormsModule, IonInput, IonLabel, IonItem, IonContent,CommonModule],
  templateUrl: './add-credit-modal.component.html',
  styleUrls: ['./add-credit-modal.component.scss'],

})
export class AddCreditModalComponent  implements OnInit {

private modalCtrl = inject(ModalController);
private creditSercive = inject(CreditService);
private toastCtrl = inject(ToastController);
private fb = inject(FormBuilder);

@Input() user!: User;

creditAmount: number = 10;

  ngOnInit() {
  }

  addCredits(){

    let userCreditsDto : AddCreditDto={
      delta : this.creditAmount,
    }

    this.creditSercive.addCredits(this.user?.id, userCreditsDto).subscribe({
      next: (res) => {
        this.toastCtrl.create({
          message: 'Credits added successfully',
          duration: 2000,
          color: 'success',
        }).then(toast => toast.present());
        this.modalCtrl.dismiss(null, 'confirm');
      },
      error: (e) => {
        this.toastCtrl.create({
          message: 'Error adding credits',
          duration: 2000,
          color: 'danger',
        }).then(toast => toast.present());
      },
    });

  }
  closeModal(){
    this.modalCtrl.dismiss();
  }
}
