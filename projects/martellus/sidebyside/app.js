// Overriding from upstream to account for non-loaded layer
L.Control.SideBySide.prototype._updateClip = function() {
  var map = this._map
  var nw = map.containerPointToLayerPoint([0, 0])
  var se = map.containerPointToLayerPoint(map.getSize())
  var clipX = nw.x + this.getPosition()
  var dividerX = this.getPosition()

  this._divider.style.left = dividerX + 'px'
  this.fire('dividermove', {x: dividerX})
  var clipLeft = 'rect(' + [nw.y, clipX, se.y, nw.x].join('px,') + 'px)'
  var clipRight = 'rect(' + [nw.y, se.x, se.y, clipX].join('px,') + 'px)'
  if (this._leftLayer && this._leftLayer.getContainer()) {
    this._leftLayer.getContainer().style.clip = clipLeft
  }
  if (this._rightLayer && this._rightLayer.getContainer()) {
    this._rightLayer.getContainer().style.clip = clipRight
  }
}

var map;

map = L.map('map', {
  center: [-200, 200],
  crs: L.CRS.Simple,
  zoom: 0,
  attributionControl: false
});

var layer1 = L.tileLayer.iiif(
  'https://stacks.stanford.edu/image/iiif/zf275jj8939%2FMartellus_300ppi_natural_color_panorama_WIP2/info.json'
).addTo(map);

var layer2 = L.tileLayer.iiif(
  'https://stacks.stanford.edu/image/iiif/zf275jj8939%2FMartellus_300ppi_combined_processes_WIP2_panorama_with_blue_water/info.json',
);

setTimeout(function() {
  layer2.addTo(map);
}, 50)

L.control.sideBySide(layer1, layer2).addTo(map);

var attribution = L.control.attribution({ prefix: false});
attribution.addAttribution('Image by Lazarus Project / MegaVision / RIT / EMEL, courtesy of the Beinecke Rare Book and Manuscript Library');
attribution.addAttribution('Developed by Ben Albritton & Jack Reed');
attribution.addTo(map);
