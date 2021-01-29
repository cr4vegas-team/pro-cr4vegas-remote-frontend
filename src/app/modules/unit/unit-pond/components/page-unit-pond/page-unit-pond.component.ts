import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DialogImageComponent } from 'src/app/shared/components/dialog-image/dialog-image.component';
import { UnitPondEntity } from '../../../../../modules/unit/unit-pond/unit-pond.entity';
import { UnitPondService } from '../../../../../modules/unit/unit-pond/unit-pond.service';
import { DialogUnitPondComponent } from '../dialog-unit-pond/dialog-unit-pond.component';

@Component({
  selector: 'app-unit-pond',
  templateUrl: './page-unit-pond.component.html',
})
export class PageUnitPondComponent implements OnInit {
  unitsPonds = [];
  searchText: string;
  checkedCommunication: boolean = false;
  checkedActive: boolean = true;
  showLoader = false;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private readonly _unitPondService: UnitPondService,
    private readonly _matDialog: MatDialog,
  ) {
    this._unitPondService.getUnitsPonds().subscribe((unitsPonds) => {
      this.unitsPonds = unitsPonds;
    });
  }

  ngOnInit() {}

  openDialogPond(unitPond: UnitPondEntity): void {
    this._matDialog.open(DialogUnitPondComponent, { data: unitPond });
  }

  applyFilter(searchText: string): void {
    this.searchText = searchText;
  }

  openDialogImage(imageURL): void {
    this._matDialog.open(DialogImageComponent, { data: imageURL });
  }

  compare(a: UnitPondEntity, b: UnitPondEntity) {
    // Comparamos la propiedad bot de user.

    if (a.unit.code < b.unit.code) return 1;
    if (a.unit.code > b.unit.code) return -1;
    else {
      // Si la propiedad bot de user es igual, ordenar alfabéticamente.

      if (a.unit.communication > b.unit.communication) return 1;
      if (a.unit.communication < b.unit.communication) return -1;
      else {
        if (a.unit.sector > b.unit.sector) return 1;
        else if (a.unit.sector < b.unit.sector) return -1;
        return 0;
      }
    }
  }
}
