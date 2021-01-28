

export enum MQTTTopics {

  OBSERVER_SERVER_TEST_COMMUNICATION = 'server/test',

  PUBLISH_STATION = 's/es/', // station
  PUBLISH_SET = 's/cj/', // set
  PUBLISH_SECTOR = 's/st/', // sector
  PUBLISH_UNIT_GENERIC = 's/u/g/', // unit/generic
  PUBLISH_UNIT_HYDRANT = 's/u/h/', // unit/hydrant
  PUBLISH_UNIT_POND = 's/u/p/', // unit/pond
  PUBLISH_UNIT_STATION_PECHINA = 's/u/s/', // unit/pond

  OBSERVE_STATION = 'n/es/', // station
  OBSERVE_SET = 'n/cj/', // set
  OBSERVE_SECTOR = 'n/st/', // sector
  OBSERVE_UNIT_GENERIC = 'n/u/g/', // unit/generic
  OBSERVE_UNIT_HYDRANT = 'n/u/h/', // unit/hydrant
  OBSERVE_UNIT_POND = 'n/u/p/', // unit/pond
  OBSERVE_UNIT_STATION_PECHINA = 'n/u/s/', // unit/station/

  OBSERVE_STATION_TEST = 's/es/', // station
  OBSERVE_SET_TEST = 's/cj/', // set
  OBSERVE_SECTOR_TEST = 's/st/', // sector
  OBSERVE_UNIT_GENERIC_TEST = 's/u/g/', // unit/generic
  OBSERVE_UNIT_HYDRANT_TEST = 's/u/h/', // unit/hydrant
  OBSERVE_UNIT_POND_TEST = 's/u/p/', // unit/pond
  OBSERVE_UNIT_STATION_PECHINA_TEST = 's/u/s/', // unit/station/

}
