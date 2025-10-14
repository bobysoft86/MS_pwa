import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { Exercise } from 'src/app/core/interfaces/exercise.interface';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ExercisesService {

  private http = inject(HttpClient);

  private apiUrl = environment.apiUrl;

  private _refreshNeeded$ = new BehaviorSubject<void>(undefined);
  get refreshNeeded$() {
    return this._refreshNeeded$;
  }

  getAllExercises() {
    return this.http.get<any[]>(`${this.apiUrl}/exercises`).pipe(
      map(exercises => exercises.map(exercise => ({
        ...exercise,
        createdAt: new Date(exercise.createdAt),
        updatedAt: new Date(exercise.updatedAt),
      })))
    );
  }

  getAllExerciseTypes() {
    return this.http.get<any[]>(`${this.apiUrl}/exercise-types`).pipe(
      map(exerciseTypes => exerciseTypes.map(exerciseType => ({
        ...exerciseType,
        createdAt: new Date(exerciseType.createdAt),
        updatedAt: new Date(exerciseType.updatedAt),
      })))
    );
  }

    createExercise(payload: FormData): Observable<Exercise> {
    return this.http.post<Exercise>(`${this.apiUrl}/exercises`, payload);
  }


  editExercise(id: number, payload: FormData): Observable<Exercise> {
    return this.http.put<Exercise>(`${this.apiUrl}/exercises/${id}`, payload);
  }

  deleteExercise(exerciseId: number) {
    return this.http.delete<any>(`${this.apiUrl}/exercises/${exerciseId}`).pipe(
      tap(() => {
        this._refreshNeeded$.next();
      })
    );
  }

  getExerciseById(exerciseId: number): Observable<Exercise> {
    return this.http.get<Exercise>(`${this.apiUrl}/exercises/${exerciseId}`).pipe(
      map(exercise => ({
        ...exercise,

      }))
    );
  } 

  createExerciseType(payload: { name: string; description: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/exercise-types`, payload).pipe(
      tap(() => {
        this._refreshNeeded$.next();
      })
    );
  }

  updateExerciseType(id: number, payload: { name: string; description: string }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/exercise-types/${id}`, payload).pipe(
      tap(() => {
        this._refreshNeeded$.next();
      })
    );
  }
  getTypeById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/exercise-types/${id}`);
  }

  deleteExerciseType(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/exercise-types/${id}`).pipe(
      tap(() => {
        this._refreshNeeded$.next();
      })
    );
  }
}