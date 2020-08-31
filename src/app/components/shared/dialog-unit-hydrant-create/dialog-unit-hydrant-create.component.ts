import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UnitFactory } from 'src/app/factories/unit.factory';
import { UnitHydrantService } from 'src/app/services/api/unit-hydrant.service';
import { SectorEntity } from '../../../models/sector.entity';
import { SetEntity } from '../../../models/set.entity';
import { StationEntity } from '../../../models/station.entity';
import { UnitHydrantEntity } from '../../../models/unit-hydrant.entity';
import { SectorService } from '../../../services/api/sector.service';
import { SetService } from '../../../services/api/set.service';
import { StationService } from '../../../services/api/station.service';
import { DialogInfoComponent } from '../dialog-info/dialog-info.component';
import { CONS_DIALOG_INFO } from '../dialog-info/dialog-info.constants';

@Component({
  selector: 'app-dialog-unit-hydrant-create',
  templateUrl: './dialog-unit-hydrant-create.component.html',
  styleUrls: ['./dialog-unit-hydrant-create.component.css'],
})
export class DialogUnitHydrantCreateComponent implements OnInit, OnDestroy {

  consDialogInfo = CONS_DIALOG_INFO;
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
    private readonly _unitFactory: UnitFactory,
    private readonly _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA)
    public unitHydrant: UnitHydrantEntity
  ) {
    if (this.unitHydrant) {
      this.create = false;
    } else {
      this.create = true;
      this.unitHydrant = this._unitFactory.createUnitHydrant();
      this.unitHydrant.setUnit(this._unitFactory.createUnit());
    }
    this.sectors = [];
    this.stations = [];
    this.sets = [];
    this.unitHydrantForm = this._formBuilder.group({
      id: [this.unitHydrant.getId()],
      filter: [this.unitHydrant.getFilter()],
      diameter: [this.unitHydrant.getDiameter()],
      unit: this._formBuilder.group({
        code: [this.unitHydrant.getUnit().getCode(), [Validators.required, Validators.pattern("HD[0-9]{6}")]],
        altitude: [this.unitHydrant.getUnit().getAltitude(), Validators.required],
        latitude: [this.unitHydrant.getUnit().getLatitude(), Validators.required],
        longitude: [this.unitHydrant.getUnit().getLongitude(), Validators.required],
        sector: [this.unitHydrant.getUnit().getSector()],
        station: [this.unitHydrant.getUnit().getStation()],
        sets: [this.unitHydrant.getUnit().getSets()],
        description: [this.unitHydrant.getUnit().getDescription()],
      }),
    });
  }

  ngOnInit(): void {
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

  ngOnDestroy() {
    this.unitHydrant = null;
  }

  openDialogInfo(data: string) {
    this._matDialog.open(DialogInfoComponent, { data });
  }

  accept() {
    console.log(this.unitHydrantForm);
    if (this.create) {
      this._unitHydrantService.addHydrant(this.unitHydrant);
    } else {
      this._unitHydrantService.modifyHydrant(this.unitHydrant, this.unitHydrantForm.value);
    }
  }

  compareUnitHydrant(d1: StationEntity, d2: StationEntity) {
    return d1 && d2 ? d1.id === d2.id : d1 === d2;
  }
}
