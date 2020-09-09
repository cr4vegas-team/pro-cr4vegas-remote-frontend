import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogInfoComponent } from 'src/app/shared/components/dialog-info/dialog-info.component';
import { GLOBAL } from 'src/app/shared/constants/global.constant';
import { StationCreateDto } from '../../dto/station-create.dto';
import { StationUpdateDto } from '../../dto/station-update.dto';
import { StationEntity } from '../../station.entity';
import { StationFactory } from '../../station.factory';
import { StationService } from '../../station.service';

@Component({
  selector: 'app-dialog-station-create',
  templateUrl: './dialog-station-create.component.html',
})
export class DialogStationCreateComponent implements OnInit {


  consDialogInfo = GLOBAL.FUNCTION_NOT_ALLOWED;
  create: boolean = true;

  // Froms control
  stationForm: FormGroup;

  constructor(
    private readonly _matDialog: MatDialog,
    private readonly _stationService: StationService,
    private readonly _stationFactory: StationFactory,
    private readonly _formBuilder: FormBuilder,
    private readonly _dialogRef: MatDialogRef<DialogStationCreateComponent>,
    @Inject(MAT_DIALOG_DATA)
    public station: StationEntity
  ) {
    if (this.station) {
      this.create = false;
    } else {
      this.create = true;
      this.station = new StationEntity();
    }

    this.stationForm = this._formBuilder.group({
      id: [this.station.id],
      code: [this.station.code],
      name: [this.station.name],
      description: [this.station.description],
      altitude: [this.station.altitude],
      longitude: [this.station.longitude],
      latitude: [this.station.latitude],
    });
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.station = null;
  }

  openDialogInfo(data: string) {
    this._matDialog.open(DialogInfoComponent, { data });
  }

  accept() {
    try {
      if (!this.stationForm.valid) {
        throw new Error(`
          <p>El código es incorrecto. Ejemplo: ET000150. Código + 6 dígitos. Código:</p>
          <ul>
              <li>ET = Estación</li>
          </ul>
        `);
      }
      const newStation: StationEntity = this._stationFactory.createStation(this.stationForm.value);
      if (this.create) {
        this.createStation(newStation);
      } else {
        this.updateStation(newStation);
      }
    } catch (error) {
      this._matDialog.open(DialogInfoComponent, { data: { title: 'Error', html: error } });
    }
  }

  createStation(newStation: StationEntity) {
    const stationCreateDto: StationCreateDto = this._stationFactory.getStationCreateDto(newStation);
    this._stationService.create(stationCreateDto).subscribe(
      stationRO => {
        const newStation: StationEntity = this._stationFactory.createStation(stationRO.station);
        this._stationService.addMarker(newStation);
        this._stationService.stations.value.push(newStation);
        this._stationService.next();
        this.close();
      },
      error => {
        this._matDialog.open(DialogInfoComponent, { data: { title: 'Error', html: error.error.description } });
      }
    );
  }

  updateStation(newStation: StationEntity) {
    const stationUpdateDto: StationUpdateDto = this._stationFactory.getStationUpdateDto(newStation);
    this._stationService.update(stationUpdateDto).subscribe(
      stationRO => {
        this._stationFactory.copy(this.station, stationRO.station);
        this._stationService.addMarker(this.station);
        this._stationService.next();
      },
      error => {
        this._matDialog.open(DialogInfoComponent, { data: { title: 'Error', html: error.error.description } });
      }
    )
  }

  compareUnitGeneric(d1: any, d2: any) {
    return d1 && d2 && d1.id === d2.id;
  }

  close() {
    this._dialogRef.close();
  }

}
