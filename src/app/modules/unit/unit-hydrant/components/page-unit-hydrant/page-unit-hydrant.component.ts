import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DialogConfirmComponent } from 'src/app/shared/components/dialog-confirm/dialog-confirm.component';
import { DialogImageComponent } from 'src/app/shared/components/dialog-image/dialog-image.component';
import { TableEmptyMSGEnum } from '../../../../../shared/constants/table-empty-msg.enum';
import { UnitHydrantMqttService } from '../../unit-hydrant-mqtt.service';
import { UnitHydrantEntity } from '../../unit-hydrant.entity';
import { UnitHydrantFactory } from '../../unit-hydrant.factory';
import { UnitHydrantService } from '../../unit-hydrant.service';
import { DialogUnitHydrantComponent } from '../dialog-unit-hydrant/dialog-unit-hydrant.component';

@Component({
  selector: 'app-hydrant',
  templateUrl: './page-unit-hydrant.component.html',
  styleUrls: ['./page-unit-hydrant.component.css'],
})
export class PageUnitHydrantComponent implements OnInit {
  unitsHydrants = [];
  searchText: string;
  checkedCommunication: boolean = false;
  checkedActive: boolean = true;
  showLoader = false;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private readonly _unitHydrantService: UnitHydrantService,
    private readonly _matDialog: MatDialog,
    private readonly _unitHydrantMQTTService: UnitHydrantMqttService,
    private readonly _unitHydrantFactory: UnitHydrantFactory
  ) {
    this._unitHydrantService.getUnitsHydrants().subscribe((unitsHydrants) => {
      this.unitsHydrants = unitsHydrants;
    });
  }

  ngOnInit() {}

  openDialogHydrant(unitHydrant: UnitHydrantEntity): void {
    this._matDialog.open(DialogUnitHydrantComponent, { data: unitHydrant });
  }

  applyFilter(searchText: string): void {
    this.searchText = searchText;
  }

  openDialogImage(imageURL): void {
    this._matDialog.open(DialogImageComponent, { data: imageURL });
  }

  compare(a: UnitHydrantEntity, b: UnitHydrantEntity) {
    // Comparamos la propiedad bot de user.

    if (a.unit.code < b.unit.code) return 1;
    if (a.unit.code > b.unit.code) return -1;
    else {
      // Si la propiedad bot de user es igual, ordenar alfabéticamente.

      if (a.unit.communication > b.unit.communication) return 1;
      if (a.unit.communication < b.unit.communication) return -1;
      else {
        if (a.unit.sector > b.unit.sector) return 1;
        else if (a.unit.sector < b.unit.sector) return -1;
        return 0;
      }
    }
  }

  public openValve(unitHydrant): void {
    if (
      unitHydrant.bouyMedium$.value === 1 &&
      unitHydrant.bouyHight$.value !== 1
    ) {
      const dialogRef = this._matDialog.open(DialogConfirmComponent, {
        width: '300px',
        data:
          'La balsa esta llena. Teniendo en cuenta que si abre manualmente solo dispone de la boya de alarma de nivel para un cierre automático, ¿Desea abrir la balsa?',
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this._unitHydrantMQTTService.publishOrders(unitHydrant, 1, 1);
        }
      });
    }
    if (unitHydrant.bouyHight$.value !== 1) {
      this._unitHydrantMQTTService.publishOrders(unitHydrant, 1, 0);
    }
  }

  public closeValve(unitHydrant): void {
    this._unitHydrantMQTTService.publishOrders(unitHydrant, 0, 0);
  }

  resetBatch(unitHydrant: UnitHydrantEntity): void {
    const unitHydrantUpdateDto = this._unitHydrantFactory.getUnitHydrantUpdateDto(
      unitHydrant
    );
    unitHydrantUpdateDto.initBatch = unitHydrant.reading$.value;
    this._unitHydrantService
      .update(unitHydrantUpdateDto)
      .subscribe((unitHydrantRO) => {
        unitHydrant.initBatch = unitHydrantRO.unitHydrant.initBatch;
        unitHydrant.batch = unitHydrant.reading$.value - unitHydrant.initBatch;
      });
  }
}
