import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UnitPondEntity } from '../../../../../modules/unit/unit-pond/unit-pond.entity';
import { UnitPondFactory } from '../../../../../modules/unit/unit-pond/unit-pond.factory';
import { UnitPondService } from '../../../../../modules/unit/unit-pond/unit-pond.service';
import { UnitEntity } from '../../../../../modules/unit/unit/unit.entity';
import { SectorEntity } from '../../../../../modules/wrap/sector/sector.entity';
import { SectorService } from '../../../../../modules/wrap/sector/sector.service';
import { SetEntity } from '../../../../../modules/wrap/set/set.entity';
import { SetService } from '../../../../../modules/wrap/set/set.service';
import { StationEntity } from '../../../../../modules/wrap/station/station.entity';
import { StationService } from '../../../../../modules/wrap/station/station.service';
import { DialogInfoComponent } from '../../../../../shared/components/dialog-info/dialog-info.component';
import { GLOBAL } from '../../../../../shared/constants/global.constant';
import { UnitPondCreateDto } from '../../dto/unit-pond-create.dto';
import { UnitPondUpdateDto } from '../../dto/unit-pond-update.dto';

@Component({
  selector: 'app-dialog-unit-pond-create',
  templateUrl: './dialog-unit-pond-create.component.html',
})
export class DialogUnitPondCreateComponent implements OnInit, OnDestroy {

  consDialogInfo = GLOBAL.FUNCTION_NOT_ALLOWED;
  create: boolean = true;

  sectors: SectorEntity[];
  stations: StationEntity[];
  sets: SetEntity[];

  // Froms control
  unitPondForm: FormGroup;

  constructor(
    private readonly _matDialog: MatDialog,
    private readonly _sectorService: SectorService,
    private readonly _setService: SetService,
    private readonly _stationService: StationService,
    private readonly _unitPondService: UnitPondService,
    private readonly _unitPondFactory: UnitPondFactory,
    private readonly _formBuilder: FormBuilder,
    private readonly _dialogRef: MatDialogRef<DialogUnitPondCreateComponent>,
    @Inject(MAT_DIALOG_DATA)
    public unitPond: UnitPondEntity
  ) {
    if (this.unitPond) {
      this.create = false;
    } else {
      this.create = true;
      this.unitPond = new UnitPondEntity();
      this.unitPond.unit = new UnitEntity();
    }
    this.sectors = [];
    this.stations = [];
    this.sets = [];

    this.unitPondForm = this._formBuilder.group({
      id: [this.unitPond.id],
      m3: [this.unitPond.m3],
      height: [this.unitPond.height],
      unit: this._formBuilder.group({
        id: [this.unitPond.unit.id],
        code: [this.unitPond.unit.code, [Validators.pattern('(BS)([0-9]{6})')]],
        altitude: [this.unitPond.unit.altitude],
        latitude: [this.unitPond.unit.latitude],
        longitude: [this.unitPond.unit.longitude],
        sector: [this.unitPond.unit.sector],
        station: [this.unitPond.unit.station],
        sets: [this.unitPond.unit.sets],
        description: [this.unitPond.unit.description],
      }),
    });
  }

  ngOnInit(): void {
    this._sectorService.sectors.subscribe(
      res => {
        this.sectors = res;
      }
    ).unsubscribe();
    this._stationService.stations.subscribe(
      res => {
        this.stations = res;
      }
    ).unsubscribe();
    this._setService.sets.subscribe(
      res => {
        this.sets = res;
      }
    ).unsubscribe();
  }

  ngOnDestroy() {
    this.unitPond = null;
  }

  openDialogInfo(data: string) {
    this._matDialog.open(DialogInfoComponent, { data });
  }

  accept() {
    try {
      if(!this.unitPondForm.valid) {
        throw new Error(`
          <p>El código es incorrecto. Ejemplo: BS000150. Código + 6 dígitos. Código:</p>
          <ul>
              <li>BS = Balsa</li>
          </ul>
        `);
      }
      const newUnitPond: UnitPondEntity = this._unitPondFactory.createUnitPond(this.unitPondForm.value);
      if (this.create) {
        this.createUnitPond(newUnitPond);
      } else {
        this.updateUnitPond(newUnitPond);
      }
    } catch (error) {
      this._matDialog.open(DialogInfoComponent, { data: { title: 'Error', html: error } });
    }
  }

  createUnitPond(newUnitPond: UnitPondEntity) {
    const unitPondCreateDto: UnitPondCreateDto = this._unitPondFactory.getUnitPondCreateDto(newUnitPond);
    this._unitPondService.create(unitPondCreateDto).subscribe(
      unitPondRO => {
        const newUnitPond: UnitPondEntity = this._unitPondFactory.createUnitPond(unitPondRO.unitPond);
        this._unitPondService.addMarkerAndSubscribeMqtt(newUnitPond);
        this._unitPondService.unitsPonds.value.push(newUnitPond);
        this._unitPondService.updateUnitsPonds();
        this.close();
      },
      error => {
        this._matDialog.open(DialogInfoComponent, { data: { title: 'Error', html: error.error.description } });
      }
    );
  }

  updateUnitPond(newUnitPond: UnitPondEntity) {
    const unitPondUpdateDto: UnitPondUpdateDto = this._unitPondFactory.getUnitPondUpdateDto(newUnitPond);
    this._unitPondService.update(unitPondUpdateDto).subscribe(
      unitGenericRO => {
        this._unitPondFactory.copyUnitPond(this.unitPond, unitGenericRO.unitPond);
        this._unitPondService.addMarkerAndSubscribeMqtt(this.unitPond);
        this._unitPondService.updateUnitsPonds();
      },
      error => {
        this._matDialog.open(DialogInfoComponent, { data: { title: 'Error', html: error.error.description } });
      }
    )
  }

  compareUnitHydrant(d1: any, d2: any) {
    return d1 && d2 && d1.id === d2.id;
  }

  close() {
    this._dialogRef.close();
  }

}
