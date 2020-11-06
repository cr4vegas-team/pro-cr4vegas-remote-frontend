import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { DialogImageComponent } from 'src/app/shared/components/dialog-image/dialog-image.component';
import { DialogInfoTitleEnum } from 'src/app/shared/components/dialog-info/dialog-info-title.enum';
import { DialogInfoComponent } from 'src/app/shared/components/dialog-info/dialog-info.component';
import { ErrorTypeEnum } from 'src/app/shared/constants/error-type.enum';
import { GLOBAL } from 'src/app/shared/constants/global.constant';
import { UploadService } from 'src/app/shared/services/upload.service';
import { UnitGenericEntity } from '../../unit-generic.entity';
import { UnitGenericService } from '../../unit-generic.service';
import { DialogUnitGenericCreateComponent } from '../dialog-unit-generic-create/dialog-unit-generic-create.component';

@Component({
  selector: 'app-dialog-unit-generic',
  templateUrl: './dialog-unit-generic.component.html',
})
export class DialogUnitGenericComponent implements OnInit, OnDestroy {

  consDialogInfo = GLOBAL.FUNCTION_NOT_ALLOWED;

  imageURL = GLOBAL.IMAGE_DEFAULT;
  subImage: Subscription;

  // ==================================================

  constructor(
    private readonly _matDialog: MatDialog,
    private readonly _uploadService: UploadService,
    private readonly _sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA)
    public unitGeneric: UnitGenericEntity
  ) {}

  // ==================================================

  ngOnInit(): void {
    if (
      this.unitGeneric.unit.image !== undefined &&
      this.unitGeneric.unit.image !== null &&
      this.unitGeneric.unit.image !== ''
    ) {
      this.subImage = this._uploadService.getImage(this.unitGeneric.unit.image).subscribe(
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
  }

  // ==================================================

  openDialogUnitGenericCreate(): void {
    this._matDialog.open(DialogUnitGenericCreateComponent, { data: this.unitGeneric });
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
  }

}
