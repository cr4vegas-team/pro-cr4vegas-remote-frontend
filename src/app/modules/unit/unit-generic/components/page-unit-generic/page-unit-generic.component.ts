import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
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
export class PageUnitGenericComponent implements OnInit, AfterViewInit {
  tableEmptyMSG = TableEmptyMSGEnum;
  unitsGenerics: UnitGenericEntity[];
  displayedColumns: string[] = [
    'id',
    'code',
    'active',
    'communication',
    'sector',
    'station',
    'sets',
  ];
  dataSource: MatTableDataSource<UnitGenericEntity>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private readonly _unitGenericService: UnitGenericService,
    private readonly _matDialog: MatDialog
  ) {
    this.unitsGenerics = [];
    this.dataSource = new MatTableDataSource(this.unitsGenerics);
  }

  ngOnInit(): void {
    this._unitGenericService
      .getUnitsGeneric()
      .subscribe(
        (res) => {
          this.unitsGenerics = res;
          this.dataSource = new MatTableDataSource(this.unitsGenerics);
        },
        (err) => {
          console.log('ERROR - UnitGenericComponent: ' + err.message);
        }
      )
      .unsubscribe();

    this.dataSource.filterPredicate = (unitGeneric, filterValue) => {
      let setsString = '';
      unitGeneric.unit.sets.forEach((set) => (setsString += set.name));
      return (
        String(unitGeneric.unit.code).includes(filterValue) ||
        (unitGeneric.unit.sector &&
          unitGeneric.unit.sector.name.toLowerCase().includes(filterValue)) ||
        (unitGeneric.unit.station &&
          unitGeneric.unit.station.name.toLowerCase().includes(filterValue)) ||
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

  openDialogUnitGeneric(unitGeneric: UnitGenericEntity): void {
    this._matDialog.open(DialogUnitGenericComponent, { data: unitGeneric });
  }
}
