import { Component, Input, Output, EventEmitter, ViewChild, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface SessionRow {
  id: number;
  title: string;
  type_name?: string | null;
  notes?: string | null;
}

@Component({
  selector: 'app-sessions-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './sessions-table.component.html',
  styleUrls: ['./sessions-table.component.scss'],
})
export class SessionsTableComponent implements OnInit, OnChanges {
  @Input() sessions: SessionRow[] = [];

  @Output() view = new EventEmitter<SessionRow>();
  @Output() edit = new EventEmitter<SessionRow>();
  @Output() delete = new EventEmitter<SessionRow>();

  displayedColumns: string[] = ['id', 'title', 'type_name', 'notes', 'actions'];
  dataSource = new MatTableDataSource<SessionRow>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.sessions);
  }

  ngOnChanges() {
    this.dataSource.data = this.sessions ?? [];
    if (this.paginator) this.dataSource.paginator = this.paginator;
    if (this.sort) this.dataSource.sort = this.sort;
  }

  onView(row: SessionRow)  { this.view.emit(row); }
  onEdit(row: SessionRow)  {
    this.edit.emit(row);
     }
  onDelete(row: SessionRow){

    
    this.delete.emit(row); }

  applyFilter(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();
  }
}