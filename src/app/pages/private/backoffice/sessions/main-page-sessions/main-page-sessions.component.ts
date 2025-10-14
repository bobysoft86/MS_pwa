import { Component, inject, OnInit } from '@angular/core';
import {
  IonButton,
  ModalController,
  NavController,
  ToastController,
} from '@ionic/angular/standalone';
import { SessionsTableComponent } from '../sessions-table/sessions-table.component';
import { SessionsTypesTableComponent } from '../sessions-types-table/sessions-types-table.component';
import {
  Session,
  SessionType,
} from 'src/app/core/interfaces/sessions.interface';
import { CommonModule } from '@angular/common';
import { SessionsService } from 'src/app/services/sessionsService/sessions-service';
import { ConfirmOrDeleteModalComponent } from 'src/app/components/modals/confirm-or-delete-modal/confirm-or-delete-modal.component';

@Component({
  selector: 'app-main-page-sessions',
  standalone: true,
  imports: [
    IonButton,
    SessionsTableComponent,
    SessionsTypesTableComponent,
    CommonModule,
  ],
  templateUrl: './main-page-sessions.component.html',
  styleUrls: ['./main-page-sessions.component.scss'],
})
export class MainPageSessionsComponent implements OnInit {
  public sessions: any[] = [];
  public sessionsTypes: SessionType[] = [];

  private modalCtrl = inject(ModalController);
  private sessionService = inject(SessionsService);
  private navCtrl = inject(NavController);
  private toast = inject(ToastController);

  ngOnInit() {
    this.getTypeSessions();
    this.getSessions();
  }

  getTypeSessions() {
    this.sessionService.getAllSessionsTypes().subscribe({
      next: (res: SessionType[]) => {
        this.sessionsTypes = res;
        console.log(res);
      },
      error: (e: unknown) => {
        console.error('Error fetching types of sessions:', e);
      },
    });
  }

  getSessions() {
    this.sessionService.getAllSessions().subscribe({
      next: (res: any[]) => {
        this.sessions = res;
        console.log(res);
      },
      error: (e: unknown) => {
        console.error('Error fetching sessions:', e);
      },
    });
  }
  onCreateSession() {
    this.navCtrl.navigateForward('/private/backoffice/sessions/create');
  }
  onCreateSessionType() {
    this.navCtrl.navigateForward('/private/backoffice/sessions/types/create');
  }

  onViewSessionType(e: any) {
    this.navCtrl.navigateForward(`/private/backoffice/sessions/types/${e.id}`);
  }

  onViewSession(e: any) {
    this.navCtrl.navigateForward(`/private/backoffice/sessions/${e.id}`);
  }

  async onRemoveSession(e: any) {
    console.log(e)
    try {
      const modal = await this.modalCtrl.create({
        component: ConfirmOrDeleteModalComponent,
        componentProps: {
          message: `¿Seguro que deseas eliminar "${e.title}"?`,
        },
      });

      await modal.present();
      const { role } = await modal.onDidDismiss(); 

      if (role !== 'confirm') return;


      await this.sessionService.deleteSession(e.id).subscribe({
          next: (res: any[]) => {
        this.sessions = res;
        console.log(res);
      },
      error: (e: unknown) => {
        console.error('Error fetching sessions:', e);
      },
      })


      const t = await this.toast.create({
        message: 'Ejercicio eliminado',
        duration: 1600,
        color: 'success',
      });
      await t.present();
    } catch (e: any) {
      const t = await this.toast.create({
        message: e?.error?.message || 'Error al eliminar el ejercicio',
        duration: 2000,
        color: 'danger',
      });
      await t.present();
    } finally {
      this.getTypeSessions();
      this.getSessions();

    }
  }

  async onRemoveSessionType(e: any) {

    console.log(e)
    try {
      const modal = await this.modalCtrl.create({
        component: ConfirmOrDeleteModalComponent,
        componentProps: {
          message: `¿Seguro que deseas eliminar "${e.name}"?`,
        },
      });

      await modal.present();
      const { role } = await modal.onDidDismiss(); 

      if (role !== 'confirm') return;


      await this.sessionService.deleteSessionType(e.id).subscribe({
          next: (res: any[]) => {
        this.sessions = res;
        console.log(res);
      },
      error: (e: unknown) => {
        console.error('Error fetching sessions:', e);
      },
      })


      const t = await this.toast.create({
        message: 'Ejercicio eliminado',
        duration: 1600,
        color: 'success',
      });
      await t.present();
    } catch (e: any) {
      const t = await this.toast.create({
        message: e?.error?.message || 'Error al eliminar el ejercicio',
        duration: 2000,
        color: 'danger',
      });
      await t.present();
    } finally {
      this.getTypeSessions();
      this.getSessions();

    }
  }
}
