{
    "id": "airport-label-layer",
    "type": "symbol",
    "source": "baseMvt",
    "source-layer": "ad_hp_202507",
    "layout": {
      "icon-image": "airport-icon",
      "icon-size": 0.1,
      "symbol-z-order": "viewport-y",
      "text-field": [
        "get",
        "codeId"
      ],
      "text-font": [
        "Open Sans Italic"
      ],
      "text-size": 12,
      "text-offset": [
        0,
        1
      ]
    },
    "paint": {
      "text-color": "#162626"
    }
  },
  {
    "id": "airspaceLayer",
    "type": "line",
    "source": "baseMvt",
    "source-layer": "airspace_line_202507",
    "paint": {
      "line-color": "#434340",
      "line-opacity": 0.8,
      "line-width": 2
    }
  },
  {
    "id": "segmentLayer",
    "type": "line",
    "source": "baseMvt",
    "source-layer": "segment_202507",
    "paint": {
      "line-color": "#162626",
      "line-opacity": 0.8,
      "line-width": 1
    }
  },
  {
    "id": "controlledLayer",
    "type": "line",
    "source": "baseMvt",
    "source-layer": "controlled_line_202507",
    "paint": {
      "line-color": "#0A8A24",
      "line-opacity": 0.8,
      "line-width": 1
    }
  },
  {
    "id": "restrictedLayer",
    "type": "line",
    "source": "baseMvt",
    "source-layer": "restricted_line_202507",
    "paint": {
      "line-color": "#F6A708",
      "line-opacity": 0.8,
      "line-width": 1
    }
  },
  {
    "id": "vorLayer",
    "type": "circle",
    "source": "baseMvt",
    "source-layer": "vor_202507",
    "paint": {
      "circle-color": "#CD97F0",
      "circle-opacity": 0.8,
      "circle-radius": 4
    }
  },
  {
    "id": "ndbLayer",
    "type": "circle",
    "source": "baseMvt",
    "source-layer": "ndb_202507",
    "paint": {
      "circle-color": "#CD97F0",
      "circle-opacity": 0.8,
      "circle-radius": 4
    }
  }