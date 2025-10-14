import { Component, OnInit, inject, signal, computed, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonItem, IonLabel, IonInput, IonTextarea, IonButton, IonText, NavController } from '@ionic/angular/standalone';
import { ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionsService } from 'src/app/services/sessionsService/sessions-service';

export type TypeFormMode = 'create' | 'edit' | 'view';

export interface SessionType {
  id?: number;
  name: string;
  description: string;
}


@Component({
  selector: 'app-sessions-type-create-edit-view',
   standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonContent, IonItem, IonLabel, IonInput, IonTextarea, IonButton, IonText],
  templateUrl: './sessions-type-create-edit-view.component.html',
  styleUrls: ['./sessions-type-create-edit-view.component.scss'],
})
export class SessionsTypeCreateEditViewComponent  implements OnInit {
 private fb = inject(FormBuilder);
  private toast = inject(ToastController);
  private route = inject(ActivatedRoute);
  private navCtrl = inject(NavController)

  private typesService = inject(SessionsService);

  mode = signal<TypeFormMode>('create');
  typeId: number | null = null;
  loading = signal(false);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(3)]],
  });

  readonly isView: Signal<boolean> = computed(() => this.mode() === 'view');

  ngOnInit() {
    this.route.paramMap.subscribe(pm => {
      const id = pm.get('id');
      this.typeId = id ? Number(id) : null;
    });
    this.route.queryParamMap.subscribe(qp => {
      const isView = qp.get('view') === 'true';
      this.mode.set(isView ? 'view' : (this.typeId ? 'edit' : 'create'));
      this.isView() ? this.form.disable() : this.form.enable();
    });

    if (this.typeId) this.loadType(this.typeId);
  }

  private loadType(id: number) {
    this.loading.set(true);
    this.typesService.getsessionTypeById(id).subscribe({
      next: async (res: SessionType) => {
        this.form.reset();
        this.form.patchValue({ name: res.name, description: res.description });
        this.loading.set(false);
      },
      error: async () => {
        (await this.toast.create({ message: 'Error cargando el tipo', duration: 2000, color: 'danger' })).present();
        this.loading.set(false);
      }
    });
  }

  async submit() {
    if (this.isView()) return;
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.loading.set(true);
    const payload: SessionType = {
      name: this.form.value.name!, description: this.form.value.description!,
    };

    if (this.mode() === 'edit' && this.typeId) {
      this.typesService.updateSessionType(this.typeId, payload).subscribe({
        next: async () => {
          (await this.toast.create({ message: 'Tipo de sesión actualizado', duration: 1600, color: 'success' })).present();
          this.loading.set(false);
        },
        error: async (e: any) => {
          (await this.toast.create({ message: e?.error?.message || 'Error al actualizar', duration: 2000, color: 'danger' })).present();
          this.loading.set(false);
        }
      });
    } else {
      this.typesService.createSessionType(payload).subscribe({
        next: async () => {
          (await this.toast.create({ message: 'Tipo de sesión creado', duration: 1600, color: 'success' })).present();
          this.loading.set(false);
          // this.router.navigateByUrl('/private/backoffice/session-types');
        },
        error: async (e: any) => {
          (await this.toast.create({ message: e?.error?.message || 'Error al crear', duration: 2000, color: 'danger' })).present();
          this.loading.set(false);
        }
      });
    }
  }
  goBack(){
    this.navCtrl.back()
  }
}