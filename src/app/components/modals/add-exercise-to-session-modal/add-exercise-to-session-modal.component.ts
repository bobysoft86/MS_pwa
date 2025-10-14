import {
  Component,
  OnDestroy,
  OnInit,
  inject,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonSearchbar,
  IonList,
  IonItem,
  IonThumbnail,
  IonLabel,
  ModalController
} from '@ionic/angular/standalone';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {

  ToastController,
  AlertController,
} from '@ionic/angular';
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  Subscription,
} from 'rxjs';
import { ExercisesService } from 'src/app/services/exercisesService/exercises-service';

export interface ExerciseRow {
  id: number;
  title: string;
  imgUrl?: string | null;
  type_name?: string | null;
}

@Component({
  selector: 'app-add-exercise-to-session-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonSearchbar,
    IonList,
    IonItem,
    IonThumbnail,
    IonLabel,
  ],
  templateUrl: './add-exercise-to-session-modal.component.html',
  styleUrls: ['./add-exercise-to-session-modal.component.scss'],
})
export class AddExerciseToSessionModalComponent implements OnInit, OnDestroy {
  private exercisesService = inject(ExercisesService);
  private modalCtrl = inject(ModalController);
  private toast = inject(ToastController);
  private alert = inject(AlertController);

  // estado
  loading = signal(false);
  allRows = signal<ExerciseRow[]>([]);

  // buscador
  search = new FormControl<string>('', { nonNullable: true });
  sub?: Subscription;

  // lista filtrada (front) por título
  filtered = computed(() => {
    const q = (this.search.value || '').trim().toLowerCase();
    if (!q) return this.allRows();
    return this.allRows().filter((r) =>
      (r.title || '').toLowerCase().includes(q)
    );
  });

  ngOnInit(): void {
    // 1) carga completa una vez
    this.loadAll();

    // 2) sólo para re-render con debounce suave (ya usamos computed para filtrar)
    this.sub = this.search.valueChanges
      .pipe(
        startWith(this.search.value),
        debounceTime(200),
        distinctUntilChanged()
      )
      .subscribe(() => {
        /* trigger UI */
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private loadAll() {
    this.loading.set(true);
    // 👇 usa tu método real: getAllExercices()
    this.exercisesService.getAllExercises().subscribe({
      next: (rows: any[]) => {
        this.allRows.set(
          (rows || []).map((r) => ({
            id: r.id,
            title: r.title,
            imgUrl: r.imgUrl ?? null,
            type_name: r.type_name ?? null,
          }))
        );
        this.loading.set(false);
      },
      error: async () => {
        (
          await this.toast.create({
            message: 'Error cargando ejercicios',
            duration: 1800,
            color: 'danger',
          })
        ).present();
        this.loading.set(false);
      },
    });
  }

  imgPlaceholder(src?: string | null) {
    return src && src.length ? src : 'assets/img/placeholder.svg';
  }

  close() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  async onAdd(row: ExerciseRow) {
    const alert = await this.alert.create({
      header: row.title,
      subHeader: 'Añadir a la sesión',
      inputs: [
        {
          name: 'weight',
          type: 'number',
          placeholder: 'Peso (kg)',
          attributes: { min: 0, step: 0.5 },
        },
        {
          name: 'reps',
          type: 'number',
          placeholder: 'Repeticiones',
          attributes: { min: 1, step: 1 },
        },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Añadir',
          role: 'confirm',
          handler: (data: any) => {
            const weight = Number(data?.weight ?? 0);
            const reps = Number(data?.reps ?? 0);
            if (
              Number.isNaN(weight) ||
              weight < 0 ||
              Number.isNaN(reps) ||
              reps <= 0
            ) {
              this.toast
                .create({
                  message:
                    'Introduce un peso válido (≥ 0) y repeticiones (≥ 1).',
                  duration: 1800,
                  color: 'warning',
                })
                .then((t) => t.present());
              return false;
            }
            this.modalCtrl.dismiss(
              { exercise_id: row.id, title: row.title, weight, reps },
              'confirm'
            );
            return true;
          },
        },
      ],
    });
    await alert.present();
  }
}
