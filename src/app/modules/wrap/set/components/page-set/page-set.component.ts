import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DialogUnitGenericComponent } from 'src/app/modules/unit/unit-generic/components/dialog-unit-generic/dialog-unit-generic.component';
import { UnitGenericService } from 'src/app/modules/unit/unit-generic/unit-generic.service';
import { DialogUnitHydrantComponent } from 'src/app/modules/unit/unit-hydrant/components/dialog-unit-hydrant/dialog-unit-hydrant.component';
import { UnitHydrantService } from 'src/app/modules/unit/unit-hydrant/unit-hydrant.service';
import { DialogUnitPondComponent } from 'src/app/modules/unit/unit-pond/components/dialog-unit-pond/dialog-unit-pond.component';
import { UnitPondService } from 'src/app/modules/unit/unit-pond/unit-pond.service';
import { DialogUnitStationPechinaComponent } from 'src/app/modules/unit/unit-station-pechina/components/dialog-unit-station-pechina/dialog-unit-station-pechina/dialog-unit-station-pechina.component';
import { UnitStationPechinaService } from 'src/app/modules/unit/unit-station-pechina/unit-station-pechina.service';
import { UnitEntity } from 'src/app/modules/unit/unit/unit.entity';
import { DialogImageComponent } from 'src/app/shared/components/dialog-image/dialog-image.component';
import { UnitTypeTableEnum } from 'src/app/shared/constants/unit-type-table.enum';
import { SetEntity } from '../../set.entity';
import { SetService } from '../../set.service';
import { DialogSetComponent } from '../dialog-set/dialog-set.component';

@Component({
  selector: 'app-set',
  templateUrl: './page-set.component.html',
})
export class PageSetComponent implements OnInit {
  sets = [];
  searchText: string;
  checkedCommunication: boolean = false;
  checkedActive: boolean = true;
  showLoader = false;
  unitTypeTable = UnitTypeTableEnum;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private readonly _setService: SetService,
    private readonly _matDialog: MatDialog,
    private readonly _unitGenericService: UnitGenericService,
    private readonly _unitHydrantService: UnitHydrantService,
    private readonly _unitPondService: UnitPondService,
    private readonly _unitStationPechinaService: UnitStationPechinaService
  ) {}

  ngOnInit() {
    this._setService.findAll().subscribe((setsRO) => {
      if (setsRO) {
        this.sets = setsRO.sets;
      }
    });
  }

  openDialogSet(set: SetEntity): void {
    const dialogRef = this._matDialog.open(DialogSetComponent, { data: set });
    dialogRef.afterClosed().subscribe((res) => {
      this._setService.findAll().subscribe((setsRO) => {
        if (setsRO) {
          this.sets = setsRO.sets;
        }
      });
    });
  }

  openDialog(unit: UnitEntity): void {
    switch (unit.unitTypeTable) {
      case UnitTypeTableEnum.UNIT_GENERIC:
        this._matDialog.open(DialogUnitGenericComponent, {
          data: this._unitGenericService.getOneByUnitId(unit.id),
        });
        break;
      case UnitTypeTableEnum.UNIT_HYDRANT:
        this._matDialog.open(DialogUnitHydrantComponent, {
          data: this._unitHydrantService.getOneByUnitId(unit.id),
        });
        break;
      case UnitTypeTableEnum.UNIT_POND:
        this._matDialog.open(DialogUnitPondComponent, {
          data: this._unitPondService.getOneByUnitId(unit.id),
        });
        break;
      case UnitTypeTableEnum.UNIT_STATION_PECHINA:
        this._matDialog.open(DialogUnitStationPechinaComponent, {
          data: this._unitStationPechinaService.getUnitStationPechina().value,
        });
        break;
    }
  }

  applyFilter(searchText: string): void {
    this.searchText = searchText;
  }

  openDialogImage(imageURL): void {
    this._matDialog.open(DialogImageComponent, { data: imageURL });
  }

  compare(a: SetEntity, b: SetEntity) {
    if (a.name < b.name) return 1;
    if (a.name > b.name) return -1;
    return 0;
  }

  getType(unit: UnitEntity): string {
    switch (unit.unitTypeTable) {
      case UnitTypeTableEnum.UNIT_GENERIC:
        return 'Genérico';
      case UnitTypeTableEnum.UNIT_HYDRANT:
        return 'Hidrante';
      case UnitTypeTableEnum.UNIT_POND:
        return 'Balsa';
      case UnitTypeTableEnum.UNIT_STATION_PECHINA:
        return 'Estación Pechina';
      default:
        return 'Indefinido';
    }
  }
}
