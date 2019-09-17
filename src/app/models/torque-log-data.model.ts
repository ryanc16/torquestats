export class TorqueLogData implements TorqueLogDataModel {
  fileName: string;
  sensors: string[];
  data: any[][];
  constructor(logModel: TorqueLogDataModel) {
    if(logModel != null) {
      this.fileName = logModel.fileName;
      this.sensors = logModel.sensors;
      this.data = logModel.data;
    }
  }

  getDataForSensor(sensor: string): any[] {
    let out = [];
    const index = this.sensors.indexOf(sensor);
    this.data.map(row => row[index]);
    return out;
  }
}
export interface TorqueLogDataModel {
  fileName: string;
  sensors: string[];
  data: any[][];
}