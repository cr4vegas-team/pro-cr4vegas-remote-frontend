import { UnitHydrantSocketService } from './../../unit-hydrant-socket.service';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { DialogInfoTitleEnum } from 'src/app/shared/components/dialog-info/dialog-info-title.enum';
import { ErrorTypeEnum } from 'src/app/shared/constants/error-type.enum';
import { UploadService } from 'src/app/shared/services/upload.service';
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
import { DialogInfoComponent } from '../../../../../shared/components/dialog-info/dialog-info.component';
import { GLOBAL } from '../../../../../shared/constants/global.constant';
import { UnitHydrantCreateDto } from '../../dto/unit-hydrant-create.dto';
import { UnitHydrantUpdateDto } from '../../dto/unit-hydrant-update.dto';

@Component({
  selector: 'app-dialog-unit-hydrant-create',
  templateUrl: './dialog-unit-hydrant-create.component.html',
})
export class DialogUnitHydrantCreateComponent implements OnInit, OnDestroy {
  consDialogInfo = GLOBAL.FUNCTION_NOT_ALLOWED;
  create = true;
  loading = false;

  sectors: Observable<SectorEntity[]>;
  stations: Observable<StationEntity[]>;
  sets: Observable<SetEntity[]>;

  unitHydrantForm: FormGroup;

  imageURL = GLOBAL.IMAGE_DEFAULT;
  file: File;

  // ==================================================

  constructor(
    private readonly _matDialog: MatDialog,
    private readonly _sectorService: SectorService,
    private readonly _setService: SetService,
    private readonly _stationService: StationService,
    private readonly _unitHydrantService: UnitHydrantService,
    private readonly _unitHydrantFactory: UnitHydrantFactory,
    private readonly _formBuilder: FormBuilder,
    private readonly _dialogRef: MatDialogRef<DialogUnitHydrantCreateComponent>,
    private readonly _uploadService: UploadService,
    private readonly _sanitizer: DomSanitizer,
    private readonly _unitHydrantSockerService: UnitHydrantSocketService,
    @Inject(MAT_DIALOG_DATA)
    public unitHydrant: UnitHydrantEntity
  ) {}

  // ==================================================

  ngOnInit(): void {
    this.sectors = this._sectorService.getSectors();
    this.stations = this._stationService.getStations();
    this.sets = this._setService.getSets();

    if (this.unitHydrant) {
      this.initUnitHydrantUpdate();
    } else {
      this.initUnitHydrantCreate();
    }

    this.unitHydrantForm = this._formBuilder.group({
      id: [this.unitHydrant.id],
      filter: [this.unitHydrant.filter],
      diameter: [this.unitHydrant.diameter],
      unit: this._formBuilder.group({
        active: [this.unitHydrant.unit.active, [Validators.required]],
        id: [this.unitHydrant.unit.id],
        code: [
          this.unitHydrant.unit.code,
          [Validators.required, Validators.min(0), Validators.max(99999)],
        ],
        altitude: [
          this.unitHydrant.unit.altitude,
          [Validators.required, Validators.min(0), Validators.max(1000)],
        ],
        latitude: [
          this.unitHydrant.unit.latitude,
          [Validators.required, Validators.min(-90), Validators.max(90)],
        ],
        longitude: [
          this.unitHydrant.unit.longitude,
          [Validators.required, Validators.min(-90), Validators.max(90)],
        ],
        unitTypeTable: [this.unitHydrant.unit.unitTypeTable],
        sector: [this.unitHydrant.unit.sector, [Validators.required]],
        station: [this.unitHydrant.unit.station],
        sets: [this.unitHydrant.unit.sets],
        description: [this.unitHydrant.unit.description],
        unitType: [this.unitHydrant.unit.unitTypeTable],
        image: [this.unitHydrant.unit.image],
      }),
    });
  }

  // ==================================================

  private initUnitHydrantUpdate(): void {
    this.create = false;
    if (
      this.unitHydrant.unit.image !== undefined &&
      this.unitHydrant.unit.image !== null &&
      this.unitHydrant.unit.image !== ''
    ) {
      this._uploadService.getImage(this.unitHydrant.unit.image).subscribe(
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
          console.log(error);
        }
      );
    }
  }

  // ==================================================

  private initUnitHydrantCreate(): void {
    this.create = true;
    this.unitHydrant = new UnitHydrantEntity();
    this.unitHydrant.unit = new UnitEntity();
  }

  // ==================================================

  accept(): void {
    if (this.unitHydrantForm.valid) {
      this.loading = true;
      this.uploadImage();
      this.loading = false;
    } else {
      let html = '<h2>Existen campos incorrectos</h2><ul>';
      if (this.unitHydrantForm.get('unit.code').invalid) {
        html += '<li>El código debe estar entre 0 y 99999</li>';
      }
      if (this.unitHydrantForm.get('unit.altitude').invalid) {
        html += '<li>La altitud debe estar entre 0 y 1000</li>';
      }
      if (this.unitHydrantForm.get('unit.latitude').invalid) {
        html += '<li>La latitud debe estar entre -90 y 90';
      }
      if (this.unitHydrantForm.get('unit.longitude').invalid) {
        html += '<li>La longitud debe estar entre -90 y 90';
      }
      if (this.unitHydrantForm.get('unit.sector').invalid) {
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

  private createOrUpdateUnitHydrant(): void {
    if (this.create) {
      this.createUnitHydrant();
    } else {
      this.updateUnitHydrant();
    }
  }

  // ==================================================

  createUnitHydrant(): void {
    const unitHydrantCreateDto: UnitHydrantCreateDto = this._unitHydrantFactory.getUnitHydrantCreateDto(
      this.unitHydrantForm.value
    );
    this._unitHydrantService.create(unitHydrantCreateDto).subscribe(
      (unitGenericRO) => {
        const newUnitHydrant: UnitHydrantEntity = this._unitHydrantFactory.createUnitHydrant(
          unitGenericRO.unitHydrant
        );
        this._unitHydrantService.getUnitsHydrants().value.push(newUnitHydrant);
        this._unitHydrantService.refresh();
        this._unitHydrantSockerService.sendCreate(
          this._unitHydrantFactory.getUnitHydrantWSDto(newUnitHydrant)
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

  updateUnitHydrant(): void {
    const unitHydrantUpdateDto: UnitHydrantUpdateDto = this._unitHydrantFactory.getUnitHydrantUpdateDto(
      this.unitHydrantForm.value
    );
    this._unitHydrantService.update(unitHydrantUpdateDto).subscribe(
      (unitHydrantRO) => {
        this._unitHydrantFactory.copyUnitHydrant(
          this.unitHydrant,
          unitHydrantRO.unitHydrant
        );
        this._unitHydrantService.refresh();
        this._unitHydrantSockerService.sendUpdate(this._unitHydrantFactory.getUnitHydrantWSDto(this.unitHydrant));
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
            this.unitHydrantForm.value.unit.image = next.filename;
            this.createOrUpdateUnitHydrant();
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
      this.createOrUpdateUnitHydrant();
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

  compareUnitHydrant(d1: any, d2: any): boolean {
    return d1 && d2 && d1.id === d2.id;
  }

  // ==================================================

  close(): void {
    this._dialogRef.close();
  }

  // ==================================================

  ngOnDestroy(): void {
    this.unitHydrant = null;
  }
}
