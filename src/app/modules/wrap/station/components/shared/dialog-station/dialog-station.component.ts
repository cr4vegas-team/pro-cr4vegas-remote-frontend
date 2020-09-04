import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UnitEntity } from '../../../../../../modules/unit/unit/unit.entity';
import { StationEntity } from '../../../../../../modules/wrap/station/station.entity';
import { DialogInfoComponent } from '../../../../../../shared/components/dialog-info/dialog-info.component';
import { GLOBAL } from '../../../../../../shared/constants/global.constant';
import { DialogStationCreateComponent } from '../dialog-station-create/dialog-station-create.component';

@Component({
  selector: 'app-dialog-station',
  templateUrl: './dialog-station.component.html',
  styleUrls: ['./dialog-station.component.css']
})
export class DialogStationComponent implements OnInit {

  consDialogInfo = GLOBAL.FUNCTION_NOT_ALLOWED;

  displayedColumns: string[] = ['id', 'name', 'progress', 'color'];
  dataSource: MatTableDataSource<UnitEntity>;

  units: UnitEntity[] = [];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private readonly _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public station: StationEntity
  ) {
    this.dataSource = new MatTableDataSource(this.units);
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnDestroy() {
    this.station = null;
  }

  openDialogInfo(data: string) {
    this._matDialog.open(DialogInfoComponent, { data });
  }

  openDialogHydrantCreate() {
    this._matDialog.open(DialogStationCreateComponent, { data: this.station });
  }

}
