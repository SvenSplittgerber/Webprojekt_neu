function showVisitors(){
	var margin = {top: 10, right: 10, bottom: 100, left: 0},
			width  = 960 - margin.left - margin.right,
			height = 500 - margin.top - margin.bottom;

	var parseDate = d3.time.format("%d-%b-%Y").parse;

	var x = d3.time.scale().range([0, width]),
			y = d3.scale.linear().range([height, 0]);

	var xAxis = d3.svg.axis().scale(x).orient("bottom"),
			yAxis = d3.svg.axis().scale(y).orient("left");

	var brush = d3.svg.brush().on("brush", brushed);

	var area = d3.svg.area()
			.interpolate("monotone")
			.x(function(d) { return x(d.date); })
			.y0(height)
			.y1(function(d) { return y(d.hits); });

	var svg = d3.select("#visitors_container").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom);

	svg.append("defs").append("clipPath")
			.attr("id", "clip")
			.append("rect")
			.attr("width", width)
			.attr("height", height);

	var focus = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	d3.json("api/data", function (data) {

		data = data.visitors;
		data.sort(comp);

		data.forEach(function(d) {
			d.date = parseDate(d.date);
		});



		x.domain(d3.extent(data.map(function(d) { return d.date; })));
		y.domain([0, d3.max(data.map(function(d) { return d.hits; }))]);

		focus.append("path")
				.datum(data)
				.attr("clip-path", "url(#clip)")
				.attr("d", area);

		focus.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height + ")")
				.call(xAxis);

		focus.append("g")
				.attr("class", "y axis")
				.call(yAxis);
	});

	function brushed() {
		x.domain(brush.empty() ? x2.domain() : brush.extent());
		focus.select("path").attr("d", area);
		focus.select(".x.axis").call(xAxis);
	}

	function comp(a, b) {
		return new Date(a.date).getTime() - new Date(b.date).getTime();
	}
}

function showRequestedFiles(){

    // width and height of the svg graphic
	var width = 400,
		height = 20 * 200,
        bar_height = 20;



	// create the svg graphic
	var svg = d3.select("#requestedFiles_container")
        .append("svg")
        .attr("class","req_chart")
        .attr("width", width)
		.attr("height", height);


    d3.json("api/data", function(error, usage) {
        if (error) return console.error(error);

        usage = usage.requestedFiles;

        var x,y;

        var maxFile = d3.max(usage, function(d) {
            return d.hits;
        });

        x = d3.scale.linear()
            .domain([0, maxFile])
            .range([0, width]);



        y = function(i) { return bar_height * i; }

        svg.selectAll("rect")
            .data(usage)
            .enter().append("rect")
            .attr("x", 0)
            .attr("y", function(d, i) { return y(i);})
            .attr("width", function (d) {return x(d.hits)})
            .attr("height", bar_height);


    });


}


function showMap() {

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


