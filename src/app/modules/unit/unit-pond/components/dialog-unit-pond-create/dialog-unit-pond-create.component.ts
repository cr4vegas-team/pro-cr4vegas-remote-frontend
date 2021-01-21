import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { DialogInfoTitleEnum } from 'src/app/shared/components/dialog-info/dialog-info-title.enum';
import { UploadService } from 'src/app/shared/services/upload.service';
import { UnitPondEntity } from '../../../../../modules/unit/unit-pond/unit-pond.entity';
import { UnitPondFactory } from '../../../../../modules/unit/unit-pond/unit-pond.factory';
import { UnitPondService } from '../../../../../modules/unit/unit-pond/unit-pond.service';
import { UnitEntity } from '../../../../../modules/unit/unit/unit.entity';
import { SectorEntity } from '../../../../../modules/wrap/sector/sector.entity';
import { SectorService } from '../../../../../modules/wrap/sector/sector.service';
import { SetEntity } from '../../../../../modules/wrap/set/set.entity';
import { SetService } from '../../../../../modules/wrap/set/set.service';
import { DialogInfoComponent } from '../../../../../shared/components/dialog-info/dialog-info.component';
import { GLOBAL } from '../../../../../shared/constants/global.constant';
import { UnitPondCreateDto } from '../../dto/unit-pond-create.dto';
import { UnitPondUpdateDto } from '../../dto/unit-pond-update.dto';
import { UnitPondSocketService } from '../../unit-pond-socket.service';
import { ErrorTypeEnum } from './../../../../../shared/constants/error-type.enum';

@Component({
  selector: 'app-dialog-unit-pond-create',
  templateUrl: './dialog-unit-pond-create.component.html',
})
export class DialogUnitPondCreateComponent implements OnInit, OnDestroy {
  consDialogInfo = GLOBAL.FUNCTION_NOT_ALLOWED;
  create = true;
  loading = false;

  sectors: Observable<SectorEntity[]>;
  sets: Observable<SetEntity[]>;

  unitPondForm: FormGroup;

  imageURL = GLOBAL.IMAGE_DEFAULT;
  file: File;

  // ==================================================

  constructor(
    private readonly _matDialog: MatDialog,
    private readonly _sectorService: SectorService,
    private readonly _setService: SetService,
    private readonly _unitPondService: UnitPondService,
    private readonly _unitPondFactory: UnitPondFactory,
    private readonly _formBuilder: FormBuilder,
    private readonly _uploadService: UploadService,
    private readonly _sanitizer: DomSanitizer,
    private readonly _dialogRef: MatDialogRef<DialogUnitPondCreateComponent>,
    private readonly _unitPondSocketService: UnitPondSocketService,
    @Inject(MAT_DIALOG_DATA)
    public unitPond: UnitPondEntity
  ) {}

  // ==================================================

  ngOnInit(): void {
    this.sectors = this._sectorService.getSectors();
    this.sets = this._setService.getSets();

    if (this.unitPond) {
      this.initUnitPondUpdate();
    } else {
      this.initUnitPondCreate();
    }

    this.unitPondForm = this._formBuilder.group({
      id: [this.unitPond.id],
      m3: [this.unitPond.m3],
      height: [this.unitPond.height],
      unit: this._formBuilder.group({
        active: [this.unitPond.unit.active, [Validators.required]],
        id: [this.unitPond.unit.id],
        code: [
          this.unitPond.unit.code,
          [Validators.required, Validators.min(0), Validators.max(99999)],
        ],
        altitude: [
          this.unitPond.unit.altitude,
          [Validators.required, Validators.min(0), Validators.max(1000)],
        ],
        latitude: [
          this.unitPond.unit.latitude,
          [Validators.required, Validators.min(-90), Validators.max(90)],
        ],
        longitude: [
          this.unitPond.unit.longitude,
          [Validators.required, Validators.min(-90), Validators.max(90)],
        ],
        unitTypeTable: [this.unitPond.unit.unitTypeTable],
        sector: [this.unitPond.unit.sector, [Validators.required]],
        sets: [this.unitPond.unit.sets],
        description: [this.unitPond.unit.description],
        image: [this.unitPond.unit.image],
      }),
    });
  }

  // ==================================================

  private initUnitPondUpdate(): void {
    this.create = false;
    if (
      this.unitPond.unit.image !== undefined &&
      this.unitPond.unit.image !== null &&
      this.unitPond.unit.image !== ''
    ) {
      this._uploadService.getImage(this.unitPond.unit.image).subscribe(
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

  private initUnitPondCreate(): void {
    this.create = true;
    this.unitPond = new UnitPondEntity();
    this.unitPond.unit = new UnitEntity();
  }

  // ==================================================

  openDialogInfo(data: string): void {
    this._matDialog.open(DialogInfoComponent, { data });
  }

  // ==================================================

  accept(): void {
    if (this.unitPondForm.valid) {
      this.loading = true;
      this.uploadImage();
      this.loading = false;
    } else {
      let html = '<h2>Existen campos incorrectos</h2><ul>';
      if (this.unitPondForm.get('unit.code').invalid) {
        html += '<li>El código debe estar entre 0 y 99999</li>';
      }
      if (this.unitPondForm.get('unit.altitude').invalid) {
        html += '<li>La altitud debe estar entre 0 y 1000</li>';
      }
      if (this.unitPondForm.get('unit.latitude').invalid) {
        html += '<li>La latitud debe estar entre -90 y 90';
      }
      if (this.unitPondForm.get('unit.longitude').invalid) {
        html += '<li>La longitud debe estar entre -90 y 90';
      }
      if (this.unitPondForm.get('unit.sector').invalid) {
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

  private createOrUpdateUnitPond(): void {
    if (this.create) {
      this.createUnitPond();
    } else {
      this.updateUnitPond();
    }
  }

  // ==================================================

  createUnitPond(): void {
    const unitPondCreateDto: UnitPondCreateDto = this._unitPondFactory.getUnitPondCreateDto(
      this.unitPondForm.value
    );
    this._unitPondService.create(unitPondCreateDto).subscribe(
      (unitPondRO) => {
        const newUnitPond: UnitPondEntity = this._unitPondFactory.createUnitPond(
          unitPondRO.unitPond
        );
        this._unitPondService.getUnitsPonds().value.push(newUnitPond);
        this._unitPondService.refresh();
        this._unitPondSocketService.sendChange(
          this._unitPondFactory.getUnitPondWSDto(newUnitPond)
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

  updateUnitPond(): void {
    const unitPondUpdateDto: UnitPondUpdateDto = this._unitPondFactory.getUnitPondUpdateDto(
      this.unitPondForm.value
    );
    this._unitPondService.update(unitPondUpdateDto).subscribe(
      (unitGenericRO) => {
        this._unitPondFactory.copyUnitPond(
          this.unitPond,
          unitGenericRO.unitPond
        );
        this._unitPondService.refresh();
        this._unitPondSocketService.sendChange(
          this._unitPondFactory.getUnitPondWSDto(this.unitPond)
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
            this.unitPondForm.value.unit.image = next.filename;
            this.createOrUpdateUnitPond();
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
      this.createOrUpdateUnitPond();
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
    this.unitPond = null;
  }
}
