export class CSVDocument {

  private header: string[] = null;
  private rows: any[][] = [];

  constructor(csvModel?: CSVDocumentModel) {
    if(csvModel != null) {
      this.header = csvModel.header;
      this.rows = csvModel.rows;
    }
  }

  static parse(data: string, includesHeader: boolean = true) {
    const csvModel: CSVDocumentModel = {
      header: null,
      rows: []
    };
    if(data != null) {
      csvModel.rows = data.split('\n').map(row => row.split(',').map(col => col.trim()));
      if(includesHeader == true) {
        csvModel.header = csvModel.rows.splice(0,1)[0];
        // this.rows = this.rows.map(row => {
        //   let r = {};
        //   for(let i=0; i<this.header.length; i++) {
        //     r[this.header[i]] = row[i];
        //   }
        //   return r;
        // })
      }
      csvModel.rows.forEach(row => {
        row.forEach((col, idx) => {
          // The first two columns are times
          if(idx > 1) {
            row[idx] = parseFloat(col as any as string);
          }
        });
      });
    }

    return new CSVDocument(csvModel);
  }

  hasHeader(): boolean {
    return this.header != null;
  }

  getHeader(): string[] {
    return this.header;
  }

  getRows(): any[] {
    return this.rows;
  }

}

export interface CSVDocumentModel {
  header: string[];
  rows: any[][];
}