import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { CSVDocument, CSVDocumentModel } from 'src/app/models/csv-document.model';
import { TorqueLogData } from 'src/app/models/torque-log-data.model';

@Injectable()
export class TorqueDataService {
  
  constructor(private _http: HttpClient) {
    
  }

  getLog(filename: string): Promise<TorqueLogData> {
    return new Promise<TorqueLogData>((resolve, reject) => {
      if(filename.endsWith('.csv')) {
        this._http.get('assets/data/' + filename, { responseType: 'text'}).toPromise()
          .then(data => this.buildLogFromCSV(filename, data)).then(log => resolve(log))
          .catch(e => reject(e));
      }
      else if(filename.endsWith('.json')) {
        this._http.get<CSVDocumentModel>('assets/data/' + filename).toPromise()
          .then(data => this.buildLogFromJson(filename, data)).then(log => resolve(log))
          .catch(e => reject(e));
      }
    });
  }

  private buildLogFromCSV(filename: string, data: string): Promise<TorqueLogData> {
    return new Promise((resolve, reject) => {
      const csv = CSVDocument.parse(data, true);
      const log = new TorqueLogData({
        fileName: filename,
        sensors: csv.getHeader(),
        data: csv.getRows()
      });
      resolve(log);
    });
  }

  private buildLogFromJson(filename: string, data: CSVDocumentModel): Promise<TorqueLogData> {
    return new Promise((resolve, reject) => {
      const csv = new CSVDocument(data);
      const log = new TorqueLogData({
        fileName: filename,
        sensors: csv.getHeader(),
        data: csv.getRows()
      });
      resolve(log);
    });
  }
}