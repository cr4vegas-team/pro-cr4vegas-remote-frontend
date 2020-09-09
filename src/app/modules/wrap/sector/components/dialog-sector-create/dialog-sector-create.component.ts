import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogInfoComponent } from 'src/app/shared/components/dialog-info/dialog-info.component';
import { GLOBAL } from 'src/app/shared/constants/global.constant';
import { SectorCreateDto } from '../../dto/sector-create.dto';
import { SectorUpdateDto } from '../../dto/sector-update.dto';
import { SectorEntity } from '../../sector.entity';
import { SectorFactory } from '../../sector.factory';
import { SectorService } from '../../sector.service';

@Component({
  selector: 'app-dialog-sector-create',
  templateUrl: './dialog-sector-create.component.html',
})
export class DialogSectorCreateComponent implements OnInit {

  consDialogInfo = GLOBAL.FUNCTION_NOT_ALLOWED;
  create: boolean = true;

  // Froms control
  sectorForm: FormGroup;

  constructor(
    private readonly _matDialog: MatDialog,
    private readonly _sectorService: SectorService,
    private readonly _sectorFactory: SectorFactory,
    private readonly _formBuilder: FormBuilder,
    private readonly _dialogRef: MatDialogRef<DialogSectorCreateComponent>,
    @Inject(MAT_DIALOG_DATA)
    public sector: SectorEntity
  ) {
    if (this.sector) {
      this.create = false;
    } else {
      this.create = true;
      this.sector = new SectorEntity();
    }
    this.sectorForm = this._formBuilder.group({
      id: [this.sector.id],
      code: [this.sector.code],
      name: [this.sector.name],
      description: [this.sector.description],
    });
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.sector = null;
  }

  openDialogInfo(data: string) {
    this._matDialog.open(DialogInfoComponent, { data });
  }

  accept() {
    try {
      if(!this.sectorForm.valid) {
        throw new Error(`
          <p>El código es incorrecto. Ejemplo: ST000150. Código + 6 dígitos. Código:</p>
          <ul>
              <li>ST = Sector</li>
          </ul>
        `);
      }
      const newSector: SectorEntity = this._sectorFactory.createSector(this.sectorForm.value);
      if (this.create) {
        this.createSector(newSector);
      } else {
        this.updateSector(newSector);
      }
    } catch (error) {
      this._matDialog.open(DialogInfoComponent, { data: { title: 'Error', html: error } });
    }
  }

  createSector(newSector: SectorEntity) {
    const sectorCreateDto: SectorCreateDto = this._sectorFactory.getSectorCreateDto(newSector);
    this._sectorService.create(sectorCreateDto).subscribe(
      sectorRO => {
        const newSector: SectorEntity = this._sectorFactory.createSector(sectorRO.sector);
        this._sectorService.sectors.value.push(newSector);
        this._sectorService.updateSectors();
        this.close();
      },
      error => {
        this._matDialog.open(DialogInfoComponent, { data: { title: 'Error', html: error.error.description } });
      }
    );
  }

  updateSector(newSector: SectorEntity) {
    const secctorUpdateDto: SectorUpdateDto = this._sectorFactory.getSectorUpdateDto(newSector);
    this._sectorService.update(secctorUpdateDto).subscribe(
      sectorRO => {
        this._sectorFactory.copy(this.sector, sectorRO.sector);
        this._sectorService.updateSectors();
      },
      error => {
        this._matDialog.open(DialogInfoComponent, { data: { title: 'Error', html: error.error.description } });
      }
    )
  }

  compareUnitHydrant(d1: any, d2: any) {
    return d1 && d2 && d1.id === d2.id;
  }

  close() {
    this._dialogRef.close();
  }

}
