import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/auth/auth.service';
import { UserRole } from 'src/app/modules/auth/user/enum/user-role.enum';
import { DialogUnitGenericComponent } from 'src/app/modules/unit/unit-generic/components/dialog-unit-generic/dialog-unit-generic.component';
import { UnitGenericService } from 'src/app/modules/unit/unit-generic/unit-generic.service';
import { DialogUnitHydrantComponent } from 'src/app/modules/unit/unit-hydrant/components/dialog-unit-hydrant/dialog-unit-hydrant.component';
import { UnitHydrantService } from 'src/app/modules/unit/unit-hydrant/unit-hydrant.service';
import { DialogUnitPondComponent } from 'src/app/modules/unit/unit-pond/components/dialog-unit-pond/dialog-unit-pond.component';
import { UnitPondService } from 'src/app/modules/unit/unit-pond/unit-pond.service';
import { UnitEntity } from 'src/app/modules/unit/unit/unit.entity';
import { DialogImageComponent } from 'src/app/shared/components/dialog-image/dialog-image.component';
import { DialogInfoComponent } from 'src/app/shared/components/dialog-info/dialog-info.component';
import { GLOBAL } from 'src/app/shared/constants/global.constant';
import { UnitTypeTableEnum } from 'src/app/shared/constants/unit-type-table.enum';
import { UploadService } from 'src/app/shared/services/upload.service';
import { DialogSetCreateComponent } from '../dialog-set-create/dialog-set-create.component';
import { SetEntity } from './../../set.entity';

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
    this._authService.getUser$().subscribe((user) => {
      if (
        user && user.role === UserRole.ADMIN ||
        user && user.role === UserRole.MODERATOR
      ) {
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

  getType(unit: UnitEntity): string {
    switch (unit.unitTypeTable) {
      case UnitTypeTableEnum.UNIT_GENERIC:
        return 'Genérico';
      case UnitTypeTableEnum.UNIT_HYDRANT:
        return 'Hidrante';
      case UnitTypeTableEnum.UNIT_POND:
        return 'Balsa';
      case UnitTypeTableEnum.UNIT_STATION_PECHINA:
        return 'Estación Pechina';
      default:
        return 'Indefinido';
    }
  }
}
