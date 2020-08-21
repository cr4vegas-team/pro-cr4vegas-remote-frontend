import { Component, forwardRef, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UnitEntity } from 'src/app/models/unit.entity';
import { UnitHydrantService } from 'src/app/services/api/unit-hydrant.service';
import { UnitService } from 'src/app/services/api/unit.service';
import { SectorEntity } from '../../../models/sector.entity';
import { SetEntity } from '../../../models/set.entity';
import { StationEntity } from '../../../models/station.entity';
import { UnitHydrantEntity } from '../../../models/unit-hydrant.entity';
import { SectorService } from '../../../services/api/sector.service';
import { SetService } from '../../../services/api/set.service';
import { StationService } from '../../../services/api/station.service';
import { DialogInfoComponent } from '../dialog-info/dialog-info.component';
import { CONS_DIALOG_INFO } from '../dialog-info/dialog-info.constants';
import { DialogUnitHydrantComponent } from '../dialog-unit-hydrant/dialog-unit-hydrant.component';

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
    private readonly _unitService: UnitService,
    @Inject(MAT_DIALOG_DATA)
    public unitHydrant: UnitHydrantEntity
  ) {
    if (this.unitHydrant) {
      this.create = false;
    } else {
      this.create = true;
      this.unitHydrant = this._unitService.unitFactory.createUnitHydrant();
      this.unitHydrant.setUnit(this._unitService.unitFactory.createUnit());
    }
    this.sectors = [];
    this.stations = [];
    this.sets = [];
    this.unitHydrantForm = new FormGroup({
      code: new FormControl(this.unitHydrant.getCode(), [Validators.required, Validators.pattern("HD[0-9]{5}")]),
      filter: new FormControl(this.unitHydrant.getFilter()),
      diameter: new FormControl(this.unitHydrant.getDiameter()),
      unit: new FormGroup({
        altitude: new FormControl(this.unitHydrant.getUnit().getAltitude(), [Validators.required]),
        latitude: new FormControl(this.unitHydrant.getUnit().getLatitude(), [Validators.required]),
        longitude: new FormControl(this.unitHydrant.getUnit().getLongitude(), [Validators.required]),
        sector: new FormControl(this.unitHydrant.getUnit().getSector()),
        station: new FormControl(this.unitHydrant.getUnit().getStation()),
        sets: new FormControl(this.unitHydrant.getUnit().getSets()),
        description: new FormControl(this.unitHydrant.getUnit().getDescription()),
      })
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

  bopenDialogInfo(data: string) {
    this._matDialog.open(DialogInfoComponent, { data });
  }

  accept() {
    if (this.create) {
      this._unitHydrantService.addHydrant(this.unitHydrant);
    } else {
      this._unitHydrantService.modifyHydrant(this.unitHydrant, this.unitHydrantForm.value);
    }
  }

}
