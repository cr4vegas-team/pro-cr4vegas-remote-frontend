import { Map } from "mapbox-gl";
import { MatDialog } from '@angular/material/dialog';
import { MqttEventsService } from '../services/mqtt-events.service';
import { UnitHydrantEntity } from '../models/unit-hydrant.entity';
import { UnitEntity } from '../models/unit.entity';


export class UnitFactory {

    constructor(
        private _map: Map,
        private readonly _matDialog: MatDialog,
        private readonly _mqttEventService: MqttEventsService,
    ) { }

    createUnit(): UnitEntity {
        return new UnitEntity();
    }

    createUnitHydrant(): UnitHydrantEntity {
        return new UnitHydrantEntity(this._map, this._matDialog, this._mqttEventService);
    }

}