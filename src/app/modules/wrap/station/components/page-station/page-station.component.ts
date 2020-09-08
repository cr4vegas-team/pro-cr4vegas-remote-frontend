import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TableEmptyMSGEnum } from '../../../../../shared/constants/table-empty-msg.enum';
import { StationEntity } from '../../../../../modules/wrap/station/station.entity';
import { StationService } from '../../../../../modules/wrap/station/station.service';
import { DialogStationComponent } from '../dialog-station/dialog-station.component';

@Component({
  selector: 'app-station',
  templateUrl: './page-station.component.html',
})
export class PageStationComponent implements OnInit {

  tableEmptyMSG = TableEmptyMSGEnum;

  stations: StationEntity[];
  displayedColumns: string[] = ['id', 'active', 'code', 'name', 'altitude', 'latitude', 'longitude'];
  dataSource: MatTableDataSource<StationEntity>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private readonly _stationService: StationService,
    private readonly _matDialog: MatDialog,
  ) {
    this.stations = [];
    this.dataSource = new MatTableDataSource(this.stations);
  }

  ngOnInit(): void {
    this._stationService.subscribeToStations().subscribe(
      res => {
        this.stations = res;
        this.dataSource.data = this.stations;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      err => {
        console.log('ERROR - UnitGenericComponent: ' + err.message);
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

  openDialogStation(station: StationEntity) {
    this._matDialog.open(DialogStationComponent, { data: station });
  }

}
