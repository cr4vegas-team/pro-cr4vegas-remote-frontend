import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { SectorEntity } from '../../../models/sector.entity';
import { SetEntity } from '../../../models/set.entity';
import { StationEntity } from '../../../models/station.entity';
import { UnitHydrantEntity } from '../../../models/unit-hydrant.entity';
import { StationService } from '../../../services/api/station.service';
import { SectorService } from '../../../services/api/sector.service';
import { SetService } from '../../../services/api/set.service';
import { DialogInfoComponent } from '../dialog-info/dialog-info.component';
import { CONS_DIALOG_INFO } from '../dialog-info/dialog-info.constants';

@Component({
  selector: 'app-dialog-unit-hydrant-create',
  templateUrl: './dialog-unit-hydrant-create.component.html',
  styleUrls: ['./dialog-unit-hydrant-create.component.css']
})
export class DialogUnitHydrantCreateComponent implements OnInit {

  // ==================================================
  // Table selection
  // ==================================================
  displayedColumns: string[] = ['select', 'name'];
  dataSource = new MatTableDataSource<SetEntity>();
  selection = new SelectionModel<SetEntity>(true, []);

  consDialogInfo = CONS_DIALOG_INFO;
  create: boolean = true;

  sectors: SectorEntity[];
  stations: StationEntity[];
  sets: SetEntity[];

  sectorSelected: SectorEntity;
  stationSelected: StationEntity;

  constructor(
    private readonly _matDialog: MatDialog,
    private readonly _sectorService: SectorService,
    private readonly _setService: SetService,
    private readonly _stationService: StationService,
    @Inject(MAT_DIALOG_DATA)
    public unitHydrant: UnitHydrantEntity
  ) {
    this.sectors = [];
    this.stations = [];
    this.sets = [];
    this.sectorSelected = null;
    this.stationSelected = null;
  }

  ngOnInit(): void {
    if (this.unitHydrant) {
      this.create = false;
    } else {
      this.create = true;
    }
    this._sectorService.subscribeToSectors().subscribe(
      res => {
        this.sectors = res;
      }
    ).unsubscribe();
    this._stationService.subscribeToStatiosn().subscribe(
      res => {
        this.stations = res;
      }
    ).unsubscribe();
    this._setService.subscribeToSets().subscribe(
      res => {
        this.sets = res;
      }
    ).unsubscribe();
  }

  openDialogInfo(data: string) {
    this._matDialog.open(DialogInfoComponent, { data });
  }

  accept() {
    if (this.create) {

    } else {

    }
  }

  // ==================================================
  // Table selection functions
  // ==================================================
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: SetEntity): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

}
