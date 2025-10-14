import { Component, inject, OnInit } from '@angular/core';
import { ExercisesListTableComponent } from './exercises-list-table/exercises-list-table.component';
import { ExercisesTypesListTableComponent } from './exercises-types-list-table/exercises-types-list-table.component';
import { ExercisesService } from 'src/app/services/exercisesService/exercises-service';
import { IonButton, NavController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-exercises-mainpage',
  templateUrl: './exercises-mainpage.component.html',
  styleUrls: ['./exercises-mainpage.component.scss'],
  imports: [
    ExercisesListTableComponent,
    ExercisesTypesListTableComponent,
    IonButton,
  ],
})
export class ExercisesMainpageComponent implements OnInit {
  exercises: any[] = [];
  exercisesTypes: any[] = [];

  private exerciseService = inject(ExercisesService);
  private navCtrl = inject(NavController);

  ngOnInit() {
    this.getAllExercises();
    this.getAllTypesExercises();
  }

  getAllExercises() {
    this.exerciseService.getAllExercises().subscribe({
      next: (res) => {
        this.exercises = res;
        console.log(res);
      },
      error: (e) => {
        console.error('Error fetching exercises:', e);
      },
    });
  }

  getAllTypesExercises() {
    this.exerciseService.getAllExerciseTypes().subscribe({
      next: (res) => {
        this.exercisesTypes = res;
        console.log(res);
      },
      error: (e) => {
        console.error('Error fetching types of exercises:', e);
      },
    });
  }

  onCreateType() {
this.navCtrl.navigateForward('/private/backoffice/exercices/types/create');
  }
  onCreateExercise() {
    this.navCtrl.navigateForward('/private/backoffice/exercices/create');
  }
  onViewType(u: any) {
    this.navCtrl.navigateForward(`/private/backoffice/exercices/types/${u.id}`);
  }
  onRemoveType(u: any) {
    console.log('eliminar', u);
  }
  onViewExercise(u: any) {
    this.navCtrl.navigateForward(`/private/backoffice/exercices/detail/${u.id}`);
  }
  onRemoveExercise(u: any) {
    console.log('eliminar', u);
  }
}
