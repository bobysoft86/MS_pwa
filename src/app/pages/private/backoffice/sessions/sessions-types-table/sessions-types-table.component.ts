import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SessionType } from 'src/app/core/interfaces/sessions.interface';

export interface TypeRow {
  id: number;
  name: string;
  description: string;
}

@Component({
  selector: 'app-sessions-types-table',
  standalone: true,
 imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
  ],  templateUrl: './sessions-types-table.component.html',
  styleUrls: ['./sessions-types-table.component.scss'],
})


export class SessionsTypesTableComponent  implements OnInit {
  @Input() sessionsTypes: SessionType[] = [];
  @Output() view = new EventEmitter<SessionType>();
  @Output() delete = new EventEmitter<SessionType>();

  displayedColumns: string[] = ['id', 'name', 'description', 'actions'];
  dataSource = new MatTableDataSource<SessionType>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.sessionsTypes);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges() {
    this.dataSource.data = this.sessionsTypes;
  }

  onView(row: SessionType) {
    this.view.emit(row);
  }

  onRemove(row: SessionType) {
    this.delete.emit(row);
  }
}