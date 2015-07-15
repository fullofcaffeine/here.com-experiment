$(function() {
  nokia.Settings.set("app_id", "");
  nokia.Settings.set("app_code", "");

  var map = new nokia.maps.map.Display(
    document.getElementById("map-container"), {
      components: [
        // Behavior collection
        new nokia.maps.map.component.Behavior(),
        new nokia.maps.map.component.ZoomBar(),
        new nokia.maps.map.component.Overview(),
        new nokia.maps.map.component.TypeSelector(),
        new nokia.maps.map.component.ScaleBar() ],
        zoomLevel: 3,
        //center: [6.2630636,-75.5931752]
        center: [53.1380, 173.0219]
    }
  );

  var heatmapData2 = [
    {"value":6.1,"longitude":173.0219, "latitude":53.1380},
    {"value":5.8,"longitude":-171.8583, "latitude":52.0415},
    {"value":5.4,"longitude":-169.9851, "latitude":53.3657},
    {"value":4.6,"longitude":-169.5266, "latitude":51.2915},
    {"value":4.4,"longitude":-176.4482, "latitude":51.5722},
    {"value":4.3,"longitude":-171.5867, "latitude":51.8108},
    {"value":4.1,"longitude":-151.8272, "latitude":59.8977},
    {"value":3.6,"longitude":-171.7213, "latitude":51.6348},
    {"value":3.8,"longitude":-156.0880, "latitude":56.1681}
  ];

  // Definition of color gradient to be used in the Heatmap
  var colorizeAPI = {
    stops: {
      "0": "#E8680C",
      "0.25": "#F5A400",
      "0.5": "#FF9000",
      "0.75": "#FF4600",
      "1": "#F51F00"
    },
    interpolate: false
  };

  var hmProvider = new nokia.maps.heatmap.Overlay({
    colors: colorizeAPI,
    opacity: 0.4,
    type: "density"
  });

  // Assuming that data have been loaded previously:
  console.log(heatmapData);
  hmProvider.addData(heatmapData2);
  map.overlays.add(hmProvider);
});
