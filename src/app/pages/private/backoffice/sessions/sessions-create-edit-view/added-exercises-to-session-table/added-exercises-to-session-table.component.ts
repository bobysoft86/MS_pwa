import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonList, IonItem, IonThumbnail, IonLabel, IonIcon, IonButton, IonReorder, IonReorderGroup } from '@ionic/angular/standalone';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SessionExercise } from 'src/app/core/interfaces/sessions.interface';

@Component({
  selector: 'app-added-exercises-to-session-table',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,           // <- CDK

    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonList, IonItem, IonThumbnail, IonLabel, IonIcon
  ],
  templateUrl: './added-exercises-to-session-table.component.html',
  styleUrls: ['./added-exercises-to-session-table.component.scss'],
})
export class AddedExercisesToSessionTableComponent implements OnInit {
  private _items: SessionExercise[] = [];
    @Output() edit = new EventEmitter<SessionExercise>();
    @Output() delete = new EventEmitter<SessionExercise>();

  

  @Input() set items(value: SessionExercise[]) {
    this._items = (value ?? []).slice()
      .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
  }
  get items() { return this._items; }

  @Output() orderChange = new EventEmitter<Array<{ id: number; order_index: number }>>();

  ngOnInit(): void {}

  trackById = (_: number, it: SessionExercise) => it.id;

  placeholder(img?: string | null) {
    return (img && img.length) ? img : 'assets/img/placeholder.svg';
  }

  drop(ev: CdkDragDrop<SessionExercise[]>) {
    // reordenar array visible
    moveItemInArray(this._items, ev.previousIndex, ev.currentIndex);
    // recalcular order_index (0-based; cambia a +1 si tu API quiere 1-based)
    this._items = this._items.map((it, idx) => ({ ...it, order_index: idx }));
    // payload al padre
    this.orderChange.emit(this._items.map(it => ({ id: it.id, order_index: it.order_index })));
  }
  onEditExerciseSession(sessionExercise:SessionExercise){

    this.edit.emit(sessionExercise);

  }

  onDeleteExerciseSession(sessionExercise:SessionExercise){

    this.delete.emit(sessionExercise);

  }

}