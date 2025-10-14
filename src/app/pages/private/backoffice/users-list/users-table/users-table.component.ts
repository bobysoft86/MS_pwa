import { Component, Input, Output, EventEmitter, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface UserRow {
  id: number;
  email: string;
  name: string;
  credit_balance: number;
  role_id: number;
  role_name: string;
  created_at: string; // ISO
  updated_at: string; // ISO
}

@Component({
  selector: 'app-users-table',
  standalone: true,
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss'],
  imports: [
    CommonModule,
    MatTableModule, MatPaginatorModule, MatSortModule,
    MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule,
  ],
})
export class UsersTableComponent implements OnChanges {
  @Input() users: UserRow[] = [];

  @Output() view = new EventEmitter<UserRow>();
  @Output() remove = new EventEmitter<UserRow>();

  displayedColumns = [
    'id', 'name', 'email', 'role_name', 'credit_balance',  'actions'
  ];

  dataSource = new MatTableDataSource<UserRow>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['users']) {
      this.dataSource = new MatTableDataSource<UserRow>(this.users ?? []);
      // Configurar filtrado para buscar en name/email/role_name
      this.dataSource.filterPredicate = (data, filter) => {
        const f = filter.trim().toLowerCase();
        return (
          data.name?.toLowerCase().includes(f) ||
          data.email?.toLowerCase().includes(f) ||
          data.role_name?.toLowerCase().includes(f)
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

  onView(row: UserRow) { this.view.emit(row); }

  onRemove(row: UserRow) { this.remove.emit(row); }
}