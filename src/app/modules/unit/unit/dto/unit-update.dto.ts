

export class UnitUpdateDto {

  id: number;
  code: string;
  station?: number;
  sector?: number;
  sets?: number[];
  altitude: number;
  latitude: number;
  longitude: number;
  description: string;

}
