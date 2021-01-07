import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/auth/auth/auth.service';
import { UserRoleEnum } from 'src/app/shared/auth/user/enum/user-role.enum';
import { DialogImageComponent } from 'src/app/shared/components/dialog-image/dialog-image.component';
import { UploadService } from 'src/app/shared/services/upload.service';
import { UnitPondEntity } from '../../../../../modules/unit/unit-pond/unit-pond.entity';
import { DialogInfoComponent } from '../../../../../shared/components/dialog-info/dialog-info.component';
import { GLOBAL } from '../../../../../shared/constants/global.constant';
import { DialogUnitPondCreateComponent } from '../dialog-unit-pond-create/dialog-unit-pond-create.component';

@Component({
  selector: 'app-dialog-unit-pond',
  templateUrl: './dialog-unit-pond.component.html',
})
export class DialogUnitPondComponent implements OnInit, OnDestroy {
  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{ ticks: { min: 0, max: 1000 } }] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      },
    },
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  private _level: Subscription;

  public barChartData: ChartDataSets[] = [
    {
      data: [this.unitPond.level$.value / 1000],
      label: 'Nivel',
    },
  ];

  consDialogInfo = GLOBAL.FUNCTION_NOT_ALLOWED;

  imageURL = GLOBAL.IMAGE_DEFAULT;
  subImage: Subscription;
  disabled = false;

  // ==================================================

  constructor(
    private readonly _matDialog: MatDialog,
    private readonly _uploadService: UploadService,
    private readonly _sanitizer: DomSanitizer,
    private readonly _authService: AuthService,
    @Inject(MAT_DIALOG_DATA)
    public unitPond: UnitPondEntity
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
    this.barChartOptions.scales.yAxes = [
      {
        ticks: {
          min: 0,
          max: this.unitPond.height ? this.unitPond.height : 10,
          autoSkipPadding: 2,
        },
      },
    ];
    this._level = this.unitPond.level$.subscribe((level) => {
      this.barChartData[0].data = [level / 1000, 0, 0];
    });

    if (
      this.unitPond.unit.image !== undefined &&
      this.unitPond.unit.image !== null &&
      this.unitPond.unit.image !== ''
    ) {
      this.subImage = this._uploadService
        .getImage(this.unitPond.unit.image)
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

  ngOnDestroy(): void {
    this.unitPond = null;
    this._level.unsubscribe();
  }

  // ==================================================

  openDialogInfo(data: string): void {
    this._matDialog.open(DialogInfoComponent, { data });
  }

  // ==================================================

  openDialogImage(): void {
    this._matDialog.open(DialogImageComponent, { data: this.imageURL });
  }

  // ==================================================

  openDialogUnitPondCreate(): void {
    this._matDialog.open(DialogUnitPondCreateComponent, {
      data: this.unitPond,
    });
  }
}
