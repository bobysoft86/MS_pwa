import { Component, inject, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/userService/user-service';
import { UsersTableComponent } from "./users-table/users-table.component";
import { IonContent, ModalController, ToastController, IonButton, NavController } from "@ionic/angular/standalone";
import { ConfirmOrDeleteModalComponent } from 'src/app/components/modals/confirm-or-delete-modal/confirm-or-delete-modal.component';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [IonButton,  UsersTableComponent, IonContent],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent  implements OnInit {

  users: any[] = [];
  private userService = inject(UserService);
  private modalCtrl = inject(ModalController);
  private toastCtrl = inject(ToastController);
  private navCtrl = inject(NavController);

  

  ngOnInit() {
  this.getAllUsers();
  }

  getAllUsers(){
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        console.log(users);
      },
      error: (e) => {
        console.log(e);
      },
    });
  }

async onRemove(u: any){
  const message = `Estas seguro que quieres eliminar este a ${u.name}?`;
    const modal = await this.modalCtrl.create({
      component: ConfirmOrDeleteModalComponent,
      componentProps: { message },

    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.userService.deleteUser(u.id).subscribe({
        next: () => {
          this.toastCtrl.create({
            message: 'User deleted successfully',
            duration: 2000,
            color: 'success',
          }).then(toast => toast.present());
          this.getAllUsers();
        },
        error: (e) => {
          this.toastCtrl.create({
            message: 'Error deleting user',
            duration: 2000,
            color: 'danger',
          }).then(toast => toast.present());
          console.error('Error deleting user:', e);
        },
      });
      console.log('Confirmed');
    }
  
   }
  onView(u: any)  {
    this.navCtrl.navigateForward(`/private/backoffice/users/detail/${u.id}`);
   }

   onCreate() {
    this.navCtrl.navigateForward('/private/backoffice/users/create');
    console.log('crear nuevo usuario');
   }
}
