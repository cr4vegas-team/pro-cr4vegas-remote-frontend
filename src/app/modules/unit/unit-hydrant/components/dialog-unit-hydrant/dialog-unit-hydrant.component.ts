import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { UnitHydrantFactory } from 'src/app/modules/unit/unit-hydrant/unit-hydrant.factory';
import { UnitHydrantService } from 'src/app/modules/unit/unit-hydrant/unit-hydrant.service';
import { AuthService } from 'src/app/modules/auth/auth/auth.service';
import { UserRoleEnum } from 'src/app/modules/auth/user/enum/user-role.enum';
import { DialogImageComponent } from 'src/app/shared/components/dialog-image/dialog-image.component';
import { DialogInfoTitleEnum } from 'src/app/shared/components/dialog-info/dialog-info-title.enum';
import { ErrorTypeEnum } from 'src/app/shared/constants/error-type.enum';
import { UploadService } from 'src/app/shared/services/upload.service';
import { DialogInfoComponent } from '../../../../../shared/components/dialog-info/dialog-info.component';
import { GLOBAL } from '../../../../../shared/constants/global.constant';
import { UnitHydrantEntity } from '../../unit-hydrant.entity';
import { DialogUnitHydrantCreateComponent } from '../dialog-unit-hydrant-create/dialog-unit-hydrant-create.component';
@Component({
  selector: 'app-dialog-unit-hydrant',
  templateUrl: './dialog-unit-hydrant.component.html',
})
export class DialogUnitHydrantComponent implements OnInit, OnDestroy {
  consDialogInfo = GLOBAL.FUNCTION_NOT_ALLOWED;

  imageURL = GLOBAL.IMAGE_DEFAULT;
  subImage: Subscription;
  disabled = false;
  batch = 0;
  valve = 0;

  // ==================================================
  //  SUBSCRIPTIONS
  // ==================================================
  private _subReading: Subscription;

  constructor(
    private readonly _matDialog: MatDialog,
    private readonly _uploadService: UploadService,
    private readonly _sanitizer: DomSanitizer,
    private readonly _authService: AuthService,
    private readonly _unitHydrantFactory: UnitHydrantFactory,
    private readonly _unitHydrantService: UnitHydrantService,
    @Inject(MAT_DIALOG_DATA)
    public unitHydrant: UnitHydrantEntity
  ) {
    this._authService.getUser$().subscribe((user) => {
      if (
        user.role == UserRoleEnum.ADMIN ||
        user.role == UserRoleEnum.MODERATOR
      ) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    });
  }

  // ==================================================

  ngOnInit(): void {
    if (
      this.unitHydrant.unit.image !== undefined &&
      this.unitHydrant.unit.image !== null &&
      this.unitHydrant.unit.image !== ''
    ) {
      this.subImage = this._uploadService
        .getImage(this.unitHydrant.unit.image)
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
          (error: any) => {
            this._matDialog.open(DialogInfoComponent, {
              data: {
                errorType: ErrorTypeEnum.API_ERROR,
                title: DialogInfoTitleEnum.WARNING,
                error,
              },
            });
          }
        );
    }

    this._subReading = this.unitHydrant.reading$.subscribe((reading) => {
      if (!isNaN(reading)) {
        this.batch = reading - this.unitHydrant.initBatch;
      }
    });
  }

  // ==================================================

  openDialogHydrantCreate(): void {
    this._matDialog.open(DialogUnitHydrantCreateComponent, {
      data: this.unitHydrant,
    });
  }

  // ==================================================

  openDialogImage(): void {
    this._matDialog.open(DialogImageComponent, { data: this.imageURL });
  }

  // ==================================================

  resetBatch(): void {
    const unitHydrantUpdateDto = this._unitHydrantFactory.getUnitHydrantUpdateDto(
      this.unitHydrant
    );
    unitHydrantUpdateDto.initBatch = this.unitHydrant.reading$.value;
    this._unitHydrantService
      .update(unitHydrantUpdateDto)
      .subscribe((unitHydrantRO) => {
        this.unitHydrant.initBatch = unitHydrantRO.unitHydrant.initBatch;
        this.batch =
          this.unitHydrant.reading$.value - this.unitHydrant.initBatch;
      });
  }

  // ==================================================

  ngOnDestroy(): void {
    this.unitHydrant = null;
    if (this.subImage) {
      this.subImage.unsubscribe();
    }
    if (this._subReading) {
      this._subReading.unsubscribe();
    }
  }

  public openValve(): void {}

  public closeValve(): void {}
}
