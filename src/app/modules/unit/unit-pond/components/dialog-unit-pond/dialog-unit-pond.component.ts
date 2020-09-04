import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { DialogInfoComponent } from '../../../../../shared/components/dialog-info/dialog-info.component';
import { GLOBAL } from '../../../../../shared/constants/global.constant';
import { UnitPondEntity } from '../../../../../modules/unit/unit-pond/unit-pond.entity';
import { UnitPondService } from '../../../../../modules/unit/unit-pond/unit-pond.service';
import { DialogUnitPondCreateComponent } from '../dialog-unit-pond-create/dialog-unit-pond-create.component';

@Component({
  selector: 'app-dialog-unit-pond',
  templateUrl: './dialog-unit-pond.component.html',
  styleUrls: ['./dialog-unit-pond.component.css']
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
      }
    },
  };
  public barChartLabels: Label[] = ['Gador'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  private _level: Subscription;

  public barChartData: ChartDataSets[] = [
    {
      data: [this.unitPond.level],
      label: 'Nivel',
    }
  ];

  consDialogInfo = GLOBAL.FUNCTION_NOT_ALLOWED;

  constructor(
    private readonly _matDialog: MatDialog,
    private readonly _unitPondService: UnitPondService,
    @Inject(MAT_DIALOG_DATA)
    public unitPond: UnitPondEntity
  ) { }

  ngOnInit() {
    this.barChartOptions.scales.yAxes = [{ ticks: { min: 0, max: this.unitPond.height ? this.unitPond.height : 1000, autoSkipPadding: 2 } }];
    this._level = this.unitPond.level$.subscribe(
      level => {
        this.barChartData[0].data = [level, 0, 0];
      }
    );
  }

  ngOnDestroy() {
    this.unitPond = null;
    this._level.unsubscribe();
  }

  openDialogInfo(data: string) {
    this._matDialog.open(DialogInfoComponent, { data });
  }

  openDialogUnitPondCreate() {
    this._matDialog.open(DialogUnitPondCreateComponent, { data: this.unitPond });
  }

}
