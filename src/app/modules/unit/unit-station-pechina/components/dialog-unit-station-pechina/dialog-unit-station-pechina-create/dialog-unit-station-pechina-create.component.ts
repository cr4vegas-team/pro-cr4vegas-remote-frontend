import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { SectorEntity } from 'src/app/modules/wrap/sector/sector.entity';
import { SectorService } from 'src/app/modules/wrap/sector/sector.service';
import { SetEntity } from 'src/app/modules/wrap/set/set.entity';
import { SetService } from 'src/app/modules/wrap/set/set.service';
import { DialogInfoTitleEnum } from 'src/app/shared/components/dialog-info/dialog-info-title.enum';
import { DialogInfoComponent } from 'src/app/shared/components/dialog-info/dialog-info.component';
import { ErrorTypeEnum } from 'src/app/shared/constants/error-type.enum';
import { GLOBAL } from 'src/app/shared/constants/global.constant';
import { UploadService } from 'src/app/shared/services/upload.service';
import { UnitStationPechinaUpdateDto } from '../../../dto/unit-station-pechina-update.dto';
import { UnitStationPechinaFactoryService } from './../../../unit-station-pechina-factory.service';
import { UnitStationPechinaSocketService } from './../../../unit-station-pechina-socket.service';
import { UnitStationPechinaEntity } from './../../../unit-station-pechina.entity';
import { UnitStationPechinaService } from './../../../unit-station-pechina.service';

@Component({
  selector: 'app-dialog-unit-station-pechina-create',
  templateUrl: './dialog-unit-station-pechina-create.component.html',
  styleUrls: ['./dialog-unit-station-pechina-create.component.css'],
})
export class DialogUnitStationPechinaCreateComponent
  implements OnInit, OnDestroy {
  consDialogInfo = GLOBAL.FUNCTION_NOT_ALLOWED;
  create = true;
  loading = false;

  sectors: Observable<SectorEntity[]>;
  sets: Observable<SetEntity[]>;

  unitStationPechinaForm: FormGroup;

  imageURL = GLOBAL.IMAGE_DEFAULT;
  file: File;

  constructor(
    private readonly _matDialog: MatDialog,
    private readonly _sectorService: SectorService,
    private readonly _setService: SetService,
    private readonly _unitStationPechinaService: UnitStationPechinaService,
    private readonly _unitStationPechinaFactoryService: UnitStationPechinaFactoryService,
    private readonly _formBuilder: FormBuilder,
    private readonly _dialogRef: MatDialogRef<DialogUnitStationPechinaCreateComponent>,
    private readonly _uploadService: UploadService,
    private readonly _sanitizer: DomSanitizer,
    private readonly _unitStationPechinaSockerService: UnitStationPechinaSocketService,
    @Inject(MAT_DIALOG_DATA)
    public unitStationPechina: UnitStationPechinaEntity
  ) {}

  ngOnInit(): void {
    this.sectors = this._sectorService.getSectors();
    this.sets = this._setService.getSets();

    if (this.unitStationPechina) {
      this.initUnitStationPechinaUpdate();
    } else {
      this.close();
    }

    this.unitStationPechinaForm = this._formBuilder.group({
      id: [this.unitStationPechina.id],
      readingBatch: [this.unitStationPechina.readingBatch],
      unit: this._formBuilder.group({
        active: [this.unitStationPechina.unit.active, [Validators.required]],
        id: [this.unitStationPechina.unit.id],
        code: [
          this.unitStationPechina.unit.code,
          [Validators.required, Validators.min(0), Validators.max(99999)],
        ],
        altitude: [
          this.unitStationPechina.unit.altitude,
          [Validators.required, Validators.min(0), Validators.max(1000)],
        ],
        latitude: [
          this.unitStationPechina.unit.latitude,
          [Validators.required, Validators.min(-90), Validators.max(90)],
        ],
        longitude: [
          this.unitStationPechina.unit.longitude,
          [Validators.required, Validators.min(-90), Validators.max(90)],
        ],
        unitTypeTable: [this.unitStationPechina.unit.unitTypeTable],
        sector: [this.unitStationPechina.unit.sector, [Validators.required]],
        sets: [this.unitStationPechina.unit.sets],
        description: [this.unitStationPechina.unit.description],
        image: [this.unitStationPechina.unit.image],
        name: [this.unitStationPechina.unit.name, [Validators.required]],
      }),
    });
  }

  private initUnitStationPechinaUpdate(): void {
    this.create = false;
    if (
      this.unitStationPechina.unit.image !== undefined &&
      this.unitStationPechina.unit.image !== null &&
      this.unitStationPechina.unit.image !== ''
    ) {
      this._uploadService
        .getImage(this.unitStationPechina.unit.image)
        .subscribe(
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

  accept(): void {
    if (this.unitStationPechinaForm.valid) {
      this.loading = true;
      this.uploadImage();
      this.loading = false;
    } else {
      let html = '<h2>Existen campos incorrectos</h2><ul>';
      if (this.unitStationPechinaForm.get('unit.code').invalid) {
        html += '<li>El código debe estar entre 0 y 99999</li>';
      }
      if (this.unitStationPechinaForm.get('unit.altitude').invalid) {
        html += '<li>La altitud debe estar entre 0 y 1000</li>';
      }
      if (this.unitStationPechinaForm.get('unit.latitude').invalid) {
        html += '<li>La latitud debe estar entre -90 y 90';
      }
      if (this.unitStationPechinaForm.get('unit.longitude').invalid) {
        html += '<li>La longitud debe estar entre -90 y 90';
      }
      if (this.unitStationPechinaForm.get('unit.sector').invalid) {
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

  updateUnitStationPechina(): void {
    const unitStationPechinaUpdateDto: UnitStationPechinaUpdateDto = this._unitStationPechinaFactoryService.getUnitStationUpdateDto(
      this.unitStationPechinaForm.value
    );
    this._unitStationPechinaService
      .update(unitStationPechinaUpdateDto)
      .subscribe(
        (unitStationPechina) => {
          this._unitStationPechinaFactoryService.copyUnitStationPechina(
            this.unitStationPechina,
            unitStationPechina
          );
          this._unitStationPechinaService.refresh();
          this._unitStationPechinaSockerService.sendChange(
            this._unitStationPechinaFactoryService.getUnitStationPechinaWSDto(
              this.unitStationPechina
            )
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

  private uploadImage(): void {
    if (this.file !== undefined && this.file !== null) {
      const formData = new FormData();
      formData.append('file', this.file, this.file.name);
      this._uploadService.uploadImage(formData).subscribe(
        (next) => {
          if (next) {
            this.unitStationPechinaForm.value.unit.image = next.filename;
            this.updateUnitStationPechina();
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
      this.updateUnitStationPechina();
    }
  }

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

  compareUnitStationPechina(d1: any, d2: any): boolean {
    return d1 && d2 && d1.id === d2.id;
  }

  close(): void {
    this._dialogRef.close();
  }

  ngOnDestroy(): void {
    this.unitStationPechina = null;
  }
}
