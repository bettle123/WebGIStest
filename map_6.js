/*
@Author: Su Ming Yi
@Date: 02/17/2019
@Goal: display AQI on leaflet map
*/

// first map layer
var Link_1 = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
var Url_1 = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var Attrib_1 = '&copy; ' + Link_1 + ' Contributors';
var Map_1 = L.tileLayer(Url_1, {attribution: Attrib_1});

// second layer	
var Url_2 = 'https://wmts.nlsc.gov.tw/wmts/EMAP/default/GoogleMapsCompatible/{z}/{y}/{x}';
var Attrib_2 = '© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';	
var EMAP_Map = L.tileLayer(Url_2, {attribution: Attrib_2});


var map = L.map('map', {
	layers: [EMAP_Map]
	})
	.setView([25.0375928,121.5529563], 7);


	
var baseLayers = {
	"EMAP_Map": EMAP_Map,
	"Map_1": Map_1,
	};
	
L.control.layers(baseLayers).addTo(map);


// Initialize the SVG layer
map._initPathRoot()   

// We simply pick up the SVG from the map object 
var svg = d3.select("#map").select("svg"),
g = svg.append("g");



// We simply pick up the SVG from the map object 
var svg = d3.select("#map").select("svg"),
g = svg.append("g");
	
d3.json("AQI.json", function(error, data) {
	
	var dataset = [];
	data.forEach(function(d) {
		
        d.AQI = d.AQI;


		d.LatLng = new L.LatLng(d.Latitude, d.Longitude)
		// create our data set
		//console.log(d.AQI);
		var template =[];
		template.push(d.Latitude);
		template.push(d.Longitude);
		template.push(d.AQI);
		dataset.push(template);
	});
	
	
	// circle
	var AQI_circle = g.selectAll("circle")
			.data(data)
			.enter().append("circle")
			.style("stroke", "black")  
			.style("opacity", 1.0) 
			.style("fill", "blue")
			.attr("r", 15);  
	
	// text
	var AQI_text = g.selectAll("text")
				.data(data)
				.enter().append("text")
				.attr("fill", "red")
				.attr('font-size', 15)
				.attr("font-weight", "bold")
				.attr("text-anchor", "start")
				.text(function(d){
					return d.AQI;
				});
	map.on("viewreset", update);
	update();
	
	function update() {

		AQI_circle.attr("transform", 
			function(d) { 
				return "translate("+ 
					(map.latLngToLayerPoint(d.LatLng).x+8) +","+ 
					(map.latLngToLayerPoint(d.LatLng).y-5) +")";
			})
		AQI_text.attr("transform", 
			function(d) { 
				return "translate("+ 
					map.latLngToLayerPoint(d.LatLng).x +","+ 
					map.latLngToLayerPoint(d.LatLng).y +")";
			}
		)
	}
	
	
	// idw effect
	var idw = L.idwLayer(dataset,{
            opacity: 0.2,
            maxZoom: 10,
            cellSize: 50,
            exp: 10,
            max: d3.max(data, function(d) {return d.AQI;})
    }).addTo(map);
	
})

	
	

	
	