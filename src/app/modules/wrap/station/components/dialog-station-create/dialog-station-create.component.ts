import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { UnitEntity } from 'src/app/modules/unit/unit/unit.entity';
import { UnitService } from 'src/app/modules/unit/unit/unit.service';
import { DialogInfoTitleEnum } from 'src/app/shared/components/dialog-info/dialog-info-title.enum';
import { DialogInfoComponent } from 'src/app/shared/components/dialog-info/dialog-info.component';
import { ErrorTypeEnum } from 'src/app/shared/constants/error-type.enum';
import { GLOBAL } from 'src/app/shared/constants/global.constant';
import { StationCreateDto } from '../../dto/station-create.dto';
import { StationUpdateDto } from '../../dto/station-update.dto';
import { StationEntity } from '../../station.entity';
import { StationFactory } from '../../station.factory';
import { StationService } from '../../station.service';
import { UploadService } from './../../../../../shared/services/upload.service';
import { StationSocketService } from './../../station-socket.service';

@Component({
  selector: 'app-dialog-station-create',
  templateUrl: './dialog-station-create.component.html',
})
export class DialogStationCreateComponent implements OnInit, OnDestroy {
  consDialogInfo = GLOBAL.FUNCTION_NOT_ALLOWED;
  create = true;
  loading = false;

  stationForm: FormGroup;
  units: UnitEntity[];
  subUnits: Subscription;

  selectable = false;
  removable = true;

  imageUrl = GLOBAL.IMAGE_DEFAULT;
  file: File;

  // ==================================================

  constructor(
    private readonly _matDialog: MatDialog,
    private readonly _stationService: StationService,
    private readonly _stationFactory: StationFactory,
    private readonly _formBuilder: FormBuilder,
    private readonly _dialogRef: MatDialogRef<DialogStationCreateComponent>,
    private readonly _unitService: UnitService,
    private readonly _uploadService: UploadService,
    private readonly _sanitizer: DomSanitizer,
    private readonly _stationSocketService: StationSocketService,
    @Inject(MAT_DIALOG_DATA)
    public station: StationEntity
  ) {}

  // ==================================================

  ngOnInit(): void {
    this.subUnits = this._unitService.findAll().subscribe((unitsRO) => {
      this.units = unitsRO.units;
    });

    if (this.station) {
      this.initStationUpdate();
    } else {
      this.initStationCreate();
    }

    this.stationForm = this._formBuilder.group({
      id: [this.station.id],
      code: [this.station.code, [Validators.pattern('[A-Z0-9]{1,5}')]],
      name: [this.station.name, [Validators.required]],
      description: [this.station.description],
      altitude: [
        this.station.altitude,
        [Validators.required, Validators.min(0), Validators.max(1000)],
      ],
      latitude: [
        this.station.latitude,
        [Validators.required, Validators.min(-90), Validators.max(90)],
      ],
      longitude: [
        this.station.longitude,
        [Validators.required, Validators.min(-90), Validators.max(90)],
      ],
      active: [this.station.active, [Validators.required]],
      units: [this.station.units],
      image: [this.station.image],
    });
  }

  // ==================================================

  private initStationUpdate(): void {
    this.create = false;
    if (
      this.station.image !== undefined &&
      this.station.image !== null &&
      this.station.image !== ''
    ) {
      this._uploadService.getImage(this.station.image).subscribe(
        (next) => {
          const reader = new FileReader();
          reader.onload = () => {
            this.imageUrl = this._sanitizer.bypassSecurityTrustResourceUrl(
              reader.result as string
            ) as string;
          };
          reader.readAsDataURL(next);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  // ==================================================

  private initStationCreate(): void {
    this.create = true;
    this.station = new StationEntity();
    this.imageUrl = GLOBAL.IMAGE_DEFAULT;
  }

  // ==================================================

  accept(): void {
    if (this.stationForm.valid) {
      this.loading = true;
      this.uploadImage();
      this.loading = false;
    } else {
      let html = '<h2>Existen campos incorrectos</h2><ul>';
      if (this.stationForm.get('code').invalid) {
        html +=
          '<li>El código debe contener de 1 a 5 caracteres (letras mayúsculas o números)</li>';
      }
      if (this.stationForm.get('name').invalid) {
        html += '<li>El nombre debe estar entre 3 y 45 caracteres</li>';
      }
      if (this.stationForm.get('altitude').invalid) {
        html += '<li>La altitud debe estar entre 0 y 1000</li>';
      }
      if (this.stationForm.get('latitude').invalid) {
        html += '<li>La latitud debe estar entre -90 y 90';
      }
      if (this.stationForm.get('longitude').invalid) {
        html += '<li>La longitud debe estar entre -90 y 90';
      }
      html += '</ul>';
      this._matDialog.open(DialogInfoComponent, {
        data: {
          errorType: ErrorTypeEnum.FRONT_ERROR,
          title: DialogInfoTitleEnum.WARNING,
          html,
        },
      });
    }
  }

  // ==================================================

  private createOrUpdateStation(): void {
    if (this.create) {
      this.createStation();
    } else {
      this.updateStation();
    }
  }

  // ==================================================

  private createStation(): void {
    const stationCreateDto: StationCreateDto = this._stationFactory.getStationCreateDto(
      this.stationForm.value
    );
    this._stationService.create(stationCreateDto).subscribe(
      (stationRO) => {
        const newStation = this._stationFactory.createStation(
          stationRO.station
        );
        this._stationService.getStations().value.push(newStation);
        this._stationService.refresh();
        this._stationSocketService.sendChange(
          this._stationFactory.getStationWSDto(newStation)
        );
        this.close();
      },
      (error) => {
        this._matDialog.open(DialogInfoComponent, {
          data: {
            errorType: ErrorTypeEnum.API_ERROR,
            title: DialogInfoTitleEnum.WARNING,
            html: error,
          },
        });
      }
    );
  }

  // ==================================================

  private updateStation(): void {
    const stationUpdateDto: StationUpdateDto = this._stationFactory.getStationUpdateDto(
      this.stationForm.value
    );
    this._stationService.update(stationUpdateDto).subscribe(
      (stationRO) => {
        this._stationFactory.copyStation(this.station, stationRO.station);
        this._stationService.refresh();
        this._stationSocketService.sendChange(
          this._stationFactory.getStationWSDto(this.station)
        );
        this.close();
      },
      (error) => {
        this._matDialog.open(DialogInfoComponent, {
          data: {
            errorType: ErrorTypeEnum.API_ERROR,
            title: DialogInfoTitleEnum.WARNING,
            html: error,
          },
        });
      }
    );
  }

  // ==================================================

  private uploadImage(): void {
    if (this.file !== undefined && this.file !== null) {
      const formData = new FormData();
      formData.append('file', this.file, this.file.name);
      this._uploadService.uploadImage(formData).subscribe(
        (next) => {
          if (next) {
            this.stationForm.value.image = next.filename;
            this.createOrUpdateStation();
          }
        },
        (error) => {
          this._matDialog.open(DialogInfoComponent, {
            data: {
              errorType: ErrorTypeEnum.API_ERROR,
              title: DialogInfoTitleEnum.WARNING,
              html: error,
            },
          });
        }
      );
    } else {
      this.createOrUpdateStation();
    }
  }

  // ==================================================

  compareUnitGeneric(d1: any, d2: any): boolean {
    return d1 && d2 && d1.id === d2.id;
  }

  // ==================================================

  close(): void {
    this._dialogRef.close();
  }

  // ==================================================

  remove(removeUnit: UnitEntity): void {
    this.stationForm
      .get('units')
      .setValue(
        this.stationForm.value.units.filter((unit) => unit.id !== removeUnit.id)
      );
  }

  // ==================================================

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files[0];
    let validImage = true;
    let html = '<h2>Existen campos incorrectos</h2><ul>';
    if (!file.name.endsWith('.jpg')) {
      html += '<li>Solo se permiten imágenes en .jpg</li>';
      validImage = false;
    }
    if (file.size > 5000000) {
      html += '<li>El tamaño máximo permitido son 5 MB (5000000 Bytes)';
      validImage = false;
    }
    html += '</ul>';
    if (!validImage) {
      this._matDialog.open(DialogInfoComponent, {
        data: {
          errorType: ErrorTypeEnum.FRONT_ERROR,
          title: DialogInfoTitleEnum.WARNING,
          html,
        },
      });
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result as string;
        this.file = file;
      };
      reader.readAsDataURL(file);
    }
  }

  // ==================================================

  ngOnDestroy(): void {
    this.station = null;
    if (this.subUnits) {
      this.subUnits.unsubscribe();
    }
  }
}
