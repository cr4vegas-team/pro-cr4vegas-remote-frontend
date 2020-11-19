import { AuthService } from 'src/app/shared/services/auth.service';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { DialogImageComponent } from 'src/app/shared/components/dialog-image/dialog-image.component';
import { DialogInfoTitleEnum } from 'src/app/shared/components/dialog-info/dialog-info-title.enum';
import { ErrorTypeEnum } from 'src/app/shared/constants/error-type.enum';
import { TopicDestinationEnum } from 'src/app/shared/constants/topic-destination.enum';
import { UploadService } from 'src/app/shared/services/upload.service';
import { DialogInfoComponent } from '../../../../../shared/components/dialog-info/dialog-info.component';
import { GLOBAL } from '../../../../../shared/constants/global.constant';
import { TopicTypeEnum } from '../../../../../shared/constants/topic-type.enum';
import { MqttEventsService } from '../../../../../shared/services/mqtt-events.service';
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

  // ==================================================

  constructor(
    private readonly _mqttEventService: MqttEventsService,
    private readonly _matDialog: MatDialog,
    private readonly _uploadService: UploadService,
    private readonly _sanitizer: DomSanitizer,
    private readonly _authService: AuthService,
    @Inject(MAT_DIALOG_DATA)
    public unitHydrant: UnitHydrantEntity
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

  openValve(): void {
    this._mqttEventService.publishWithID(
      TopicDestinationEnum.NODE_SERVER,
      TopicTypeEnum.UNIT_HYDRANT,
      this.unitHydrant.id,
      '1'
    );
  }

  // ==================================================

  closeValve(): void {
    this._mqttEventService.publishWithID(
      TopicDestinationEnum.NODE_SERVER,
      TopicTypeEnum.UNIT_HYDRANT,
      this.unitHydrant.id,
      '0'
    );
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
    this.unitHydrant.batch = this.unitHydrant.reading;
  }

  // ==================================================

  ngOnDestroy(): void {
    this.unitHydrant = null;
    if (this.subImage) {
      this.subImage.unsubscribe();
    }
  }
}
