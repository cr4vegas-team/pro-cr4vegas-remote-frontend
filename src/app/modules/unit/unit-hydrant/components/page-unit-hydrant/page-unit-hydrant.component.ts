import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TableEmptyMSGEnum } from '../../../../../shared/constants/table-empty-msg.enum';
import { UnitHydrantEntity } from '../../unit-hydrant.entity';
import { UnitHydrantService } from '../../unit-hydrant.service';
import { DialogUnitHydrantComponent } from '../dialog-unit-hydrant/dialog-unit-hydrant.component';

@Component({
  selector: 'app-hydrant',
  templateUrl: './page-unit-hydrant.component.html',
})
export class PageUnitHydrantComponent implements OnInit, AfterViewInit {
  tableEmptyMSG = TableEmptyMSGEnum;

  unitsHydrants: UnitHydrantEntity[];
  displayedColumns: string[] = [
    'id',
    'code',
    'active',
    'communication',
    'sector',
    'station',
    'sets',
  ];
  dataSource: MatTableDataSource<UnitHydrantEntity>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private readonly _unitHydrantService: UnitHydrantService,
    private readonly _matDialog: MatDialog
  ) {
    this.unitsHydrants = [];
    this.dataSource = new MatTableDataSource(this.unitsHydrants);
  }

  ngOnInit(): void {
    this._unitHydrantService
      .getUnitsHydrants()
      .subscribe(
        (res) => {
          this.unitsHydrants = res;
          this.dataSource.data = this.unitsHydrants;
        },
        (err) => {
          console.log('ERROR - HydrantComponent: ' + err.message);
        }
      )
      .unsubscribe();

    this.dataSource.filterPredicate = (unitHydrant, filterValue) => {
      let setsString = '';
      unitHydrant.unit.sets.forEach((set) => (setsString += set.name));
      return (
        String(unitHydrant.unit.code).includes(filterValue) ||
        (unitHydrant.unit.sector &&
          unitHydrant.unit.sector.name.toLowerCase().includes(filterValue)) ||
        (unitHydrant.unit.station &&
          unitHydrant.unit.station.name.toLowerCase().includes(filterValue)) ||
        setsString.toLowerCase().includes(filterValue)
      );
    };
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialogHydrant(unitHydrant: UnitHydrantEntity): void {
    this._matDialog.open(DialogUnitHydrantComponent, { data: unitHydrant });
  }
}
