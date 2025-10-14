import { Component, inject, OnInit } from '@angular/core';
import {
  IonApp, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList,
  IonItem, IonIcon, IonLabel, IonButtons, IonMenuButton, IonMenuToggle,
  NavController
} from '@ionic/angular/standalone';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from 'src/app/services/userService/user-service';


@Component({
  selector: 'app-backoffice',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    IonApp, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonIcon, IonLabel, IonButtons, IonMenuButton, IonMenuToggle
  ], 
   templateUrl: './backoffice.component.html',
  styleUrls: ['./backoffice.component.scss'],
})
export class BackofficeComponent  implements OnInit {
    
  private userService = inject(UserService);
  private navCtrl = inject(NavController);

  logout() {
    this.userService.logout();
   this.navCtrl.navigateForward('/public/login');
  }

  goToUsers(){
    this.navCtrl.navigateForward('/private/backoffice/users');
  }

  goToHome() {
    this.navCtrl.navigateForward('/private/backoffice/home');
  }

  goToExercices() {
    this.navCtrl.navigateForward('/private/backoffice/exercices');
  }

  goToSessions() {
    this.navCtrl.navigateForward('/private/backoffice/sessions');
  }

  ngOnInit() {}

}
