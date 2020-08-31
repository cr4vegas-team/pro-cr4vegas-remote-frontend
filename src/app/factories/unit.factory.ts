import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UnitHydrantEntity } from '../models/unit-hydrant.entity';
import { UnitPondEntity } from '../models/unit-pond.entity';
import { UnitEntity } from '../models/unit.entity';
import { MqttEventsService } from '../services/mqtt-events.service';

@Injectable({
    providedIn: 'root',
})
export class UnitFactory {

    constructor(
        private readonly _matDialog: MatDialog,
        private readonly _mqttEventService: MqttEventsService,
    ) { }

    createUnit(): UnitEntity {
        return new UnitEntity();
    }

    createUnitHydrant(): UnitHydrantEntity {
        return new UnitHydrantEntity(this._matDialog, this._mqttEventService);
    }

    createUnitPond(): UnitPondEntity {
        return new UnitPondEntity(this._matDialog, this._mqttEventService);
    }


}