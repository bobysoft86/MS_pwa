import { Component, Input, Output, EventEmitter, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface ExerciseRow {
  id: number;
  title: string;
  type_name: string;
  imgUrl?: string | null;
  videoUrl?: string | null;
  created_at: string;
}

@Component({
  selector: 'app-exercises-list-table',
  standalone: true,  
  imports: [
    CommonModule,
    MatTableModule, MatPaginatorModule, MatSortModule,
    MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule
  ],
  templateUrl: './exercises-list-table.component.html',
  styleUrls: ['./exercises-list-table.component.scss'],
})
export class ExercisesListTableComponent  implements OnChanges {
  @Input() exercises: ExerciseRow[] = [];
  @Output() view = new EventEmitter<ExerciseRow>();
  @Output() edit = new EventEmitter<ExerciseRow>();
  @Output() remove = new EventEmitter<ExerciseRow>();

  displayedColumns = ['id', 'type_name', 'title', 'imgUrl', 'videoUrl', 'actions'];
  dataSource = new MatTableDataSource<ExerciseRow>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['exercises']) {
      this.dataSource = new MatTableDataSource<ExerciseRow>(this.exercises ?? []);
      this.dataSource.filterPredicate = (data, filter) => {
        const f = filter.trim().toLowerCase();
        return (
          data.title?.toLowerCase().includes(f) ||
          data.type_name?.toLowerCase().includes(f) ||
          String(data.id).includes(f)
        );
      };
      queueMicrotask(() => {
        if (this.paginator) this.dataSource.paginator = this.paginator;
        if (this.sort) this.dataSource.sort = this.sort;
      });
    }
  }

  applyFilter(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  onView(row: ExerciseRow)  { this.view.emit(row); }
  onEdit(row: ExerciseRow)  { this.edit.emit(row); }
  onRemove(row: ExerciseRow){ this.remove.emit(row); }
}