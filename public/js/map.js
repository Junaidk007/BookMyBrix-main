mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: "map",
  center: coordinates,
  zoom: 9,
  style: "mapbox://styles/mapbox/streets-v12"
});

// Add controls
map.addControl(new mapboxgl.NavigationControl());
map.addControl(new mapboxgl.FullscreenControl());

// Marker with popup
new mapboxgl.Marker({ color: "red" })
  .setLngLat(coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25, className: "my-class" })
      .setHTML("<p>Exact location will be provided after booking!</p>")
  )
  .addTo(map);

// Disable interactions initially
map.scrollZoom.disable();
map.dragPan.disable();
map.doubleClickZoom.disable();
map.touchZoomRotate.disable();

// Listen for fullscreen changes
document.addEventListener("fullscreenchange", () => {
  if (document.fullscreenElement) {
    // ✅ Enable all controls + add padding
    map.scrollZoom.enable();
    map.dragPan.enable();
    map.doubleClickZoom.enable();
    map.touchZoomRotate.enable();

    // Add breathing space inside fullscreen
    map.easeTo({
      padding: { top: 80, bottom: 80, left: 80, right: 80 },
      duration: 500
    });
  } else {
    // ❌ Restrict again + remove padding
    map.scrollZoom.disable();
    map.dragPan.disable();
    map.doubleClickZoom.disable();
    map.touchZoomRotate.disable();

    map.easeTo({
      padding: { top: 0, bottom: 0, left: 0, right: 0 },
      duration: 500
    });
  }
});





// console.log(mapToken);
// mapboxgl.accessToken = mapToken;

// const map = new mapboxgl.Map({
//   container: "map", // container ID
//   center: coordinates, // [lng, lat]
//   zoom: 9, // starting zoom
// });

// // Marker with popup
// const marker = new mapboxgl.Marker({ color: "red" })
//   .setLngLat(coordinates)
//   .setPopup(
//     new mapboxgl.Popup({ offset: 25, className: "my-class" })
//       .setHTML("<p>Exact location will be provided after booking!</p>")
//   )
//   .addTo(map);

// // Disable interactions initially
// map.scrollZoom.disable();
// map.dragPan.disable();
// map.doubleClickZoom.disable();
// map.touchZoomRotate.disable();

// // Add fullscreen button
// map.addControl(new mapboxgl.FullscreenControl());

// // Listen for fullscreen changes
// document.addEventListener("fullscreenchange", () => {
//   if (document.fullscreenElement) {
//     // ✅ Enable controls in fullscreen
//     map.scrollZoom.enable();
//     map.dragPan.enable();
//     map.doubleClickZoom.enable();
//     map.touchZoomRotate.enable();

//       map.easeTo({
//       padding: { top: 100, bottom: 100, left: 100, right: 100 },
//       duration: 1000
//     });
    
//   } else {
//     // ❌ Disable again when exiting fullscreen
//     map.scrollZoom.disable();
//     map.dragPan.disable();
//     map.doubleClickZoom.disable();
//     map.touchZoomRotate.disable();
//   }
// });






// console.log(mapToken);
// mapboxgl.accessToken = mapToken;
// const map = new mapboxgl.Map({
//   container: "map", // container ID
//   center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
//   zoom: 9, // starting zoom
// });

// // console.log(coordinates);

// const marker = new mapboxgl.Marker({ color: "red" }).setLngLat(coordinates)
// .setPopup(
//   new mapboxgl.Popup({
//     offset: 25,
//     className: "my-class",
//   }).setHTML("<p>Exact location will be provided after booking!</p>")
// ).addTo(map);


// map.scrollZoom.disable();
// map.dragPan.disable();
// map.doubleClickZoom.disable();
// map.touchZoomRotate.disable();

// // When user clicks on map, enable interactions
// map.on("click", () => {
//   map.scrollZoom.disable();
//   map.dragPan.disable();
//   map.doubleClickZoom.disable();
//   map.touchZoomRotate.disable();
// });

// // (Optional) If user moves mouse out, disable again
// map.on("mouseout", () => {
//   map.scrollZoom.disable();
//   map.dragPan.disable();
//   map.doubleClickZoom.disable();
//   map.touchZoomRotate.disable();
// });

// map.addControl(new mapboxgl.FullscreenControl(
//   map.on("click", () => {
//     map.scrollZoom.enable();
//     map.dragPan.disable();
//     map.doubleClickZoom.disable();
//     map.touchZoomRotate.disable();
//   })
// ));