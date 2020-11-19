import { DomSanitizer } from '@angular/platform-browser';
import { UploadService } from 'src/app/shared/services/upload.service';
import { DialogInfoTitleEnum } from './../../../../../shared/components/dialog-info/dialog-info-title.enum';
import { ErrorTypeEnum } from './../../../../../shared/constants/error-type.enum';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { SectorEntity } from '../../../../../modules/wrap/sector/sector.entity';
import { SectorService } from '../../../../../modules/wrap/sector/sector.service';
import { SetEntity } from '../../../../../modules/wrap/set/set.entity';
import { SetService } from '../../../../../modules/wrap/set/set.service';
import { StationEntity } from '../../../../../modules/wrap/station/station.entity';
import { StationService } from '../../../../../modules/wrap/station/station.service';
import { DialogInfoComponent } from '../../../../../shared/components/dialog-info/dialog-info.component';
import { GLOBAL } from '../../../../../shared/constants/global.constant';
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
export class DialogUnitGenericCreateComponent implements OnInit, OnDestroy {
  consDialogInfo = GLOBAL.FUNCTION_NOT_ALLOWED;
  create = true;
  loading = false;

  sectors: Observable<SectorEntity[]>;
  stations: Observable<StationEntity[]>;
  sets: Observable<SetEntity[]>;

  unitGenericForm: FormGroup;

  imageURL = GLOBAL.IMAGE_DEFAULT;
  file: File;

  // ==================================================

  constructor(
    private readonly _matDialog: MatDialog,
    private readonly _sectorService: SectorService,
    private readonly _setService: SetService,
    private readonly _stationService: StationService,
    private readonly _unitGenericService: UnitGenericService,
    private readonly _unitGenericFactory: UnitGenericFactory,
    private readonly _formBuilder: FormBuilder,
    private readonly _dialogRef: MatDialogRef<DialogUnitGenericCreateComponent>,
    private readonly _uploadService: UploadService,
    private readonly _sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA)
    public unitGeneric: UnitGenericEntity
  ) {}

  // ==================================================

  ngOnInit(): void {
    this.sectors = this._sectorService.getSectors();
    this.stations = this._stationService.getStations();
    this.sets = this._setService.getSets();

    if (this.unitGeneric) {
      this.initUnitGenericUpdate();
    } else {
      this.initUnitGenericCreate();
    }

    this.unitGenericForm = this._formBuilder.group({
      id: [this.unitGeneric.id],
      data1: [this.unitGeneric.data1],
      data2: [this.unitGeneric.data2],
      data3: [this.unitGeneric.data3],
      data4: [this.unitGeneric.data4],
      data5: [this.unitGeneric.data5],
      unit: this._formBuilder.group({
        active: [this.unitGeneric.unit.active, [Validators.required]],
        id: [this.unitGeneric.unit.id],
        code: [
          this.unitGeneric.unit.code,
          [Validators.required, Validators.min(0), Validators.max(99999)],
        ],
        altitude: [
          this.unitGeneric.unit.altitude,
          [Validators.required, Validators.min(0), Validators.max(1000)],
        ],
        latitude: [
          this.unitGeneric.unit.latitude,
          [Validators.required, Validators.min(-90), Validators.max(90)],
        ],
        longitude: [
          this.unitGeneric.unit.longitude,
          [Validators.required, Validators.min(-90), Validators.max(90)],
        ],
        unitTypeTable: [this.unitGeneric.unit.unitTypeTable],
        sector: [this.unitGeneric.unit.sector, [Validators.required]],
        station: [this.unitGeneric.unit.station],
        sets: [this.unitGeneric.unit.sets],
        description: [this.unitGeneric.unit.description],
        image: [this.unitGeneric.unit.image],
      }),
    });
  }

  // ==================================================

  private initUnitGenericUpdate(): void {
    this.create = false;
    if (
      this.unitGeneric.unit.image !== undefined &&
      this.unitGeneric.unit.image !== null &&
      this.unitGeneric.unit.image !== ''
    ) {
      this._uploadService.getImage(this.unitGeneric.unit.image).subscribe(
        (next) => {
          const reader = new FileReader();
          reader.onload = () => {
            this.imageURL = this._sanitizer.bypassSecurityTrustResourceUrl(
              reader.result as string
            ) as string;
          };
          reader.readAsDataURL(next);
        },
        (error) => {
          this._matDialog.open(DialogInfoComponent, {
            data: {
              errorType: ErrorTypeEnum.FRONT_ERROR,
              title: DialogInfoTitleEnum.WARNING,
              error,
            },
          });
        }
      );
    }
  }

  // ==================================================

  private initUnitGenericCreate(): void {
    this.create = true;
    this.unitGeneric = new UnitGenericEntity();
    this.unitGeneric.unit = new UnitEntity();
  }

  // ==================================================

  accept(): void {
    if (this.unitGenericForm.valid) {
      this.loading = true;
      this.uploadImage();
      this.loading = false;
    } else {
      let html = '<h2>Existen campos incorrectos</h2><ul>';
      if (this.unitGenericForm.get('unit.code').invalid) {
        html += '<li>El código debe estar entre 0 y 99999</li>';
      }
      if (this.unitGenericForm.get('unit.altitude').invalid) {
        html += '<li>La altitud debe estar entre 0 y 1000</li>';
      }
      if (this.unitGenericForm.get('unit.latitude').invalid) {
        html += '<li>La latitud debe estar entre -90 y 90';
      }
      if (this.unitGenericForm.get('unit.longitude').invalid) {
        html += '<li>La longitud debe estar entre -90 y 90';
      }
      if (this.unitGenericForm.get('unit.sector').invalid) {
        html += '<li>Debe seleccionar un sector</li>';
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

  private createOrUpdateUnitGeneric(): void {
    if (this.create) {
      this.createUnitGeneric();
    } else {
      this.updateUnitGeneric();
    }
  }

  // ==================================================

  createUnitGeneric(): void {
    const unitGenericCreateDto: UnitGenericCreateDto = this._unitGenericFactory.getUnitGenericCreateDto(
      this.unitGenericForm.value
    );
    this._unitGenericService.create(unitGenericCreateDto).subscribe(
      (unitGenericRO) => {
        const newUnitGeneric: UnitGenericEntity = this._unitGenericFactory.createUnitGeneric(
          unitGenericRO.unitGeneric
        );
        this._unitGenericService.getUnitsGeneric().value.push(newUnitGeneric);
        this._unitGenericService.publishCreateOnMQTT(
          this._unitGenericFactory.getUnitGenericWSDto(newUnitGeneric)
        );
        this._unitGenericService.refresh();
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

  updateUnitGeneric(): void {
    const unitGenericUpdateDto: UnitGenericUpdateDto = this._unitGenericFactory.getUnitGenericUpdateDto(
      this.unitGenericForm.value
    );
    this._unitGenericService.update(unitGenericUpdateDto).subscribe(
      (unitGenericRO) => {
        this._unitGenericFactory.updateUnitGeneric(
          this.unitGeneric,
          unitGenericRO.unitGeneric
        );
        this._unitGenericService.publishUpdateOnMQTT(
          this._unitGenericFactory.getUnitGenericWSDto(this.unitGeneric)
        );
        this._unitGenericService.refresh();
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
            this.unitGenericForm.value.unit.image = next.filename;
            this.createOrUpdateUnitGeneric();
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
      this.createOrUpdateUnitGeneric();
    }
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
        this.imageURL = reader.result as string;
        this.file = file;
      };
      reader.readAsDataURL(file);
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

  ngOnDestroy(): void {
    this.unitGeneric = null;
  }
}
