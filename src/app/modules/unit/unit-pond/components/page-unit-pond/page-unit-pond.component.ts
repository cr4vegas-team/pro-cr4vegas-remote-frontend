import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TableEmptyMSGEnum } from '../../../../../shared/constants/table-empty-msg.enum';
import { UnitPondEntity } from '../../../../../modules/unit/unit-pond/unit-pond.entity';
import { UnitPondService } from '../../../../../modules/unit/unit-pond/unit-pond.service';
import { DialogUnitPondComponent } from '../dialog-unit-pond/dialog-unit-pond.component';

@Component({
  selector: 'app-unit-pond',
  templateUrl: './page-unit-pond.component.html',
})
export class PageUnitPondComponent implements OnInit {
  tableEmptyMSG = TableEmptyMSGEnum;

  unitsPonds: UnitPondEntity[];
  displayedColumns: string[] = [
    'id',
    'code',
    'active',
    'communication',
    'm3',
    'height',
    'sector',
    'station',
    'sets',
  ];
  dataSource: MatTableDataSource<UnitPondEntity>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  // ==================================================

  constructor(
    private readonly _unitPondService: UnitPondService,
    private readonly _matDialog: MatDialog
  ) {
    this.unitsPonds = [];
    this.dataSource = new MatTableDataSource(this.unitsPonds);
  }

  // ==================================================

  ngOnInit(): void {
    this._unitPondService
      .getUnitsPonds()
      .subscribe(
        (res) => {
          this.unitsPonds = res;
          this.dataSource.data = this.unitsPonds;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        (err) => {
          console.log('ERROR - UnitPondComponent: ' + err.message);
        }
      )
      .unsubscribe();

    this.dataSource.filterPredicate = (unitPond, filterValue) => {
      let setsString = '';
      unitPond.unit.sets.forEach((set) => (setsString += set.name));
      return (
        String(unitPond.unit.code).includes(filterValue) ||
        (unitPond.unit.sector &&
          unitPond.unit.sector.name.toLowerCase().includes(filterValue)) ||
        (unitPond.unit.station &&
          unitPond.unit.station.name.toLowerCase().includes(filterValue)) ||
        setsString.toLowerCase().includes(filterValue)
      );
    };
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

  openDialogUnitPond(unitPond: UnitPondEntity): void {
    this._matDialog.open(DialogUnitPondComponent, { data: unitPond });
  }
}
