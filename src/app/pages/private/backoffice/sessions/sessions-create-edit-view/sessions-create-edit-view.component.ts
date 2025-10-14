import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
  Signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonText,
  IonTextarea,
  NavController,
  ModalController,
} from '@ionic/angular/standalone';
import { ToastController } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { SessionsService } from 'src/app/services/sessionsService/sessions-service';
import {
  Session,
  SessionExercise,
  SessionType,
} from 'src/app/core/interfaces/sessions.interface';
import { combineLatest, map, distinctUntilChanged } from 'rxjs';
import { AddedExercisesToSessionTableComponent } from './added-exercises-to-session-table/added-exercises-to-session-table.component';
import { AddExerciseToSessionModalComponent } from 'src/app/components/modals/add-exercise-to-session-modal/add-exercise-to-session-modal.component';
import { EditExerciseSessionModalComponent } from 'src/app/components/modals/edit-exercise-session-modal/edit-exercise-session-modal.component';
import { ConfirmOrDeleteModalComponent } from 'src/app/components/modals/confirm-or-delete-modal/confirm-or-delete-modal.component';

export type SessionFormMode = 'create' | 'edit' | 'view';

@Component({
  selector: 'app-sessions-create-edit-view',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonText,
    IonTextarea,
    AddedExercisesToSessionTableComponent,
  ],
  templateUrl: './sessions-create-edit-view.component.html',
  styleUrls: ['./sessions-create-edit-view.component.scss'],
})
export class SessionsCreateEditViewComponent implements OnInit {
  private fb = inject(FormBuilder);
  private toast = inject(ToastController);
  private route = inject(ActivatedRoute);
  private navCtrl = inject(NavController);
  private sessionsService = inject(SessionsService);
  private modalCtrl = inject(ModalController);

  mode = signal<SessionFormMode>('create');
  sessionId: number | null = null;
  sessionExercises: SessionExercise[] | null = null;
  loading = signal(false);
  types: SessionType[] = [];

  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    type_id: [null as number | null, [Validators.required]],
    notes: [''],
    restTime: [0, [Validators.min(0)]],
  });

  readonly isView: Signal<boolean> = computed(() => this.mode() === 'view');

  ngOnInit() {
    this.loadTypes();
    combineLatest([this.route.paramMap, this.route.queryParamMap])
      .pipe(
        map(([pm, qp]) => {
          const idStr = pm.get('id');
          const idNum = idStr ? Number(idStr) : null;
          const view = qp.get('view') === 'true';
          const nextMode: SessionFormMode = view
            ? 'view'
            : idNum
            ? 'edit'
            : 'create';
          return {
            id: Number.isFinite(idNum as number) ? idNum : null,
            nextMode,
          };
        }),
        distinctUntilChanged(
          (a, b) => a.id === b.id && a.nextMode === b.nextMode
        )
      )
      .subscribe(({ id, nextMode }) => {
        this.sessionId = id;
        this.mode.set(nextMode);

        this.isView() ? this.form.disable() : this.form.enable();

        if (this.sessionId) this.loadSession(this.sessionId);
        else this.form.reset();
      });
  }

  private loadTypes() {
    this.sessionsService.getAllSessionsTypes().subscribe({
      next: (rows: SessionType[]) => (this.types = rows || []),
      error: async () =>
        (
          await this.toast.create({
            message: 'Error cargando tipos',
            duration: 2000,
            color: 'danger',
          })
        ).present(),
    });
  }

  private loadSession(id: number) {
    this.loading.set(true);
    this.sessionsService.getSessionById(id).subscribe({
      next: async (s: Session) => {
        this.sessionExercises = s.exercises || [];
        this.form.reset({
          title: s.title ?? '',
          type_id: s.type_id ?? null,
          notes: s.notes ?? '',
          restTime: s.restTime ?? null,
        });
        this.loading.set(false);
      },
      error: async () => {
        (
          await this.toast.create({
            message: 'Error cargando sesión',
            duration: 2000,
            color: 'danger',
          })
        ).present();
        this.loading.set(false);
      },
    });
  }

async submit() {
  if (this.isView()) return;

  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  this.loading.set(true);

  // Normaliza valores
  const title    = (this.form.value.title ?? '').toString().trim();
  const notes    = (this.form.value.notes ?? '').toString().trim();
  const type_id  = Number(this.form.value.type_id);
  const restTime = this.form.value.restTime === null || this.form.value.restTime === undefined
    ? undefined
    : Number(this.form.value.restTime);

  if (this.mode() === 'edit' && this.sessionId) {
    // Payload parcial: no mandes '' ni nulls innecesarios
    const payload: any = {};
    if (title !== '')   payload.title = title;          // si quieres permitir vaciar title, quita esta línea y manda title tal cual
    if (notes !== '')   payload.notes = notes;
    if (!Number.isNaN(type_id))  payload.type_id = type_id;
    if (restTime !== undefined && !Number.isNaN(restTime)) payload.restTime = restTime;

    // Evitar NO_FIELDS si nada cambió:
    if (Object.keys(payload).length === 0) {
      this.loading.set(false);
      return;
    }

    this.sessionsService.editSession(this.sessionId, payload).subscribe({
      next: async () => { this.loading.set(false); },
      error: async () => { this.loading.set(false); }
    });

  } else {

    if (!title) {
      this.loading.set(false);
      return;
    }

    const payload = {
      title,
      type_id: Number.isNaN(type_id) ? undefined : type_id,
      notes: notes || undefined,
      restTime: (restTime === undefined || Number.isNaN(restTime)) ? undefined : restTime,
    };

    this.sessionsService.createSession(payload).subscribe({
      next: async (res) => { this.loading.set(false);
        console.log(res)
        this.navCtrl.navigateForward(`/private/backoffice/sessions/${res.id}`)

       },
      error: async () => { this.loading.set(false); }
    });
  }
}
  onSaveNewOrder(list: Array<{ id: number; order_index: number }>) {
     this.sessionsService.reorderExercisesMap(this.sessionId!, list).subscribe()
    console.log('Nuevo orden recibido:', list);
  }

  goToMainSessions() {
    this.navCtrl.navigateBack('/private/backoffice/sessions');
  }
  async addExerciseToSession() {
  if (!this.sessionId) return;

  try {
    const modal = await this.modalCtrl.create({
      component: AddExerciseToSessionModalComponent,
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss<any>();
    if (role !== 'confirm' || !data) return; // usuario canceló

    // llamada a la API para añadir el ejercicio a la sesión
    this.sessionsService.addExerciseToSession(this.sessionId, {
      exercise_id: data.exercise_id,
      weight: data.weight,
      reps: data.reps,
      // si tu API requiere order_index cuando se añade, podrías pasarlo aquí
      // order_index: (this.currentExercises?.length ?? 0)
    }).subscribe({
      next: async () => {
        await (await this.toast.create({
          message: 'Ejercicio añadido a la sesión',
          duration: 1600,
          color: 'success',
        })).present();

        // recarga sólo si todo fue bien
        this.loadSession(this.sessionId!);
      },
      error: async (e) => {
        await (await this.toast.create({
          message: e?.error?.message || 'Error al añadir ejercicio',
          duration: 2000,
          color: 'danger',
        })).present();
      }
    });

  } catch (e) {
    await (await this.toast.create({
      message: 'No se pudo abrir el modal',
      duration: 1800,
      color: 'danger',
    })).present();
    console.error(e);
  }
}
async onEditExerciseSession(item:any){

 try {
    const modal = await this.modalCtrl.create({
      component: EditExerciseSessionModalComponent,
      componentProps:{item:item}
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss<any>();
    if (role !== 'confirm' || !data) return; 
    this.sessionsService.editExerciseSession(this.sessionId!,data).subscribe({
      next: async () => {
        await (await this.toast.create({
          message: 'datos actualizados',
          duration: 1600,
          color: 'success',
        })).present();

        this.loadSession(this.sessionId!);
      },
      error: async (e) => {
        await (await this.toast.create({
          message: e?.error?.message || 'Error al actualizar datos ',
          duration: 2000,
          color: 'danger',
        })).present();
      }
    })


  } catch (e) {
    await (await this.toast.create({
      message: 'No se pudo abrir el modal',
      duration: 1800,
      color: 'danger',
    })).present();
    console.error(e);
  }
}
async onDeleteExerciseSession(item: SessionExercise) {
  try {
    const modal = await this.modalCtrl.create({
      component: ConfirmOrDeleteModalComponent,
      componentProps: {
        message: `¿Seguro que deseas eliminar "${item.exercise?.title ?? 'este ejercicio'}" de la sesión?`,
      },
    });

    await modal.present();
    const { role } = await modal.onDidDismiss(); // onDidDismiss => el role ya está definitivo

    if (role !== 'confirm') return;

    // marca en progreso para esa fila

    // OJO: ajusta a tu servicio: normalmente necesita (sessionId, sessionExerciseId)
    await this.sessionsService
      .deleteExerciseSession(this.sessionId!, item.id) // <-- si tu método acepta id directo
      .toPromise();

    this.loadSession(this.sessionId!);

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

  }
}
}
