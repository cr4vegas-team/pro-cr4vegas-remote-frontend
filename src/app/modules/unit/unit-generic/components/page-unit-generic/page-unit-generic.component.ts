import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TableEmptyMSGEnum } from '../../../../../shared/constants/table-empty-msg.enum';
import { UnitGenericEntity } from '../../unit-generic.entity';
import { UnitGenericService } from '../../unit-generic.service';
import { DialogUnitGenericComponent } from '../dialog-unit-generic/dialog-unit-generic.component';

@Component({
  selector: 'app-page-unit-generic',
  templateUrl: './page-unit-generic.component.html',
})
export class PageUnitGenericComponent implements OnInit {

  tableEmptyMSG = TableEmptyMSGEnum;
  unitsGenerics: UnitGenericEntity[];
  displayedColumns: string[] = ['id', 'code', 'sector', 'station', 'sets'];
  dataSource: MatTableDataSource<UnitGenericEntity>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private readonly _unitGenericService: UnitGenericService,
    private readonly _matDialog: MatDialog,
  ) {
    this.unitsGenerics = [];
    this.dataSource = new MatTableDataSource(this.unitsGenerics);
  }

  ngOnInit(): void {

    this._unitGenericService.unitsGenerics.subscribe(
      res => {
        this.unitsGenerics = res;
        this.dataSource.data = this.unitsGenerics;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      err => {
        console.log('ERROR - UnitGenericComponent: ' + err.message);
      }
    ).unsubscribe();

    this.dataSource.filterPredicate = (unitGeneric, filterValue) => {
      let setsString: string = '';
      unitGeneric.unit.sets.forEach(set => setsString += set.name);
      return unitGeneric.unit.code.toLowerCase().includes(filterValue) ||
             (unitGeneric.unit.sector && unitGeneric.unit.sector.name.toLowerCase().includes(filterValue)) ||
             (unitGeneric.unit.station && unitGeneric.unit.station.name.toLowerCase().includes(filterValue)) ||
             (setsString.toLowerCase().includes(filterValue));
    };
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialogUnitGeneric(unitGeneric: UnitGenericEntity) {
    this._matDialog.open(DialogUnitGenericComponent, { data: unitGeneric });
  }

}
