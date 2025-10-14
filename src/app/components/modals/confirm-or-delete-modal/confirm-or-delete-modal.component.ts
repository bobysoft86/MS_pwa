import { Component, inject, Input, OnInit } from '@angular/core';
import { ModalController, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonInput, IonItem, IonModal } from '@ionic/angular/standalone';


@Component({
  selector: 'app-confirm-or-delete-modal',
  standalone: true,
  imports: [  IonContent, IonTitle, IonButton, IonToolbar, IonHeader, ],
  templateUrl: './confirm-or-delete-modal.component.html',
  styleUrls: ['./confirm-or-delete-modal.component.scss'],
})
export class ConfirmOrDeleteModalComponent  implements OnInit {

private modalCtrl = inject(ModalController);

@Input() message!: string;

  ngOnInit() {
  console.log(this.message);
  }

  confirm(){
    this.modalCtrl.dismiss(null, 'confirm');
  }
  cancel(){
    this.modalCtrl.dismiss(null, 'cancel');
  }
  
}
