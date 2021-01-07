import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { DialogUnitGenericComponent } from 'src/app/modules/unit/unit-generic/components/dialog-unit-generic/dialog-unit-generic.component';
import { UnitGenericService } from 'src/app/modules/unit/unit-generic/unit-generic.service';
import { DialogUnitHydrantComponent } from 'src/app/modules/unit/unit-hydrant/components/dialog-unit-hydrant/dialog-unit-hydrant.component';
import { UnitHydrantService } from 'src/app/modules/unit/unit-hydrant/unit-hydrant.service';
import { DialogUnitPondComponent } from 'src/app/modules/unit/unit-pond/components/dialog-unit-pond/dialog-unit-pond.component';
import { UnitPondService } from 'src/app/modules/unit/unit-pond/unit-pond.service';
import { UnitEntity } from 'src/app/modules/unit/unit/unit.entity';
import { AuthService } from 'src/app/shared/auth/auth/auth.service';
import { DialogImageComponent } from 'src/app/shared/components/dialog-image/dialog-image.component';
import { GLOBAL } from 'src/app/shared/constants/global.constant';
import { UnitTypeTableEnum } from 'src/app/shared/constants/unit-type-table.enum';
import { UploadService } from 'src/app/shared/services/upload.service';
import { SectorEntity } from './../../sector.entity';
import { DialogSectorCreateComponent } from './../dialog-sector-create/dialog-sector-create.component';

@Component({
  selector: 'app-dialog-sector',
  templateUrl: './dialog-sector.component.html',
})
export class DialogSectorComponent implements OnInit, OnDestroy {
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
    public sector: SectorEntity
  ) {
    this._authService.getUser$().subscribe((res) => {
      if (res) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    });
  }

  // ==================================================

  ngOnInit(): void {
    this.units = this.sector.units;
    if (
      this.sector.image !== undefined &&
      this.sector.image !== null &&
      this.sector.image !== ''
    ) {
      this.subImage = this._uploadService.getImage(this.sector.image).subscribe(
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
    if (
      filterValue !== undefined &&
      filterValue !== null &&
      filterValue !== ''
    ) {
      this.units = this.sector.units.filter(
        (unit) => String(unit.code) === filterValue
      );
    } else {
      this.units = this.sector.units;
    }
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

  openDialogSectorCreate(): void {
    const refDialogSectorCreate = this._matDialog.open(
      DialogSectorCreateComponent,
      { data: this.sector }
    );
    refDialogSectorCreate.afterClosed().subscribe(() => {
      this.units = this.sector.units;
    });
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
    this.sector = null;
    if (this.subImage) {
      this.subImage.unsubscribe();
    }
  }
}
