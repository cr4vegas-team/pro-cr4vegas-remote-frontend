import { Component, OnInit, ViewChild } from '@angular/core';
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
export class PageUnitHydrantComponent implements OnInit {

  tableEmptyMSG = TableEmptyMSGEnum;

  unitsHydrants: UnitHydrantEntity[];
  displayedColumns: string[] = ['id', 'code', 'sector', 'station', 'sets'];
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
    this._unitHydrantService.subscribeToHydrants().subscribe(
      res => {
        this.unitsHydrants = res;
        this.dataSource.data = this.unitsHydrants;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      err => {
        console.log('ERROR - HydrantComponent: ' + err.message);
      }
    ).unsubscribe();

    this.dataSource.filterPredicate = (unitHydrant, filterValue) => {
      let setsString: string = '';
      unitHydrant.unit.sets.forEach(set => setsString += set.name);
      return unitHydrant.unit.code.toLowerCase().includes(filterValue) ||
             (unitHydrant.unit.sector && unitHydrant.unit.sector.name.toLowerCase().includes(filterValue)) ||
             (unitHydrant.unit.station && unitHydrant.unit.station.name.toLowerCase().includes(filterValue)) ||
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

  openDialogHydrant(unitHydrant: UnitHydrantEntity) {
    this._matDialog.open(DialogUnitHydrantComponent, { data: unitHydrant });
  }

}
