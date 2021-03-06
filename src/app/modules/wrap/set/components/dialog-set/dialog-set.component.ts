import { AuthService } from 'src/app/shared/services/auth.service';
import { SetEntity } from './../../set.entity';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { UnitGenericService } from 'src/app/modules/unit/unit-generic/unit-generic.service';
import { UnitHydrantService } from 'src/app/modules/unit/unit-hydrant/unit-hydrant.service';
import { UnitPondService } from 'src/app/modules/unit/unit-pond/unit-pond.service';
import { UnitEntity } from 'src/app/modules/unit/unit/unit.entity';
import { GLOBAL } from 'src/app/shared/constants/global.constant';
import { UploadService } from 'src/app/shared/services/upload.service';
import { DialogInfoComponent } from 'src/app/shared/components/dialog-info/dialog-info.component';
import { DialogInfoTitleEnum } from 'src/app/shared/components/dialog-info/dialog-info-title.enum';
import { ErrorTypeEnum } from 'src/app/shared/constants/error-type.enum';
import { DialogSetCreateComponent } from '../dialog-set-create/dialog-set-create.component';
import { DialogUnitGenericComponent } from 'src/app/modules/unit/unit-generic/components/dialog-unit-generic/dialog-unit-generic.component';
import { DialogUnitHydrantComponent } from 'src/app/modules/unit/unit-hydrant/components/dialog-unit-hydrant/dialog-unit-hydrant.component';
import { DialogUnitPondComponent } from 'src/app/modules/unit/unit-pond/components/dialog-unit-pond/dialog-unit-pond.component';
import { DialogImageComponent } from 'src/app/shared/components/dialog-image/dialog-image.component';
import { UnitTypeTableEnum } from 'src/app/shared/constants/unit-type-table.enum';

@Component({
  selector: 'app-dialog-set',
  templateUrl: './dialog-set.component.html',
})
export class DialogSetComponent implements OnInit, OnDestroy {
  consDialogInfo = GLOBAL.FUNCTION_NOT_ALLOWED;

  units: UnitEntity[] = [];
  subUnits: Subscription;
  imageURL = GLOBAL.IMAGE_DEFAULT;
  subImage: Subscription;
  disabled = false;

  // ==================================================

  constructor(
    private readonly _matDialog: MatDialog,
    private readonly _unitGenericService: UnitGenericService,
    private readonly _unitHydrantService: UnitHydrantService,
    private readonly _unitPondService: UnitPondService,
    private readonly _uploadService: UploadService,
    private readonly _sanitizer: DomSanitizer,
    private readonly _authService: AuthService,
    @Inject(MAT_DIALOG_DATA)
    public set: SetEntity
  ) {
    this._authService.getSubjectAdminOrModerator().subscribe((res) => {
      if (res) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    });
  }

  // ==================================================

  ngOnInit(): void {
    this.units = this.set.units;
    if (
      this.set.image !== undefined &&
      this.set.image !== null &&
      this.set.image !== ''
    ) {
      this.subImage = this._uploadService.getImage(this.set.image).subscribe(
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

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.units = this.set.units.filter(
      (unit) => String(unit.code) === filterValue
    );
  }

  // ==================================================

  openDialogInfo(data: string): void {
    this._matDialog.open(DialogInfoComponent, { data });
  }

  // ==================================================

  openDialogSetCreate(): void {
    this._matDialog.open(DialogSetCreateComponent, { data: this.set });
  }

  // ==================================================

  openDialogUnit(unit: UnitEntity): void {
    if (unit.unitTypeTable === UnitTypeTableEnum.UNIT_GENERIC) {
      this._matDialog.open(DialogUnitGenericComponent, {
        data: this._unitGenericService.getOneByUnitId(unit.id),
      });
    }
    if (unit.unitTypeTable === UnitTypeTableEnum.UNIT_HYDRANT) {
      this._matDialog.open(DialogUnitHydrantComponent, {
        data: this._unitHydrantService.getOneByUnitId(unit.id),
      });
    }
    if (unit.unitTypeTable === UnitTypeTableEnum.UNIT_POND) {
      this._matDialog.open(DialogUnitPondComponent, {
        data: this._unitPondService.getOneByUnitId(unit.id),
      });
    }
  }

  // ==================================================

  openDialogImage(): void {
    this._matDialog.open(DialogImageComponent, { data: this.imageURL });
  }

  // ==================================================

  ngOnDestroy(): void {
    this.set = null;
    this.imageURL = null;
    this.units = null;
    if (this.subImage) {
      this.subImage.unsubscribe();
    }
    if (this.subUnits) {
      this.subUnits.unsubscribe();
    }
  }
}
