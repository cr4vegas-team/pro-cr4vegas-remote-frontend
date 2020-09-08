import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TableEmptyMSGEnum } from 'src/app/shared/constants/table-empty-msg.enum';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { SectorEntity } from '../../sector.entity';
import { SectorService } from '../../sector.service';
import { DialogSectorComponent } from '../dialog-sector/dialog-sector.component';

@Component({
  selector: 'app-sector',
  templateUrl: './page-sector.component.html',
})
export class PageSectorComponent implements OnInit {

  tableEmptyMSG = TableEmptyMSGEnum;

  sectors: SectorEntity[];
  displayedColumns: string[] = ['id', 'active', 'code', 'name'];
  dataSource: MatTableDataSource<SectorEntity>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private readonly _sectorService: SectorService,
    private readonly _matDialog: MatDialog,
    private readonly _dialogService: DialogService,
  ) {
    this.sectors = [];
    this.dataSource = new MatTableDataSource(this.sectors);
  }

  ngOnInit(): void {
    this._sectorService.subscribeToSectors().subscribe(
      res => {
        this.sectors = this.sectors;
        this.dataSource.data = this.sectors;
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

  openDialogSector(sector: SectorEntity) {
    this._matDialog.open(DialogSectorComponent, { data: sector });
  }

}
