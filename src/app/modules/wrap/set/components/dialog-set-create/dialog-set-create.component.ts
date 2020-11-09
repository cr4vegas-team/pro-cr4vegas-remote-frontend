import { SetTypeEntity } from './../../set-type.entity';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription, Observable, Subject, BehaviorSubject } from 'rxjs';
import { UnitEntity } from 'src/app/modules/unit/unit/unit.entity';
import { UnitService } from 'src/app/modules/unit/unit/unit.service';
import { DialogInfoTitleEnum } from 'src/app/shared/components/dialog-info/dialog-info-title.enum';
import { ErrorTypeEnum } from 'src/app/shared/constants/error-type.enum';
import { UploadService } from 'src/app/shared/services/upload.service';
import { DialogInfoComponent } from '../../../../../shared/components/dialog-info/dialog-info.component';
import { GLOBAL } from '../../../../../shared/constants/global.constant';
import { SetCreateDto } from '../../dto/set-create.dto';
import { SetUpdateDto } from '../../dto/set-update.dto';
import { SetEntity } from '../../set.entity';
import { SetFactory } from '../../set.factory';
import { SetService } from '../../set.service';

@Component({
  selector: 'app-dialog-set-create',
  templateUrl: './dialog-set-create.component.html',
})
export class DialogSetCreateComponent implements OnInit, OnDestroy {
  consDialogInfo = GLOBAL.FUNCTION_NOT_ALLOWED;
  create = true;
  loading = false;

  setForm: FormGroup;
  units: UnitEntity[];
  subUnits: Subscription;

  selectable = false;
  removable = true;

  imageUrl = GLOBAL.IMAGE_DEFAULT;
  file: File;

  setTypes: SetTypeEntity[];

  // ==================================================

  constructor(
    private readonly _matDialog: MatDialog,
    private readonly _setService: SetService,
    private readonly _setFactory: SetFactory,
    private readonly _formBuilder: FormBuilder,
    private readonly _dialogRef: MatDialogRef<DialogSetCreateComponent>,
    private readonly _unitService: UnitService,
    private readonly _uploadService: UploadService,
    private readonly _sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA)
    public set: SetEntity
  ) {}

  // ==================================================

  ngOnInit(): void {
    this.subUnits = this._unitService.findAll().subscribe((unitsRO) => {
      this.units = unitsRO.units;
    });

    if (this.set) {
      this.initSetUpdate();
    } else {
      this.initSetCreate();
    }

    this.setForm = this._formBuilder.group({
      id: [this.set.id],
      code: [this.set.code, [Validators.pattern('(CJ)([0-9]{6})')]],
      name: [this.set.name, [Validators.required]],
      description: [this.set.description],
      active: [this.set.active, [Validators.required]],
      units: [this.set.units],
      image: [this.set.image],
      setType: [this.set.setType, [Validators.required]],
    });

    this._setService.findAllSetTypes().subscribe((res) => {
      this.setTypes = res;
    });
  }

  // ==================================================

  private initSetUpdate(): void {
    this.create = false;
    if (
      this.set.image !== undefined &&
      this.set.image !== null &&
      this.set.image !== ''
    ) {
      this._uploadService.getImage(this.set.image).subscribe(
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

  private initSetCreate(): void {
    this.create = true;
    this.set = new SetEntity();
    this.imageUrl = GLOBAL.IMAGE_DEFAULT;
  }

  // ==================================================

  accept(): void {
    if (this.setForm.valid) {
      this.loading = true;
      this.uploadImage();
      this.loading = false;
    } else {
      let html = '<h2>Existen campos incorrectos</h2><ul>';
      if (this.setForm.get('code').invalid) {
        html +=
          '<li>El código es incorrecto. Ejemplo: CJ000150. Código + 6 dígitos</li>';
      }
      if (this.setForm.get('name').invalid) {
        html += '<li>El nombre debe estar entre 3 y 45 caracteres</li>';
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

  private createOrUpdateSet(): void {
    const newSet: SetEntity = this._setFactory.createSet(this.setForm.value);
    if (this.create) {
      this.createSet(newSet);
    } else {
      this.updateSet(newSet);
    }
  }

  // ==================================================

  createSet(createSet: SetEntity): void {
    const setCreateDto: SetCreateDto = this._setFactory.getSetCreateDto(
      createSet
    );
    this._setService.create(setCreateDto).subscribe(
      (setRO) => {
        const newSet: SetEntity = this._setFactory.createSet(setRO.set);
        this._setService.getSets().value.push(newSet);
        this._setService.publishCreateOnMQTT(newSet);
        this._setService.refresh();
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

  private updateSet(newSet: SetEntity): void {
    const setUpdateDto: SetUpdateDto = this._setFactory.getSetUpdateDto(newSet);
    this._setService.update(setUpdateDto).subscribe(
      (setRO) => {
        this._setFactory.updateSet(this.set, setRO.set);
        this._setService.publishUpdateOnMQTT(this.set);
        this._setService.refresh();
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
            this.setForm.value.image = next.filename;
            this.createOrUpdateSet();
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
      this.createOrUpdateSet();
    }
  }

  // ==================================================

  compareUnitSet(d1: any, d2: any): boolean {
    return d1 && d2 && d1.id === d2.id;
  }

  // ==================================================

  compareUnitSetType(d1: any, d2: any): boolean {
    return d1 && d2 && d1.name === d2.name;
  }

  // ==================================================

  close(): void {
    this._dialogRef.close();
  }

  // ==================================================

  remove(removeUnit: UnitEntity): void {
    this.setForm
      .get('units')
      .setValue(
        this.setForm.value.units.filter((unit) => unit.id !== removeUnit.id)
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

  openDialogCreateSetType(): void {
    const dialogRef = this._matDialog.open(DialogSetTypeCreateComponent, {
      width: '300px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      const setType = new SetTypeEntity();
      setType.name = result;
      this._setService.createSetType(setType).subscribe((res) => {
        this.setTypes.push(res);
      });
    });
  }

  // ==================================================

  openDialogDeleteSetType(setTypeSelected: SetTypeEntity): void {
    const dialogRef = this._matDialog.open(DialogSetTypeDeleteComponent, {
      width: '300px',
      data: setTypeSelected,
    });
    dialogRef.afterClosed().subscribe((resultSetType) => {
      this._setService.removeSetType(resultSetType).subscribe((removed) => {
        if (removed) {
          this.setTypes = this.setTypes.filter(
            (setType) => setType.name !== resultSetType.name
          );
        }
      });
    });
  }

  // ==================================================

  ngOnDestroy(): void {
    this.set = null;
    if (this.subUnits) {
      this.subUnits.unsubscribe();
    }
  }
}

@Component({
  selector: 'app-dialog-set-type-create',
  templateUrl: 'dialog-set-type-create.component.html',
})
export class DialogSetTypeCreateComponent {
  nombre = '';
  constructor(public dialogRef: MatDialogRef<DialogSetTypeCreateComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-dialog-set-type-delete',
  templateUrl: 'dialog-set-type-delete.component.html',
})
export class DialogSetTypeDeleteComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: SetTypeEntity,
    public dialogRef: MatDialogRef<DialogSetTypeCreateComponent>
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
