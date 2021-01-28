import { isNull } from '@angular/compiler/src/output/output_ast';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/auth/auth.service';
import { UserRole } from 'src/app/modules/auth/user/enum/user-role.enum';
import { DialogImageComponent } from 'src/app/shared/components/dialog-image/dialog-image.component';
import { GLOBAL } from 'src/app/shared/constants/global.constant';
import { UploadService } from 'src/app/shared/services/upload.service';
import { UnitStationPechinaFactoryService } from './../../../unit-station-pechina-factory.service';
import { UnitStationPechinaEntity } from './../../../unit-station-pechina.entity';
import { UnitStationPechinaService } from './../../../unit-station-pechina.service';
import { DialogUnitStationPechinaCreateComponent } from './../dialog-unit-station-pechina-create/dialog-unit-station-pechina-create.component';

@Component({
  selector: 'app-dialog-unit-station-pechina',
  templateUrl: './dialog-unit-station-pechina.component.html',
  styleUrls: ['./dialog-unit-station-pechina.component.css']
})
export class DialogUnitStationPechinaComponent implements OnInit, OnDestroy {

  consDialogInfo = GLOBAL.FUNCTION_NOT_ALLOWED;

  private _subReading$: Subscription;

  imageURL = GLOBAL.IMAGE_DEFAULT;
  subImage: Subscription;
  disabled = false;
  tanda = 0;

  constructor(
    private readonly _unitGenericService: UnitStationPechinaService,
    private readonly _unitGenericFactory: UnitStationPechinaFactoryService,
    private readonly _matDialog: MatDialog,
    private readonly _uploadService: UploadService,
    private readonly _sanitizer: DomSanitizer,
    private readonly _authService: AuthService,
    @Inject(MAT_DIALOG_DATA)
    public unitStationPechina: UnitStationPechinaEntity
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

  ngOnInit(): void {
    if (
      this.unitStationPechina.unit.image !== undefined &&
      this.unitStationPechina.unit.image !== null &&
      this.unitStationPechina.unit.image !== ''
    ) {
      this.subImage = this._uploadService
        .getImage(this.unitStationPechina.unit.image)
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

    this._subReading$ = this.unitStationPechina.reading$.subscribe((reading) => {
      this.calculateBatch(reading);
    });
  }

  calculateBatch(reading: number): void {
    const initBatch = this.unitStationPechina.readingBatch;
    if (!isNaN(reading) && reading !== null && !isNaN(initBatch) && initBatch !== null) {
      this.tanda = reading - initBatch;
    } else {
      this.tanda = 0;
    }
  }

  openDialogUnitGenericCreate(): void {
    this._matDialog.open(DialogUnitStationPechinaCreateComponent, {
      data: this.unitStationPechina,
    });
  }

  openDialogImage(): void {
    this._matDialog.open(DialogImageComponent, { data: this.imageURL });
  }

  ngOnDestroy(): void {
    this.unitStationPechina = null;
    if (this.subImage) {
      this.subImage.unsubscribe();
    }
    if (this._subReading$) {
      this._subReading$.unsubscribe();
    }
  }

  batchReset(): void {
    const unitStationPechinaUpdateDto = this._unitGenericFactory.getUnitStationUpdateDto(
      this.unitStationPechina
    );
    unitStationPechinaUpdateDto.readingBatch = this.unitStationPechina.reading$.value;
    this._unitGenericService
      .update(unitStationPechinaUpdateDto)
      .subscribe((unitStationPechina) => {
        this.unitStationPechina.readingBatch = unitStationPechina.readingBatch;
        this.calculateBatch(null);
      });
  }

}
