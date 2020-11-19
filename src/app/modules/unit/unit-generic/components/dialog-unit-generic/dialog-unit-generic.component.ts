import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { UnitGenericFactory } from 'src/app/modules/unit/unit-generic/unit-generic.factory';
import { UnitGenericService } from 'src/app/modules/unit/unit-generic/unit-generic.service';
import { DialogImageComponent } from 'src/app/shared/components/dialog-image/dialog-image.component';
import { DialogInfoTitleEnum } from 'src/app/shared/components/dialog-info/dialog-info-title.enum';
import { DialogInfoComponent } from 'src/app/shared/components/dialog-info/dialog-info.component';
import { ErrorTypeEnum } from 'src/app/shared/constants/error-type.enum';
import { GLOBAL } from 'src/app/shared/constants/global.constant';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UploadService } from 'src/app/shared/services/upload.service';
import { UnitGenericEntity } from '../../unit-generic.entity';
import { DialogUnitGenericCreateComponent } from '../dialog-unit-generic-create/dialog-unit-generic-create.component';

@Component({
  selector: 'app-dialog-unit-generic',
  templateUrl: './dialog-unit-generic.component.html',
  styleUrls: ['dialog-unit-generic.component.css'],
})
export class DialogUnitGenericComponent implements OnInit, OnDestroy {
  consDialogInfo = GLOBAL.FUNCTION_NOT_ALLOWED;

  imageURL = GLOBAL.IMAGE_DEFAULT;
  subImage: Subscription;
  counterInterval: NodeJS.Timeout;
  disabled = false;

  tanda = 0;

  // ==================================================

  constructor(
    private readonly _matDialog: MatDialog,
    private readonly _uploadService: UploadService,
    private readonly _sanitizer: DomSanitizer,
    private readonly _authService: AuthService,
    private readonly _unitGenericService: UnitGenericService,
    private readonly _unitGenericFactory: UnitGenericFactory,
    @Inject(MAT_DIALOG_DATA)
    public unitGeneric: UnitGenericEntity
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
    if (
      this.unitGeneric.unit.image !== undefined &&
      this.unitGeneric.unit.image !== null &&
      this.unitGeneric.unit.image !== ''
    ) {
      this.subImage = this._uploadService
        .getImage(this.unitGeneric.unit.image)
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
                errorType: ErrorTypeEnum.FRONT_ERROR,
                title: DialogInfoTitleEnum.WARNING,
                error,
              },
            });
          }
        );
    }

    this.unitGeneric.property1$.subscribe((p1) => {
      this.calculateBatch();
    });
  }

  calculateBatch(): void {
    const reading = parseInt(this.unitGeneric.property1$.value, 10);
    const initBatch = parseInt(this.unitGeneric.data1, 10);
    if (!isNaN(reading) && !isNaN(initBatch)) {
      this.tanda = reading - initBatch;
    } else {
      this.tanda = 0;
    }
  }

  // ==================================================

  openDialogUnitGenericCreate(): void {
    this._matDialog.open(DialogUnitGenericCreateComponent, {
      data: this.unitGeneric,
    });
  }

  // ==================================================

  openDialogImage(): void {
    this._matDialog.open(DialogImageComponent, { data: this.imageURL });
  }

  // ==================================================

  ngOnDestroy(): void {
    this.unitGeneric = null;
    if (this.subImage) {
      this.subImage.unsubscribe();
    }
    if (this.counterInterval) {
      clearInterval(this.counterInterval);
    }
  }

  // ==================================================

  batchReset(): void {
    const unitGenericUpdateDto = this._unitGenericFactory.getUnitGenericUpdateDto(
      this.unitGeneric
    );
    unitGenericUpdateDto.data1 = this.unitGeneric.property1$.value;
    this._unitGenericService
      .update(unitGenericUpdateDto)
      .subscribe((unitGenericRO) => {
        this.unitGeneric.data1 = unitGenericRO.unitGeneric.data1;
        this.calculateBatch();
      });
  }
}
