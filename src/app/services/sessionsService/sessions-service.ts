import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { Session } from 'src/app/core/interfaces/sessions.interface';
import { environment } from 'src/environments/environment';

 interface addedExerciseDto {
  exercise_id: number;
  weight:string;
  reps:number;
}

@Injectable({ providedIn: 'root' })
export class SessionsService {

  private http = inject(HttpClient);

  private apiUrl = environment.apiUrl;

  private _refreshNeeded$ = new BehaviorSubject<void>(undefined);
  get refreshNeeded$() {
    return this._refreshNeeded$;
  }

  getAllSessions() {
    return this.http.get<any[]>(`${this.apiUrl}/sessions`).pipe(
      map(sessions => sessions.map(session => ({
        ...session,
        createdAt: new Date(session.createdAt),
        updatedAt: new Date(session.updatedAt),
      })))
    );
  }

  getAllSessionsTypes() {
    return this.http.get<any[]>(`${this.apiUrl}/session-types`).pipe(
      map(sessionTypes => sessionTypes.map(sessionType => ({
        ...sessionType,
        createdAt: new Date(sessionType.createdAt),
        updatedAt: new Date(sessionType.updatedAt),
      })))
    );
  }

    createSession(payload: Session): Observable<Session> {
    return this.http.post<Session>(`${this.apiUrl}/sessions`, payload);
  }


  editSession(id: number, payload: Session): Observable<Session> {
    return this.http.put<Session>(`${this.apiUrl}/sessions/${id}`, payload);
  }

  deleteSession(sessionId: any) {
    return this.http.delete<any>(`${this.apiUrl}/sessions/${sessionId}`).pipe(
      tap(() => {
        this._refreshNeeded$.next();
      })
    );
  }

  getSessionById(sessionId: number): Observable<Session> {
    return this.http.get<Session>(`${this.apiUrl}/sessions/${sessionId}`).pipe(
      map(session => ({
        ...session,
      }))
    );
  } 

  createSessionType(payload: { name: string; description: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/session-types`, payload).pipe(
      tap(() => {
        this._refreshNeeded$.next();
      })
    );
  }

  updateSessionType(id: number, payload: { name: string; description: string }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/session-types/${id}`, payload).pipe(
      tap(() => {
        this._refreshNeeded$.next();
      })
    );
  }
  getsessionTypeById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/session-types/${id}`);
  }

  deleteSessionType(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/session-types/${id}`).pipe(
      tap(() => {
        this._refreshNeeded$.next();
      })
    );
  }

  addExerciseToSession(sessionId: number, data: addedExerciseDto): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/sessions/${sessionId}/exercises`, data).pipe(
      tap(() => {
        this._refreshNeeded$.next();
      })
    );
  }

  reorderExercisesMap(sessionId:number, data:any):Observable<any>{
    return this.http.put<any>(`${this.apiUrl}/sessions//exercises/reorder-map/${sessionId}`, data).pipe(
      tap(() => {
        this._refreshNeeded$.next();
      })
    );
  }
  editExerciseSession(sessionId:number, data:any):Observable<any>{
    return this.http.put<any>(`${this.apiUrl}/sessions/${sessionId}/exercises/${data.id}`, data).pipe(
      tap(() => {
        this._refreshNeeded$.next();
      })
    );
  }

  deleteExerciseSession(sessionId:number, sessionExerciseId:any):Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}/sessions/${sessionId}/exercises/${sessionExerciseId}`).pipe(
      tap(() => {
        this._refreshNeeded$.next();
      })
    );
  }
}