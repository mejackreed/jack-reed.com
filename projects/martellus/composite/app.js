var map;

map = L.map('map', {
  center: [0, 0],
  crs: L.CRS.Simple,
  zoom: 0,
  attributionControl: false
});

var iconLayers = [];
var showImages = [1, 5, 6, 7];

$.getJSON('https://purl.stanford.edu/zf275jj8939/iiif/manifest.json', function(data) {
  $.each(data.sequences[0].canvases, function(i, value) {
    if (showImages.indexOf(i + 1) === -1) {
      return true;
    }

    var tileLayer = L.tileLayer.iiif(
      value.images[0].resource['@id'].replace('full/full/0/default.jpg', 'info.json'), {
        fitBounds: false,
    });

    iconLayers.push({
      title: value.label,
      layer: tileLayer,
      icon: value.images[0].resource['@id'].replace('full/full/0/default.jpg', 'full/1024,/0/default.jpg')
    })
  });

  var iconLayersControl = new L.Control.IconLayers(
    iconLayers, {
      position: 'bottomleft',
      maxLayersInRow: 10
  });

  iconLayersControl.addTo(map);
  var firstTime = true;
  iconLayers[0].layer.on('tileload', function() {
    if (firstTime) {
      this._fitBounds();
      firstTime = false;
    }
  });
});

var attribution = L.control.attribution({ prefix: false});
attribution.addAttribution('Image by Lazarus Project / MegaVision / RIT / EMEL, courtesy of the Beinecke Rare Book and Manuscript Library');
attribution.addAttribution('Developed by Ben Albritton & Jack Reed');
attribution.addTo(map);
