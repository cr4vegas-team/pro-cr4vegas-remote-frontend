import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DialogImageComponent } from 'src/app/shared/components/dialog-image/dialog-image.component';
import { UnitGenericEntity } from '../../unit-generic.entity';
import { UnitGenericService } from '../../unit-generic.service';
import { DialogUnitGenericComponent } from '../dialog-unit-generic/dialog-unit-generic.component';

@Component({
  selector: 'app-page-unit-generic',
  templateUrl: './page-unit-generic.component.html',
})
export class PageUnitGenericComponent implements OnInit {
  unitsGenerics = [];
  searchText: string;
  checkedCommunication: boolean = false;
  checkedActive: boolean = true;
  showLoader = false;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private readonly _unitGenericService: UnitGenericService,
    private readonly _matDialog: MatDialog,
  ) {
    this._unitGenericService.getUnitsGeneric().subscribe((unitsgenerics) => {
      this.unitsGenerics = unitsgenerics;
    });
  }

  ngOnInit() {}

  openDialoggeneric(unitGeneric: UnitGenericEntity): void {
    this._matDialog.open(DialogUnitGenericComponent, { data: unitGeneric });
  }

  applyFilter(searchText: string): void {
    this.searchText = searchText;
  }

  openDialogImage(imageURL): void {
    this._matDialog.open(DialogImageComponent, { data: imageURL });
  }

  compare(a: UnitGenericEntity, b: UnitGenericEntity) {
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
