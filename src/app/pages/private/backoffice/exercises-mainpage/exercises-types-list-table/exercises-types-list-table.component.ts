import { Component, Input, Output, EventEmitter, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface TypeRow {
  id: number;
  name: string;
  description: string;
}

@Component({
  selector: 'app-exercises-types-list-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule, MatPaginatorModule, MatSortModule,
    MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule
  ],
  templateUrl: './exercises-types-list-table.component.html',
  styleUrls: ['./exercises-types-list-table.component.scss'],
})
export class ExercisesTypesListTableComponent implements OnChanges {
  @Input() items: TypeRow[] = [];
  @Output() view = new EventEmitter<TypeRow>();
  @Output() edit = new EventEmitter<TypeRow>();
  @Output() remove = new EventEmitter<TypeRow>();

  displayedColumns = ['id', 'name', 'description', 'actions'];
  dataSource = new MatTableDataSource<TypeRow>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items']) {
      this.dataSource = new MatTableDataSource<TypeRow>(this.items ?? []);
      this.dataSource.filterPredicate = (data, filter) => {
        const f = filter.trim().toLowerCase();
        return (
          data.name?.toLowerCase().includes(f) ||
          data.description?.toLowerCase().includes(f) ||
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
    this.dataSource.paginator?.firstPage();
  }

  onView(row: TypeRow)  { this.view.emit(row); }
  onEdit(row: TypeRow)  { this.edit.emit(row); }
  onRemove(row: TypeRow){ this.remove.emit(row); }
}