var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');
var photos;
var overlay = new ol.Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation: {
        duration: 250
    }
});
closer.onclick = function() {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
};
$.get(baseAPIURL + 'photos/list', function(data) {
    console.log(data);
    for (i = 0; i < data.length; i++) {
        var feature = new ol.Feature(data[i]);
        feature.set('nama', data[i].nama);
        var coordinate = [parseFloat(data[i].lon), parseFloat(data[i].lat)];
        var geometry = new ol.geom.Point(coordinate);
        feature.setGeometry(geometry);
        photosSource.addFeature(feature);
    }
});
var photosSource = new ol.source.Vector();
var photosstyle = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 6,
        stroke: new ol.style.Stroke({
            color: 'white',
            width: 2
        }),
        fill: new ol.style.Fill({
            color: 'green'
        })
    })
});
var photoslayer = new ol.layer.Vector({
    source: photosSource,
    style: photosstyle
});
var raster = new ol.layer.Tile({
    source: new ol.source.OSM()
});
var source = new ol.source.Vector({
    wrapX: false
});
var vector = new ol.layer.Vector({
    source: source
});
var map = new ol.Map({
    layers: [raster, vector, photoslayer],
    target: 'olpmap',
    overlays: [overlay],
    view: new ol.View({
        projection: 'EPSG:4326',
        center: [110, -6],
        zoom: 5
    })
});
var typeSelect = 'Point';
var draw;

function addInteraction() {
    var value = typeSelect;
    if (value !== 'None') {
        draw = new ol.interaction.Draw({
            source: source,
            type: typeSelect
        });
        map.addInteraction(draw);
    }
};
typeSelect.onchange = function() {
    map.removeInteraction(draw);
    addInteraction();
};
addInteraction();
map.on("singleclick", function(evt) {
    var coordinate = evt.coordinate;
    var hdms = ol.coordinate.toStringHDMS(coordinate);
    content.innerHTML = "<p>You clicked here:</p><code>" + hdms + "</code>";
    overlay.setPosition(coordinate);
});