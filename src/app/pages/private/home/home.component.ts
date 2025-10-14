import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonIcon, IonButtons, IonButton, NavController } from "@ionic/angular/standalone";
import { UserService } from 'src/app/services/userService/user-service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [IonButton, IonButtons, IonIcon, IonTitle, IonToolbar, IonContent, IonHeader,CommonModule],
})
export class HomeComponent  implements OnInit {
user!: any;

private userService = inject(UserService);
private navCtrl = inject(NavController);


  ngOnInit() {
    this.user = this.userService.getStoredUser();
    console.log(this.user);
  }

goToBackoffice(){
this.navCtrl.navigateForward('/private/backoffice');
}
whatsContact(){
location.href ="https://wa.me/34628002164";
}
}
