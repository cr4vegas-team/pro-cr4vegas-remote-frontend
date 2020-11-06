import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DialogInfoComponent } from 'src/app/shared/components/dialog-info/dialog-info.component';
import { TableEmptyMSGEnum } from 'src/app/shared/constants/table-empty-msg.enum';
import { OrderEntity } from './../../order.entity';
import { OrderService } from './../../order.service';
import { DialogOrderComponent } from './../dialog-order/dialog-order.component';

@Component({
  selector: 'app-page-order',
  templateUrl: './page-order.component.html',
})
export class PageOrderComponent implements OnInit {
  tableEmptyMSG = TableEmptyMSGEnum;

  orders: OrderEntity[];
  displayedColumns: string[] = ['id', 'active', 'code', 'name'];
  dataSource: MatTableDataSource<OrderEntity>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  // ==================================================

  constructor(
    private readonly _orderService: OrderService,
    private readonly _matDialog: MatDialog
  ) {
    this.orders = [];
    this.dataSource = new MatTableDataSource(this.orders);
  }

  // ==================================================

  ngOnInit(): void {
    this._orderService.orders
      .subscribe(
        (res) => {
          this.orders = res;
          this.dataSource.data = this.orders;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        (error) => {
          this._matDialog.open(DialogInfoComponent, {
            data: { title: 'Error', html: error },
          });
        }
      )
      .unsubscribe();
  }

  // ==================================================

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // ==================================================

  openDialogOrder(order: OrderEntity): void {
    this._matDialog.open(DialogOrderComponent, { data: order });
  }
}
