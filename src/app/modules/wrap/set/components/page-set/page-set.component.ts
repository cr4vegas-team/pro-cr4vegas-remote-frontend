import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DialogInfoComponent } from 'src/app/shared/components/dialog-info/dialog-info.component';
import { TableEmptyMSGEnum } from 'src/app/shared/constants/table-empty-msg.enum';
import { SetEntity } from '../../set.entity';
import { SetService } from '../../set.service';
import { DialogSetComponent } from '../dialog-set/dialog-set.component';

@Component({
  selector: 'app-set',
  templateUrl: './page-set.component.html',
})
export class PageSetComponent implements OnInit {

  tableEmptyMSG = TableEmptyMSGEnum;

  sets: SetEntity[];
  displayedColumns: string[] = ['id', 'active', 'code', 'name', 'setType'];
  dataSource: MatTableDataSource<SetEntity>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private readonly _setService: SetService,
    private readonly _matDialog: MatDialog,
  ) {
    this.sets = [];
    this.dataSource = new MatTableDataSource(this.sets);
  }

  ngOnInit(): void {
    this._setService.sets.subscribe(
      res => {
        this.sets = res;
        this.dataSource.data = this.sets;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error => {
        this._matDialog.open(DialogInfoComponent, {data: {title: 'Error', html: error}});
      }
    ).unsubscribe();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialogSet(set: SetEntity): void {
    this._matDialog.open(DialogSetComponent, { data: set });
  }

}
