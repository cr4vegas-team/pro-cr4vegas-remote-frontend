import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogInfoComponent } from '../../../../../shared/components/dialog-info/dialog-info.component';
import { DialogResultData } from '../../../../../shared/components/dialog-result/dialog-result-data.class';
import { DialogResultComponent } from '../../../../../shared/components/dialog-result/dialog-result.component';
import { GLOBAL } from '../../../../../shared/constants/global.constant';
import { DialogSectorCreateComponent } from '../../../sector/components/dialog-sector-create/dialog-sector-create.component';
import { SetCreateDto } from '../../dto/set-create.dto';
import { SetUpdateDto } from '../../dto/set-update.dto';
import { SetTypeEntity } from '../../set-type.entity';
import { SetEntity } from '../../set.entity';
import { SetFactory } from '../../set.factory';
import { SetService } from '../../set.service';

@Component({
  selector: 'app-dialog-set-create',
  templateUrl: './dialog-set-create.component.html',
})
export class DialogSetCreateComponent implements OnInit {


  consDialogInfo = GLOBAL.FUNCTION_NOT_ALLOWED;
  create: boolean = true;
  setsTypes: SetTypeEntity[];

  // Froms control
  setForm: FormGroup;

  constructor(
    private readonly _matDialog: MatDialog,
    private readonly _dialogResultData: DialogResultData,
    private readonly _setService: SetService,
    private readonly _setFactory: SetFactory,
    private readonly _formBuilder: FormBuilder,
    private readonly _dialogRef: MatDialogRef<DialogSectorCreateComponent>,
    @Inject(MAT_DIALOG_DATA)
    public set: SetEntity
  ) {
    if (this.set) {
      this.create = false;
    } else {
      this.create = true;
      this.set = new SetEntity();
    }
    this.setForm = this._formBuilder.group({
      id: [this.set.id],
      code: [this.set.code],
      name: [this.set.name],
      description: [this.set.description],
      setType: [this.set.setType],
    });
    this._setService.findAllTypes().subscribe(
      setsTypes => {
        if (setsTypes) {
          this.setsTypes = setsTypes;
        } else {
          this.setsTypes = [];
        }
      }
    )
  }

  ngOnInit(): void { }

  ngOnDestroy() {
    this.set = null;
  }

  openDialogInfo(data: string) {
    this._matDialog.open(DialogInfoComponent, { data });
  }

  openDialogSetTypeCreate() {
    const data: DialogResultData = {
      title: 'Crear tipo de conjunto',
      message: 'Escriba el nombre para el nuevo tipo de conjunto',
      label: 'Tipo',
      name: '',
    }
    const dialogRef = this._matDialog.open(DialogResultComponent, { data });
    
    dialogRef.afterClosed().subscribe(result => {
      const setType: SetTypeEntity = new SetTypeEntity();
      setType.name = result;
      this._setService.createSetType(setType).subscribe(
        savedSetType => {
          if (savedSetType) {
            this.setsTypes.push(savedSetType);
          }
        },
        error => {
          this._matDialog.open(DialogInfoComponent, { data: { title: 'Error', html: error.error.message } });
        }
      )
    });
  }

  accept() {
    try {
      if (!this.setForm.valid) {
        throw new Error(`
          <p>El código es incorrecto. Ejemplo: CJ000150. Código + 6 dígitos. Código:</p>
          <ul>
              <li>CJ = Conjunto</li>
          </ul>
        `);
      }
      const newSet: SetEntity = this._setFactory.createSet(this.setForm.value);
      if (this.create) {
        this.createSet(newSet);
      } else {
        this.updateSet(newSet);
      }
    } catch (error) {
      this._matDialog.open(DialogInfoComponent, { data: { title: 'Error', html: error } });
    }
  }

  createSet(newSet: SetEntity) {
    const setCreateDto: SetCreateDto = this._setFactory.getSetCreateDto(newSet);
    this._setService.create(setCreateDto).subscribe(
      setRO => {
        const newSet: SetEntity = this._setFactory.createSet(setRO.set);
        this._setService.sets.value.push(newSet);
        this._setService.updateSets();
        this.close();
      },
      error => {
        this._matDialog.open(DialogInfoComponent, { data: { title: 'Error', html: error.error.description } });
      }
    );
  }

  updateSet(newSet: SetEntity) {
    const setUpdateDto: SetUpdateDto = this._setFactory.getSetUpdateDto(newSet);
    this._setService.update(setUpdateDto).subscribe(
      setRO => {
        this._setFactory.copy(this.set, setRO.set);
        this._setService.updateSets();
      },
      error => {
        this._matDialog.open(DialogInfoComponent, { data: { title: 'Error', html: error.error.description } });
      }
    )
  }

  compareSet(d1: any, d2: any) {
    return d1 && d2 && d1.id === d2.id;
  }

  close() {
    this._dialogRef.close();
  }


}
