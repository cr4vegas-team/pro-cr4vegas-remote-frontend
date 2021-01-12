

export enum MQTTTopics {

  PUBLISH_STATION = 's/es/', // station
  PUBLISH_SET = 's/cj/', // set
  PUBLISH_SECTOR = 's/st/', // sector
  PUBLISH_UNIT_GENERIC = 's/u/g/', // unit/generic
  PUBLISH_UNIT_HYDRANT = 's/u/h/', // unit/hydrant
  PUBLISH_UNIT_POND = 's/u/p/', // unit/pond

  OBSERVE_STATION = 'n/es/', // station
  OBSERVE_SET = 'n/cj/', // set
  OBSERVE_SECTOR = 'n/st/', // sector
  OBSERVE_UNIT_GENERIC = 'n/u/g/', // unit/generic
  OBSERVE_UNIT_HYDRANT = 'n/u/h/', // unit/hydrant
  OBSERVE_UNIT_POND = 'n/u/p/', // unit/pond

}
