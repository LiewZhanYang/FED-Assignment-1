const market = new maptilersdk.Marker()
  .setLngLat([103.7755928, 1.5017336])
  .setPopup(new maptilersdk.Popup().setHTML("&lt;h1&gt;Mid Valley Branch&lt;/h1&gt;"))
  .addTo(map);

const gc = new maptilersdkMaptilerGeocoder.GeocodingControl({});

map.addControl(gc, "top-left");



const book1 = new maptilersdk.Marker()
  .setLngLat([103.7845637, 1.4373375])
  .setPopup(new maptilersdk.Popup().setHTML("&lt;h1&gt;WoodLands Square Branch&lt;/h1&gt;"))
  .addTo(map);

const book2 = new maptilersdk.Marker()
  .setLngLat([103.6854102, 1.5146608])
  .setPopup(new maptilersdk.Popup().setHTML("&lt;h1&gt;Paradigm Mall Branch&lt;/h1&gt;"))
  .addTo(map);

const book3 = new maptilersdk.Marker()
  .setLngLat([103.6714557, 1.5171402])
  .setPopup(new maptilersdk.Popup().setHTML("&lt;h1&gt;Sutera Mall Branch&lt;/h1&gt;"))
  .addTo(map);

const book4 = new maptilersdk.Marker()
  .setLngLat([103.6556599, 1.4804522])
  .setPopup(new maptilersdk.Popup().setHTML("&lt;h1&gt;AEON Bukit Indah Branch&lt;/h1&gt;"))
  .addTo(map);

console.log(marker.getPopup());
