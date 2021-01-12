import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/auth/auth.service';
import { UserRoleEnum } from 'src/app/modules/auth/user/enum/user-role.enum';
import { DialogUnitGenericComponent } from 'src/app/modules/unit/unit-generic/components/dialog-unit-generic/dialog-unit-generic.component';
import { UnitGenericService } from 'src/app/modules/unit/unit-generic/unit-generic.service';
import { DialogUnitHydrantComponent } from 'src/app/modules/unit/unit-hydrant/components/dialog-unit-hydrant/dialog-unit-hydrant.component';
import { UnitHydrantService } from 'src/app/modules/unit/unit-hydrant/unit-hydrant.service';
import { DialogUnitPondComponent } from 'src/app/modules/unit/unit-pond/components/dialog-unit-pond/dialog-unit-pond.component';
import { UnitPondService } from 'src/app/modules/unit/unit-pond/unit-pond.service';
import { UnitEntity } from '../../../../../modules/unit/unit/unit.entity';
import { StationEntity } from '../../../../../modules/wrap/station/station.entity';
import { DialogInfoComponent } from '../../../../../shared/components/dialog-info/dialog-info.component';
import { GLOBAL } from '../../../../../shared/constants/global.constant';
import { DialogStationCreateComponent } from '../dialog-station-create/dialog-station-create.component';
import { DialogImageComponent } from './../../../../../shared/components/dialog-image/dialog-image.component';
import { UnitTypeTableEnum } from './../../../../../shared/constants/unit-type-table.enum';
import { UploadService } from './../../../../../shared/services/upload.service';

@Component({
  selector: 'app-dialog-station',
  templateUrl: './dialog-station.component.html',
})
export class DialogStationComponent implements OnInit, OnDestroy {
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
    public station: StationEntity
  ) {
    this._authService.getUser$().subscribe((user) => {
      if (
        user && user.role === UserRoleEnum.ADMIN ||
        user && user.role === UserRoleEnum.MODERATOR
      ) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    });
  }

  // ==================================================

  ngOnInit(): void {
    this.units = this.station.units;
    if (
      this.station.image !== undefined &&
      this.station.image !== null &&
      this.station.image !== ''
    ) {
      this.subImage = this._uploadService
        .getImage(this.station.image)
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

  // ==================================================

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.units = this.station.units.filter(
      (unit) => String(unit.code) === filterValue
    );
  }

  // ==================================================

  getType(unitType: UnitTypeTableEnum): string {
    switch (unitType) {
      case UnitTypeTableEnum.UNIT_GENERIC:
        return 'Genérico';
      case UnitTypeTableEnum.UNIT_HYDRANT:
        return 'Hidrante';
      case UnitTypeTableEnum.UNIT_POND:
        return 'Balsa';
      default:
        return 'Indefinido';
    }
  }

  // ==================================================

  openDialogInfo(data: string): void {
    this._matDialog.open(DialogInfoComponent, { data });
  }

  // ==================================================

  openDialogStationCreate(): void {
    this._matDialog.open(DialogStationCreateComponent, { data: this.station });
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
    this.station = null;
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
