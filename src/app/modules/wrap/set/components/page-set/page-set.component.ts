import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TableEmptyMSGEnum } from 'src/app/shared/constants/table-empty-msg.enum';
import { DialogService } from 'src/app/shared/services/dialog.service';
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
  displayedColumns: string[] = ['id', 'active', 'code', 'name'];
  dataSource: MatTableDataSource<SetEntity>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private readonly _setService: SetService,
    private readonly _matDialog: MatDialog,
    private readonly _dialogService: DialogService,
  ) {
    this.sets = [];
    this.dataSource = new MatTableDataSource(this.sets);
  }

  ngOnInit(): void {
    this._setService.subscribeToSets().subscribe(
      res => {
        this.sets = res;
        this.dataSource.data = this.sets;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      err => {
        this._dialogService.openDialogInfo('Error', err.message)
      }
    ).unsubscribe();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialogSet(set: SetEntity) {
    this._matDialog.open(DialogSetComponent, { data: set });
  }

}
