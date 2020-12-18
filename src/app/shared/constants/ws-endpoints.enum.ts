export enum WSEndPoints {
  SEND_CREATE_UNIT_HYDRANT = 'ws-client/create/unit/hydrant',
  SEND_UPDATE_UNIT_HYDRANT = 'ws-client/update/unit/hydrant',
  SEND_UNIT_HYDRANT = 'ws-client/unit/hydrant',
  RECEIVE_CREATE_UNIT_HYDRANT = 'ws-server/create/unit/hydrant',
  RECEIVE_UPDATE_UNIT_HYDRANT = 'ws-server/update/unit/hydrant',
  RECEIVE_UNIT_HYDRANT = 'ws-server/unit/hydrant',

  SEND_CREATE_UNIT_POND = 'ws-client/create/unit/pond',
  SEND_UPDATE_UNIT_POND = 'ws-client/update/unit/pond',
  SEND_UNIT_POND = 'ws-client/unit/pond',
  RECEIVE_CREATE_UNIT_POND = 'ws-server/create/unit/pond',
  RECEIVE_UPDATE_UNIT_POND = 'ws-server/update/unit/pond',
  RECEIVE_UNIT_POND = 'ws-server/unit/pond',

  SEND_CREATE_UNIT_GENERIC = 'ws-client/create/unit/generic',
  SEND_UPDATE_UNIT_GENERIC = 'ws-client/update/unit/generic',
  SEND_UNIT_GENERIC = 'ws-client/unit/generic',
  RECEIVE_CREATE_UNIT_GENERIC = 'ws-server/create/unit/generic',
  RECEIVE_UPDATE_UNIT_GENERIC = 'ws-server/update/unit/generic',
  RECEIVE_UNIT_GENERIC = 'ws-server/unit/generic',

  SEND_CREATE_SECTOR = 'ws-client/create/sector',
  SEND_UPDATE_SECTOR = 'ws-client/update/sector',
  RECEIVE_CREATE_SECTOR = 'ws-server/create/sector',
  RECEIVE_UPDATE_SECTOR = 'ws-server/update/sector',

  SEND_CREATE_STATION = 'ws-client/create/station',
  SEND_UPDATE_STATION = 'ws-client/update/station',
  RECEIVE_CREATE_STATION = 'ws-server/create/station',
  RECEIVE_UPDATE_STATION = 'ws-server/update/station',

  SEND_CREATE_SET = 'ws-client/create/set',
  SEND_UPDATE_SET = 'ws-client/update/set',
  RECEIVE_CREATE_SET = 'ws-server/create/set',
  RECEIVE_UPDATE_SET = 'ws-server/update/set',
}
