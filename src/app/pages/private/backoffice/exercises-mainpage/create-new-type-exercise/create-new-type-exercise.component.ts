import { Component, OnInit, inject, signal, computed, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonContent, IonItem, IonLabel, IonInput, IonTextarea, IonButton, IonText
} from '@ionic/angular/standalone';
import { ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ExerciseType } from 'src/app/core/interfaces/exercise.interface';
import { ExercisesService } from 'src/app/services/exercisesService/exercises-service';

export type TypeFormMode = 'create' | 'edit' | 'view';

@Component({
  selector: 'app-create-new-type-exercise',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonButton,
    IonText
  ],
  templateUrl: './create-new-type-exercise.component.html',
  styleUrls: ['./create-new-type-exercise.component.scss'],
})
export class CreateNewTypeExerciseComponent  implements OnInit {
  private fb = inject(FormBuilder);
  private toast = inject(ToastController);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // TODO: cambia por tu servicio real e inyéctalo
  private exerciseService = inject(ExercisesService);

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
      const idParam = pm.get('id');
      this.typeId = idParam ? Number(idParam) : null;
    });

    this.route.queryParamMap.subscribe(qp => {
      const view = qp.get('view');
      if (view === 'true') this.mode.set('view');
      else this.mode.set(this.typeId ? 'edit' : 'create');
      if (this.isView()) this.form.disable(); else this.form.enable();
    });

    if (this.typeId) this.loadType(this.typeId);
  }

  private loadType(id: number) {
    this.loading.set(true);
    this.exerciseService.getTypeById(id).subscribe({
      next: async (res: ExerciseType) => {
        this.form.reset();
        this.form.patchValue({
          name: res.name,
          description: res.description,
        });
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
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    const payload = {
      name: this.form.value.name!,
      description: this.form.value.description!,
    };

    if (this.mode() === 'edit' && this.typeId) {
      this.exerciseService.updateExerciseType(this.typeId, payload).subscribe({
        next: async () => {
          (await this.toast.create({ message: 'Tipo actualizado', duration: 1700, color: 'success' })).present();
          this.loading.set(false);
        },
        error: async (e: any) => {
          (await this.toast.create({ message: e?.error?.message || 'Error al actualizar', duration: 2000, color: 'danger' })).present();
          this.loading.set(false);
        }
      });
    } else {
      this.exerciseService.createExerciseType(payload).subscribe({
        next: async () => {
          (await this.toast.create({ message: 'Tipo creado', duration: 1700, color: 'success' })).present();
          this.loading.set(false);
          // this.router.navigateByUrl('/private/backoffice/exercise-types');
        },
        error: async (e: any) => {
          (await this.toast.create({ message: e?.error?.message || 'Error al crear', duration: 2000, color: 'danger' })).present();
          this.loading.set(false);
        }
      });
    }
  }
}