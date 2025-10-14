import { Component, Input, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ToastController } from '@ionic/angular'; // ✅ controllers desde @ionic/angular
import { CreditService } from 'src/app/services/creditService/credit.service';

export interface CreditItem {
  id: number;
  delta: number;
  reason: string | null;
  reference_type: string | null;
  reference_id: number | null;
  created_by: number | null;
  metadata: any | null;
  created_at: string; // ISO
}

export interface CreditsHistoryResponse {
  user_id: number;
  items: CreditItem[];
  total: number;
  limit: number;
  offset: number;
}

@Component({
  selector: 'app-historic-credits-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule, MatPaginatorModule, MatSortModule,
    MatFormFieldModule, MatInputModule, MatIconModule
  ],
  templateUrl: './historic-credits-table.component.html',
  styleUrls: ['./historic-credits-table.component.scss'],
})
export class HistoricCreditsTableComponent implements OnInit {
  private creditService = inject(CreditService);
  private toastCtrl = inject(ToastController);

  @Input() userId?: number;

  displayedColumns = ['id', 'delta', 'reason', 'created_by', 'reference', 'created_at'];
  dataSource = new MatTableDataSource<CreditItem>([]);
  totalItems = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.getData();
  }

  getData() {
    if (this.userId == null) {
      this.toast('User ID is not defined', 'warning');
      return;
    }

    this.creditService.getCreditsHistoric(this.userId).subscribe({
      next: (res: CreditsHistoryResponse) => {
        this.totalItems = res.total ?? res.items?.length ?? 0;
        this.dataSource = new MatTableDataSource<CreditItem>(res.items ?? []);
        this.dataSource.filterPredicate = (row, filter) => {
          const f = filter.trim().toLowerCase();
          return (
            String(row.id).includes(f) ||
            String(row.delta).includes(f) ||
            (row.reason ?? '').toLowerCase().includes(f) ||
            (row.reference_type ?? '').toLowerCase().includes(f) ||
            String(row.reference_id ?? '').includes(f) ||
            String(row.created_by ?? '').includes(f)
          );
        };
        queueMicrotask(() => {
          if (this.paginator) this.dataSource.paginator = this.paginator;
          if (this.sort) this.dataSource.sort = this.sort;
        });
      },
      error: async () => this.toast('Error loading credits history', 'danger'),
    });
  }

  applyFilter(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();
    this.dataSource.paginator?.firstPage();
  }

  private async toast(message: string, color: 'success'|'warning'|'danger'|'medium' = 'medium') {
    (await this.toastCtrl.create({ message, duration: 2000, color })).present();
  }
}