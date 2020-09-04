import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogInfoComponent } from '../../../../../shared/components/dialog-info/dialog-info.component';
import { GLOBAL } from '../../../../../shared/constants/global.constant';
import { UnitHydrantEntity } from '../../../../../modules/unit/unit-hydrant/unit-hydrant.entity';
import { UnitHydrantFactory } from '../../../../../modules/unit/unit-hydrant/unit-hydrant.factory';
import { UnitHydrantService } from '../../../../../modules/unit/unit-hydrant/unit-hydrant.service';
import { UnitEntity } from '../../../../../modules/unit/unit/unit.entity';
import { SectorEntity } from '../../../../../modules/wrap/sector/sector.entity';
import { SectorService } from '../../../../../modules/wrap/sector/sector.service';
import { SetEntity } from '../../../../../modules/wrap/set/set.entity';
import { SetService } from '../../../../../modules/wrap/set/set.service';
import { StationEntity } from '../../../../../modules/wrap/station/station.entity';
import { StationService } from '../../../../../modules/wrap/station/station.service';


@Component({
  selector: 'app-dialog-unit-hydrant-create',
  templateUrl: './dialog-unit-hydrant-create.component.html',
  styleUrls: ['./dialog-unit-hydrant-create.component.css'],
})
export class DialogUnitHydrantCreateComponent implements OnInit, OnDestroy {

  consDialogInfo = GLOBAL.FUNCTION_NOT_ALLOWED;
  create: boolean = true;

  sectors: SectorEntity[];
  stations: StationEntity[];
  sets: SetEntity[];

  // Froms control
  unitHydrantForm: FormGroup;

  constructor(
    private readonly _matDialog: MatDialog,
    private readonly _sectorService: SectorService,
    private readonly _setService: SetService,
    private readonly _stationService: StationService,
    private readonly _unitHydrantService: UnitHydrantService,
    private readonly _unitHydrantFactory: UnitHydrantFactory,
    private readonly _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA)
    public unitHydrant: UnitHydrantEntity
  ) {
    if (this.unitHydrant) {
      this.create = false;
    } else {
      this.create = true;
      this.unitHydrant = new UnitHydrantEntity();
      this.unitHydrant.unit = new UnitEntity();
    }
    this.sectors = [];
    this.stations = [];
    this.sets = [];
    this.unitHydrantForm = this._formBuilder.group({
      id: [this.unitHydrant.id],
      filter: [this.unitHydrant.filter],
      diameter: [this.unitHydrant.diameter],
      unit: this._formBuilder.group({
        id: [this.unitHydrant.unit.id],
        code: [this.unitHydrant.unit.code, [Validators.required, Validators.pattern("HD[0-9]{6}")]],
        altitude: [this.unitHydrant.unit.altitude, Validators.required],
        latitude: [this.unitHydrant.unit.latitude, Validators.required],
        longitude: [this.unitHydrant.unit.longitude, Validators.required],
        sector: [this.unitHydrant.unit.sector],
        station: [this.unitHydrant.unit.station],
        sets: [this.unitHydrant.unit.sets],
        description: [this.unitHydrant.unit.description],
        unitType: [this.unitHydrant.unit.unitType],
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
    this.unitHydrant = null;
  }

  openDialogInfo(data: string) {
    this._matDialog.open(DialogInfoComponent, { data });
  }

  accept() {
    if (this.create) {
      this._unitHydrantService.create(this._unitHydrantFactory.createUnitHydrant(this.unitHydrantForm.value));
    } else {
      this._unitHydrantService.update(this.unitHydrant, this._unitHydrantFactory.createUnitHydrant(this.unitHydrantForm.value));
    }
  }

  compareUnitHydrant(d1: any, d2: any) {
    return d1 && d2 && d1.id === d2.id;
  }

  mostrar(value: string) {
    console.log(value);
  }
}
