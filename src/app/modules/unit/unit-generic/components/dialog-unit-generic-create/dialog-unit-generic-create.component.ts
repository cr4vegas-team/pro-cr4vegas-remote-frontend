import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SectorEntity } from 'src/app/modules/wrap/sector/sector.entity';
import { SectorService } from 'src/app/modules/wrap/sector/sector.service';
import { SetEntity } from 'src/app/modules/wrap/set/set.entity';
import { SetService } from 'src/app/modules/wrap/set/set.service';
import { StationEntity } from 'src/app/modules/wrap/station/station.entity';
import { StationService } from 'src/app/modules/wrap/station/station.service';
import { DialogInfoComponent } from 'src/app/shared/components/dialog-info/dialog-info.component';
import { GLOBAL } from 'src/app/shared/constants/global.constant';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { DialogUnitHydrantCreateComponent } from '../../../unit-hydrant/components/dialog-unit-hydrant-create/dialog-unit-hydrant-create.component';
import { UnitHydrantService } from '../../../unit-hydrant/unit-hydrant.service';
import { UnitEntity } from '../../../unit/unit.entity';
import { UnitGenericCreateDto } from '../../dto/unit-generic-create.dto';
import { UnitGenericUpdateDto } from '../../dto/unit-generic-update.dto';
import { UnitGenericEntity } from '../../unit-generic.entity';
import { UnitGenericFactory } from '../../unit-generic.factory';
import { UnitGenericService } from '../../unit-generic.service';

@Component({
  selector: 'app-dialog-unit-generic-create',
  templateUrl: './dialog-unit-generic-create.component.html',
})
export class DialogUnitGenericCreateComponent implements OnInit {

  consDialogInfo = GLOBAL.FUNCTION_NOT_ALLOWED;
  create: boolean = true;

  sectors: SectorEntity[];
  stations: StationEntity[];
  sets: SetEntity[];

  // Froms control
  unitGenericForm: FormGroup;

  constructor(
    private readonly _matDialog: MatDialog,
    private readonly _sectorService: SectorService,
    private readonly _setService: SetService,
    private readonly _stationService: StationService,
    private readonly _unitGenericService: UnitGenericService,
    private readonly _unitGenericFactory: UnitGenericFactory,
    private readonly _formBuilder: FormBuilder,
    private readonly _dialogRef: MatDialogRef<DialogUnitHydrantCreateComponent>,
    private readonly _dialogService: DialogService,
    @Inject(MAT_DIALOG_DATA)
    public unitGeneric: UnitGenericEntity
  ) {
    if (this.unitGeneric) {
      this.create = false;
    } else {
      this.create = true;
      this.unitGeneric = new UnitGenericEntity();
      this.unitGeneric.unit = new UnitEntity();
    }
    this.sectors = [];
    this.stations = [];
    this.sets = [];

    this.unitGenericForm = this._formBuilder.group({
      id: [this.unitGeneric.id],
      data1: [this.unitGeneric.data1],
      data2: [this.unitGeneric.data2],
      data3: [this.unitGeneric.data3],
      data4: [this.unitGeneric.data4],
      data5: [this.unitGeneric.data5],
      unit: this._formBuilder.group({
        id: [this.unitGeneric.unit.id],
        code: [this.unitGeneric.unit.code, [Validators.pattern('(GN)([0-9]{6})')]],
        altitude: [this.unitGeneric.unit.altitude],
        latitude: [this.unitGeneric.unit.latitude],
        longitude: [this.unitGeneric.unit.longitude],
        sector: [this.unitGeneric.unit.sector],
        station: [this.unitGeneric.unit.station],
        sets: [this.unitGeneric.unit.sets],
        description: [this.unitGeneric.unit.description],
      }),
    });
  }

  ngOnInit(): void {
    this._sectorService.subscribeToSectors().subscribe(
      res => {
        this.sectors = res;
      }
    ).unsubscribe();
    this._stationService.subscribeToStations().subscribe(
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

  ngOnDestroy() {
    this.unitGeneric = null;
  }

  openDialogInfo(data: string) {
    this._matDialog.open(DialogInfoComponent, { data });
  }

  accept() {
    if(this.unitGenericForm.valid) {
      try {
        const newUnitGeneric: UnitGenericEntity = this._unitGenericFactory.createUnitGeneric(this.unitGenericForm.value);
        if (this.create) {
          const unitGenericCreateDto: UnitGenericCreateDto = this._unitGenericFactory.getUnitGenericCreateDto(newUnitGeneric);
          this._unitGenericService.create(unitGenericCreateDto);
        } else {
          const unitGenericUpdateDto: UnitGenericUpdateDto = this._unitGenericFactory.getUnitGenericUpdateDto(newUnitGeneric);
          this._unitGenericService.update(this.unitGeneric, unitGenericUpdateDto);
        }
        this.close();
      } catch (error) {
        this._dialogService.openDialogInfo('Datos incorrectos', error);
      }
    } else {
      this._dialogService.openDialogInfo('Error', `
                            <p>El código es incorrecto. Ejemplo: GN000150. Código + 6 dígitos. Código:</p>
                            <ul>
                                <li>GN = Genérico</li>
                            </ul>
      `)
    }
  }

  compareUnitHydrant(d1: any, d2: any) {
    return d1 && d2 && d1.id === d2.id;
  }

  close() {
    this._dialogRef.close();
  }

}
