import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonContent, IonItem, IonLabel, IonInput, IonButton, IonText
} from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular/standalone';
import { SessionExercise } from 'src/app/core/interfaces/sessions.interface';

@Component({
  selector: 'app-edit-exercise-session-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,
    IonContent, IonItem, IonLabel, IonInput, IonButton, IonText],  
    templateUrl: './edit-exercise-session-modal.component.html',
  styleUrls: ['./edit-exercise-session-modal.component.scss'],
})
export class EditExerciseSessionModalComponent {
  private fb = inject(FormBuilder);
  private modalCtrl = inject(ModalController);

  /** Ejercicio de sesión a editar (link en tabla session_exercises) */
  @Input() item!: SessionExercise;

  form = this.fb.group({
    weight: [null as string | null, [Validators.min(0)]],
    reps:   [null as number | null, [Validators.min(0), Validators.max(9999)]],
  });

  ngOnInit() {
    if (this.item) {
      console.log(this.item)
      this.form.patchValue({
        weight: this.item.weight ?? null,
        reps: this.item.reps ?? null,
      });
    }
  }

  cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    // Normaliza a número o null
    const w = this.form.value.weight;
    const r = this.form.value.reps;
    const payload = {
      id: this.item.id,
      weight: w,
      reps:   r,
    };
    this.modalCtrl.dismiss(payload, 'confirm');
  }
}