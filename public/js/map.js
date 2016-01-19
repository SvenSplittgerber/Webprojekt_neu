function showMap(show) {

	// var to store tooltip object
	var tooltip;

	// width and height of the svg graphic
	var width = 800,
		height = 530;

	// create the svg graphic
	var svg = d3.select("#map_container").append("svg")
		.attr("id", "usage_map")
		.attr("width", width)
		.attr("height", height);


	// load map data
	d3.json("data/map.topojson", function(error, map) {
		if (error) return console.error(error);

		// load geometries
		var geos = topojson.feature(map, map.objects.collection);

		// conic conformal projection
		// showing europe
		var projection_conic_conformal = d3.geo.mercator()
			.scale((width + 1) / 2 / Math.PI)
			.translate([width / 2, (height / 2) + 100]);

		// use projection
		var path = d3.geo.path()
			.projection(projection_conic_conformal);


		// create svg elements of each country in europe
		var countries = svg.selectAll(".country")
			.data(geos.features)
			.enter()
			.append("path")
			.attr("class", function(d) {
				return (d.properties.iso_a2 + " country");
			})
			.attr("d", path)
			.on("mouseout", function(){
				// remove tooltip on mouse out
				if (tooltip) tooltip.remove();

			})
			.on("mouseover", function(d) {
				// create tooltip on mouse over
				// showing country flag
				// and country name
				showCode(d.properties.iso_a2, projection_conic_conformal(d3.geo.centroid(d.geometry)), svg);
			});

		colorMap();

	});

	function colorMap(projection) {

		// set all contries to grey (no data)
		d3.selectAll(".country")
			.style("fill", "#A1A1A1")
			.style({'stroke-width':'1.0px','stroke':'#ffffff'});

		d3.json("api/data", function(error, usage) {

			usage = usage.geolocationCountries;

			// colors
			var usageColors = ["#fee391", "#fec44f", "#fe9929", "#d95f0e", "#993404"];

			// color scale
			var scaleUsageColors = d3.scale.linear();

			// ----------- Wirft undefined
			var minimumUsage = d3.min(usage, function(d) {
				return d.visitors;
			});

			// ----------- Wirft undefined
			var maximumUsage = d3.max(usage, function(d) {
				return d.visitors;
			});

			console.log(minimumUsage + ", " + maximumUsage);

			var step = (maximumUsage - minimumUsage) / 5;

			scaleUsageColors.domain([minimumUsage, minimumUsage + 1*step, minimumUsage + 2*step, minimumUsage + 3*step, maximumUsage]);

			scaleUsageColors.range(usageColors);

			// color all countries in a loop
			for (i = 0; i < usage.length; i++) {
				d3.selectAll(".country")
					.filter("." + usage[i].country.split(" ")[0])
					.transition()
					.duration(1000)
					.style("fill", scaleUsageColors(usage[i].visitors));
			}
		});
	}

	function showCode(code, center, svg) {

		d3.json("api/data", function(error, usage) {

			usage = usage.geolocationCountries;

			if (tooltip) tooltip.remove();

			for (i = 0; i < usage.length; i++) {
				if (code === usage[i].country.split(" ")[0]) {
					var visitors = usage[i].visitors;
					var country = usage[i].country;
				}
			}

			if (visitors) {

				padding = {
					left: 10,
					top: 5,
					right: 10,
					bottom: 5
				};

				// append tooltip
				tooltip =
					svg.append("g");


				text = tooltip
					.append("text")
					.attr("class", "tooltip")
					.text(country + ": " + visitors + " visitors")
					.attr("x", center[0])
					.attr("y", center[1]);

				// get the bounding box
				bbox = text.node().getBBox();

				// create surrounding bounding rect
				rect = tooltip
					.insert("rect", ":first-child")
					.attr("class", "tooltip_rect")
					.attr("width", bbox.width + padding.left + padding.right)
					.attr("height", bbox.height + padding.top + padding.bottom)
					.attr("x", bbox.x - padding.left)
					.attr("y", bbox.y - padding.top);
			}
		});
	}
}

