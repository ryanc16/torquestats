import { AfterViewInit, Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { AppConstants } from 'src/app/app-constants';
import { TorqueDataService } from 'src/app/services/rest/torque-data.service';
import { TorqueLogData } from 'src/app/models/torque-log-data.model';
import * as L from 'leaflet';
import 'leaflet-groupedlayercontrol';
import interpolate from 'color-interpolate';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'stats-map-page',
  templateUrl: './stats-map.page.html',
  styleUrls: ['./stats-map.page.scss']
})
export class StatsMapPageComponent implements OnInit, AfterViewInit {

  @ViewChild('map', {static: true})
  map: L.Map;
  tileLayers: {
    Street: L.TileLayer;
    Satellite: L.TileLayer;
  } = {
    Street: null,
    Satellite: null
  };

  pathLayer: L.LayerGroup;

  groupedOverlays: {
    Route: {
      On: L.LayerGroup;
      Off: L.LayerGroup;
    },
    Sensors: {
      [index: string]: L.LayerGroup;
    }
  } = {
    Route: {
      On: null,
      Off: null
    },
    Sensors: {}
  };
  
  logFile: string;

  log: TorqueLogData;

  constructor(private _torqueDataService: TorqueDataService, private _route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.logFile = this._route.snapshot.queryParamMap.get('log');
    if(this.logFile != null && this.logFile.length > 0) {
      this.getData().then(() => {
        this.initData();
        this.addListeners();
        this.addOverlayControls();
      });
    }
  }

  ngAfterViewInit(): void {
    this.map = L.map((this.map as any as ElementRef).nativeElement);
    this.map.setView([40.7, -77.9], 11);
    this.addMapTiles();
    this.tileLayers.Street.addTo(this.map);
  }

  getData(): Promise<void> {
    return this._torqueDataService.getLog(this.logFile).then(log => {
      this.log = this.filterData(log);
    });
  }

  initData(): void {
    this.addLogPath();
    this.addLogOverlays();
  }

  addListeners(): void {
    this.map.on('overlayadd', (e: L.LayersControlEvent) => {
      this.addOverlayDataForSensor(e.name);
    })
  }

  addOverlayControls(): void {
    const options = { exclusiveGroups: Object.keys(this.groupedOverlays), groupCheckboxes: false};
    L.control.groupedLayers(this.tileLayers, this.groupedOverlays, options).addTo(this.map);
  }

  addMapTiles() {
    this.tileLayers.Street = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox.streets',
      accessToken: AppConstants.Keys.MAPBOX_API_KEY
    });

    this.tileLayers.Satellite = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox.satellite',
      accessToken: AppConstants.Keys.MAPBOX_API_KEY
    });    
  }

  addLogPath(): void {
    let pathLayer = L.layerGroup();
    L.polyline(this.log.data.map(row => [row[3], row[2]]))
    .bindPopup('Complete route')
    .addTo(pathLayer);
    this.groupedOverlays.Route.On = pathLayer;
    this.groupedOverlays.Route.Off = L.layerGroup();
    pathLayer.addTo(this.map);
  }


  addLogOverlays(): void {
    this.groupedOverlays.Sensors.Off = L.layerGroup().addTo(this.map);
    for(let i=6; i<this.log.sensors.length; i++) {
      const key = this.log.sensors[i];
      this.groupedOverlays.Sensors[key] = L.layerGroup();
    }
  }

  addOverlayDataForSensor(layerName: string): void {
    const column = this.log.sensors.indexOf(layerName);
    const layer = this.groupedOverlays.Sensors[layerName];
    if(column != -1) {
      const colormap = interpolate(['blue', 'red']);
      let filteredData = this.log.data.filter(row => Number.isNaN(row[column]) == false);
      const minmaxRows = this.getMinAndMaxRowForColumn(filteredData, column);

      // Place a marker at the minimum value
      L.marker([minmaxRows[0][3], minmaxRows[0][2]])
      .bindPopup(this.createTableForPoint(minmaxRows[0]), {minWidth: 525})
      .addTo(layer);

      // Place a marker at the maximum value
      L.marker([minmaxRows[1][3], minmaxRows[1][2]])
      .bindPopup(this.createTableForPoint(minmaxRows[1]), {minWidth: 525})
      .addTo(layer);

      const diff = minmaxRows[1][column] - minmaxRows[0][column];
      for(let i=1; i<filteredData.length; i++) {
        const current = filteredData[i];
        const prev = filteredData[i-1];
        const colorRangeValue = (current[column]-minmaxRows[0][column])/diff;
        const lineColor = colormap(colorRangeValue);
        L.polyline([[ prev[3], prev[2] ], [ current[3], current[2] ]], {
          color: lineColor,
          weight: 5,
          opacity: 0.5,
          smoothFactor: 1
        })
        .bindPopup(this.createTableForPoint(current), {minWidth: 525})
        .addTo(layer);
      }
    }
  }


  filterData(log: TorqueLogData): TorqueLogData {
    log.data = log.data.filter(row =>
      (row[2] != null && !Number.isNaN(row[2]) && row[3] != null && !Number.isNaN(row[3])))
      .unique(point => point[2]+''+point[3]);
      return log;
  }

  createTableForPoint = function(row) {
    const table = document.createElement('table');
    const tbody = document.createElement('tbody');
    for(let i=0; i<this.log.sensors.length; i++) {
      const tr = document.createElement('tr');
      const th = document.createElement('th');
      const td = document.createElement('td');
      th.textContent = this.log.sensors[i];
      td.textContent = row[i];
      tr.appendChild(th);
      tr.appendChild(td);
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    return table;
  }

  getMinAndMaxRowForColumn = function(data, index) {
    let tmpdata = data.slice(0);
    let minRow;
    let maxRow;
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;
    for(let row of tmpdata) {
      if(row[index] < min) {
        min = row[index];
        minRow = row;
      }
      if(row[index] > max) {
        max = row[index];
        maxRow = row;
      }
    }
    return [minRow, maxRow];
  }
}