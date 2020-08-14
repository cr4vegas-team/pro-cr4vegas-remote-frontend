import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UnitHydrantEntity } from '../../../models/unit-hydrant.entity';
import { UnitHydrantService } from '../../../services/api/unit-hydrant.service';
import { DialogUnitHydrantComponent } from '../../shared/dialog-unit-hydrant/dialog-unit-hydrant.component';

@Component({
  selector: 'app-hydrant',
  templateUrl: './hydrant.component.html',
  styleUrls: ['./hydrant.component.css']
})
export class HydrantComponent implements OnInit {

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
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialogHydrant(unitHydrant: UnitHydrantEntity) {
    this._matDialog.open(DialogUnitHydrantComponent, { data: unitHydrant, width: 'fit-content' })
  }

}
