import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/auth/auth.service';
import { UserRole } from 'src/app/modules/auth/user/enum/user-role.enum';
import { UnitHydrantFactory } from 'src/app/modules/unit/unit-hydrant/unit-hydrant.factory';
import { UnitHydrantService } from 'src/app/modules/unit/unit-hydrant/unit-hydrant.service';
import { DialogImageComponent } from 'src/app/shared/components/dialog-image/dialog-image.component';
import { UploadService } from 'src/app/shared/services/upload.service';
import { GLOBAL } from '../../../../../shared/constants/global.constant';
import { UnitHydrantEntity } from '../../unit-hydrant.entity';
import { DialogUnitHydrantCreateComponent } from '../dialog-unit-hydrant-create/dialog-unit-hydrant-create.component';
import { DialogConfirmComponent } from './../../../../../shared/components/dialog-confirm/dialog-confirm.component';
import { UnitHydrantUpdateInitBatchDto } from './../../dto/unit-hydrant-update-initbatch.dto';
import { UnitHydrantMqttService } from './../../unit-hydrant-mqtt.service';
@Component({
  selector: 'app-dialog-unit-hydrant',
  templateUrl: './dialog-unit-hydrant.component.html',
})
export class DialogUnitHydrantComponent implements OnInit, OnDestroy {
  consDialogInfo = GLOBAL.FUNCTION_NOT_ALLOWED;

  imageURL = GLOBAL.IMAGE_DEFAULT;
  subImage: Subscription;
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
    private readonly _unitHydrantMQTTService: UnitHydrantMqttService,
    @Inject(MAT_DIALOG_DATA)
    public unitHydrant: UnitHydrantEntity
  ) {}

  // ==================================================

  async ngOnInit(): Promise<void> {
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
          }
        );
    }
  }

  // ==================================================

  openDialogHydrantCreate(): void {
    this._matDialog.open(DialogUnitHydrantCreateComponent, {
      data: this.unitHydrant,
      maxWidth: '1000px',
    });
  }

  // ==================================================

  openDialogImage(): void {
    this._matDialog.open(DialogImageComponent, { data: this.imageURL });
  }

  // ==================================================

  resetBatch(): void {
    const unitHydrantUpdateInitBatchDto = new UnitHydrantUpdateInitBatchDto();
    unitHydrantUpdateInitBatchDto.id = this.unitHydrant.id;
    unitHydrantUpdateInitBatchDto.initBatch = this.unitHydrant.reading$.value;
    this._unitHydrantService
      .updateInitBatch(unitHydrantUpdateInitBatchDto)
      .subscribe((initBatch) => {
        this.unitHydrant.initBatch = initBatch;
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

  public openValve(): void {
    if (
      this.unitHydrant.bouyMedium$.value === 1 &&
      this.unitHydrant.bouyHight$.value !== 1
    ) {
      const dialogRef = this._matDialog.open(DialogConfirmComponent, {
        width: '300px',
        data:
          'La balsa esta llena. Teniendo en cuenta que si abre manualmente solo dispone de la boya de alarma de nivel para un cierre automático, ¿Desea abrir la balsa?',
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this._unitHydrantMQTTService.publishOrders(this.unitHydrant, 1, 1);
        }
      });
    }
    if (this.unitHydrant.bouyHight$.value !== 1) {
      this._unitHydrantMQTTService.publishOrders(this.unitHydrant, 1, 0);
    }
  }

  public closeValve(): void {
    this._unitHydrantMQTTService.publishOrders(this.unitHydrant, 0, 0);
  }
}
