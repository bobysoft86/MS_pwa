import {
  Component,
  Input,
  OnInit,
  inject,
  computed,
  Signal,
  signal,
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
} from '@ionic/angular/standalone';
import { ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ExercisesService } from 'src/app/services/exercisesService/exercises-service';
import { Exercise } from 'src/app/core/interfaces/exercise.interface';
export type ExerciseFormMode = 'create' | 'edit' | 'view';


export interface TypeOption {
  id: number;
  name: string;
}

@Component({
  selector: 'app-create-edit-detail-exercice',
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
  ],
  templateUrl: './create-edit-detail-exercice.component.html',
  styleUrls: ['./create-edit-detail-exercice.component.scss'],
})
export class CreateEditDetailExerciceComponent implements OnInit {
  @Input() mode: ExerciseFormMode = 'create';

  private fb = inject(FormBuilder);
  private toast = inject(ToastController);
  private route = inject(ActivatedRoute);

  private exercisesService = inject(ExercisesService);
  // Si más adelante tienes un TypesService, cámbialo aquí:
  private typesService = inject(ExercisesService);
  exerciseId: string = '';
  types: TypeOption[] = [];

  imgPreview = signal<string | null>(null);
  videoName = signal<string | null>(null);
  loading = signal(false);

  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    type_id: [null as number | null, [Validators.required]],
  });

  readonly isView: Signal<boolean> = computed(() => this.mode === 'view');

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.exerciseId = params['id'];
      this.mode = this.exerciseId ? 'edit' : 'create';
      if (this.exerciseId) {
        this.exercisesService.getExerciseById(Number(this.exerciseId)).subscribe({
          next: (res) => {
            this.setExercise(res);
          },
          error: async (e) => {
            (
              await this.toast.create({
                message: 'Error cargando ejercicio',
                duration: 2000,
                color: 'danger',
              })
            ).present();
          },
        });
      }
    });
    this.loadTypes();
  }

  exercise: Exercise | null = null;
  private setExercise(ex: Exercise) {
    this.exercise = ex;
    if (this.exercise) {
      // Rellena el formulario con los datos del ejercicio
      // y muestra la imagen y el nombre del video si existen
      this.form.reset(); // Limpia antes de rellenar
      this.form.patchValue({
        title: this.exercise.title,
        type_id: this.exercise.type_id,
      });
      this.imgPreview.set(this.exercise.imgUrl ?? null);
      this.videoName.set(
        this.exercise.videoUrl
          ? this.fileNameFromUrl(this.exercise.videoUrl)
          : null
      );
    }

    if (this.isView()) this.form.disable();
  }

  onImageSelected(ev: Event) {
    const file = (ev.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => this.imgPreview.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  onVideoSelected(ev: Event) {
    const file = (ev.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.videoName.set(file.name);
  }

  submit(ev: Event) {
    if (this.isView()) return;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formEl = ev.target as HTMLFormElement;
    const fd = new FormData(formEl); // ← recoge title, type_id, image, video
    fd.set('title', String(this.form.value.title));
    fd.set('type_id', String(this.form.value.type_id));

    this.loading.set(true);

    if (this.mode === 'edit' && this.exercise?.id) {
      // OJO: ajusta al nombre de tu método real (corrijo el typo)
      this.exercisesService.editExercise(this.exercise.id, fd).subscribe({
        next: async () => {
          (
            await this.toast.create({
              message: 'Ejercicio actualizado',
              duration: 1700,
              color: 'success',
            })
          ).present();
          this.loading.set(false);
        },
        error: async (e) => {
          (
            await this.toast.create({
              message: e?.error?.message || 'Error al actualizar',
              duration: 2000,
              color: 'danger',
            })
          ).present();
          this.loading.set(false);
        },
      });
    } else {
      this.exercisesService.createExercise(fd).subscribe({
        next: async () => {
          (
            await this.toast.create({
              message: 'Ejercicio creado',
              duration: 1700,
              color: 'success',
            })
          ).present();
          this.loading.set(false);
          // this.router.navigateByUrl('/private/backoffice/exercises'); // corrige la ruta si quieres navegar
        },
        error: async (e) => {
          (
            await this.toast.create({
              message: e?.error?.message || 'Error al crear',
              duration: 2000,
              color: 'danger',
            })
          ).present();
          this.loading.set(false);
        },
      });
    }
  }

  private loadTypes() {
    this.typesService.getAllExerciseTypes().subscribe({
      next: (res) => {
        this.types = res;
      },
      error: async () => {
        (
          await this.toast.create({
            message: 'Error cargando tipos',
            duration: 2000,
            color: 'danger',
          })
        ).present();
      },
    });
  }

  private fileNameFromUrl(url: string) {
    try {
      return new URL(url).pathname.split('/').pop() ?? url;
    } catch {
      return url;
    }
  }
}
