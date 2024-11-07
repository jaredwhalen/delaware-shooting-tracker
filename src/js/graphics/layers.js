export const clusterLayer = {
  id: 'clusters',
  type: 'circle',
  source: 'shootings',
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': ['step', ['get', 'point_count'], '#FFE1C3', 100, '#FA9632', 750, '#BB3C04'],
    'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40]
  }
};

export const clusterCountLayer = {
  id: 'cluster-count',
  type: 'symbol',
  source: 'shootings',
  filter: ['has', 'point_count'],
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-size': 12
  }
};

export const unclusteredPointLayer = {
  id: 'unclustered-point',
  type: 'circle',
  source: 'shootings',
  filter: ['!', ['has', 'point_count']],
  paint: {
    'circle-color': [
      'match',
      ['get', 'homicide'],
      'yes',
      '#FA9632',
      'no',
      '#878787',
      /* other */ '#ccc'
      ],
    'circle-radius': 7,
    'circle-opacity': 0.75,
    'circle-stroke-width': 2,
    'circle-stroke-color': '#6c6c6c'
  }
};
