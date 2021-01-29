import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { UnitGenericService } from 'src/app/modules/unit/unit-generic/unit-generic.service';
import { UnitHydrantService } from 'src/app/modules/unit/unit-hydrant/unit-hydrant.service';
import { UnitPondService } from 'src/app/modules/unit/unit-pond/unit-pond.service';
import { UnitStationPechinaService } from 'src/app/modules/unit/unit-station-pechina/unit-station-pechina.service';
import { UnitEntity } from 'src/app/modules/unit/unit/unit.entity';
import { UnitService } from 'src/app/modules/unit/unit/unit.service';
import { GLOBAL } from 'src/app/shared/constants/global.constant';
import { UnitTypeTableEnum } from 'src/app/shared/constants/unit-type-table.enum';
import { UploadService } from 'src/app/shared/services/upload.service';
import { SectorCreateDto } from '../../dto/sector-create.dto';
import { SectorUpdateDto } from '../../dto/sector-update.dto';
import { SectorEntity } from '../../sector.entity';
import { SectorFactory } from '../../sector.factory';
import { SectorService } from '../../sector.service';

@Component({
  selector: 'app-dialog-sector-create',
  templateUrl: './dialog-sector-create.component.html',
})
export class DialogSectorCreateComponent implements OnInit, OnDestroy {
  consDialogInfo = GLOBAL.FUNCTION_NOT_ALLOWED;
  create = true;
  loading = false;

  sectorForm: FormGroup;
  units: UnitEntity[];
  subUnits: Subscription;

  selectable = false;
  removable = true;

  imageURL = GLOBAL.IMAGE_DEFAULT;
  file: File;

  constructor(
    private readonly _unitGenericService: UnitGenericService,
    private readonly _unitHydrantService: UnitHydrantService,
    private readonly _unitPondService: UnitPondService,
    private readonly _unitStationPechinaService: UnitStationPechinaService,
    private readonly _sectorService: SectorService,
    private readonly _sectorFactory: SectorFactory,
    private readonly _formBuilder: FormBuilder,
    private readonly _dialogRef: MatDialogRef<DialogSectorCreateComponent>,
    private readonly _unitService: UnitService,
    private readonly _uploadService: UploadService,
    private readonly _sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<DialogSectorCreateComponent>,
    @Inject(MAT_DIALOG_DATA)
    public sector: SectorEntity
  ) {}

  ngOnInit(): void {
    this.subUnits = this._unitService.findAll().subscribe((unitsRO) => {
      this.units = unitsRO.units;
    });

    if (this.sector) {
      this.initSectorUpdate();
    } else {
      this.initSectorCreate();
    }

    this.sectorForm = this._formBuilder.group({
      id: [this.sector.id],
      code: [this.sector.code, [Validators.pattern('[A-Z0-9]{1,5}')]],
      name: [this.sector.name, [Validators.required]],
      description: [this.sector.description],
      active: [this.sector.active, [Validators.required]],
      units: [this.sector.units],
      image: [this.sector.image],
    });
  }

  private initSectorUpdate(): void {
    this.create = false;
    if (
      this.sector.image !== undefined &&
      this.sector.image !== null &&
      this.sector.image !== ''
    ) {
      this._uploadService.getImage(this.sector.image).subscribe((next) => {
        const reader = new FileReader();
        reader.onload = () => {
          this.imageURL = this._sanitizer.bypassSecurityTrustResourceUrl(
            reader.result as string
          ) as string;
        };
        reader.readAsDataURL(next);
      });
    }
  }

  private initSectorCreate(): void {
    this.create = true;
    this.sector = new SectorEntity();
    this.imageURL = GLOBAL.IMAGE_DEFAULT;
  }

  accept(): void {
    if (this.sectorForm.valid) {
      this.loading = true;
      this.uploadImage();
      this.loading = false;
    } else {
      let html = '<h2>Existen campos incorrectos</h2><ul>';
      if (this.sectorForm.get('code').invalid) {
        html +=
          '<li>El código debe contener de 1 a 5 caracteres (letras mayúsculas o números)</li>';
      }
      if (this.sectorForm.get('name').invalid) {
        html += '<li>El nombre debe estar entre 3 y 45 caracteres</li>';
      }
      html += '</ul>';
      throw new Error(html);
    }
  }

  private createOrUpdateSector(): void {
    if (this.create) {
      this.createSector();
    } else {
      this.updateSector();
    }
  }

  private createSector(): void {
    const sectorCreateDto: SectorCreateDto = this._sectorFactory.getSectorCreateDto(
      this.sectorForm.value
    );
    this._sectorService.create(sectorCreateDto).subscribe((sectorRO) => {
      this._unitGenericService.findAll();
      this._unitHydrantService.findAll();
      this._unitPondService.findAll();
      this._unitStationPechinaService.find();
      this._dialogRef.close(sectorRO.sector);
    });
  }

  private updateSector(): void {
    const sectorUpdateDto: SectorUpdateDto = this._sectorFactory.getSectorUpdateDto(
      this.sectorForm.value
    );
    this._sectorService.update(sectorUpdateDto).subscribe((sectorRO) => {
      this._unitGenericService.findAll();
      this._unitHydrantService.findAll();
      this._unitPondService.findAll();
      this._unitStationPechinaService.find();
      this._dialogRef.close(sectorRO.sector);
    });
  }

  private uploadImage(): void {
    if (this.file !== undefined && this.file !== null) {
      const formData = new FormData();
      formData.append('file', this.file, this.file.name);
      this._uploadService.uploadImage(formData).subscribe((next) => {
        if (next) {
          this.sectorForm.value.image = next.filename;
          this.createOrUpdateSector();
        }
      });
    } else {
      this.createOrUpdateSector();
    }
  }

  compareUnitSector(d1: any, d2: any): boolean {
    return d1 && d2 && d1.id === d2.id;
  }

  close(): void {
    this._dialogRef.close();
  }

  remove(removeUnit: UnitEntity): void {
    this.sectorForm
      .get('units')
      .setValue(
        this.sectorForm.value.units.filter((unit) => unit.id !== removeUnit.id)
      );
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files[0];
    let validImage = true;
    let html = '<h2>Existen campos incorrectos</h2><ul>';
    if (!file.name.endsWith('.jpg')) {
      html += '<li>Solo se permiten imágenes en .jpg</li>';
      validImage = false;
    }
    if (file.size > 5000000) {
      html += '<li>El tamaño máximo permitido son 5 MB (5000000 Bytes)';
      validImage = false;
    }
    html += '</ul>';
    if (!validImage) {
      throw new Error(html);
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageURL = reader.result as string;
        this.file = file;
      };
      reader.readAsDataURL(file);
    }
  }

  ngOnDestroy(): void {
    this.sector = null;
    if (this.subUnits) {
      this.subUnits.unsubscribe();
    }
  }

  getType(unit: UnitEntity): string {
    switch (unit.unitTypeTable) {
      case UnitTypeTableEnum.UNIT_GENERIC:
        return 'Genérico';
      case UnitTypeTableEnum.UNIT_HYDRANT:
        return 'Hidrante';
      case UnitTypeTableEnum.UNIT_POND:
        return 'Balsa';
      case UnitTypeTableEnum.UNIT_STATION_PECHINA:
        return 'Estación Pechina';
      default:
        return 'Indefinido';
    }
  }
}
