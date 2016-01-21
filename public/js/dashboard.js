function showVisitors(){
	// Set the dimensions of the canvas / graph
	var margin = {top: 30, right: 40, bottom: 30, left: 50},
		width = 800 - margin.left - margin.right,
		height = 530 - margin.top - margin.bottom;

// Parse the date / time
	var parseDate = d3.time.format("%d/%b/%Y").parse,
		formatDate = d3.time.format("%d/%b"),
		bisectDate = d3.bisector(function(d) { return d.date; }).left;

// Set the ranges
	var x = d3.time.scale().range([0, width]);
	var y = d3.scale.linear().range([height, 0]);

// Define the axes
	var xAxis = d3.svg.axis().scale(x)
		.orient("bottom").ticks(10);

	var yAxis = d3.svg.axis().scale(y)
		.orient("left").ticks(10);

// Define the line
	var valueline = d3.svg.line()
		.x(function(d) { return x(d.date); })
		.y(function(d) { return y(d.hits); });

// Adds the svg canvas
	var svg = d3.select("#visitors_container")
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform",
			"translate(" + margin.left + "," + margin.top + ")");

	var lineSvg = svg.append("g");

	var focus = svg.append("g")
		.style("display", "none");

// Get the data
	d3.json("api/data", function(error, data) {

		data = data.visitors;
		data.sort(comp);

		data.forEach(function(d) {
			d.date = parseDate(d.date);
			d.hits = +d.hits;
		});

		// Scale the range of the data
		x.domain(d3.extent(data, function(d) { return d.date; }));
		y.domain([0, d3.max(data, function(d) { return d.hits; })]);

		// Add the valueline path.
		lineSvg.append("path")
			.attr("class", "line")
			.attr("d", valueline(data));

		// Add the X Axis
		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);

		// Add the Y Axis
		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)
		.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 6)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text("Visitors");

		// append the x line
		focus.append("line")
			.attr("class", "x")
			.style("stroke", "grey")
			.style("stroke-dasharray", "3,3")
			.attr("y1", 0)
			.attr("y2", height);

		// append the y line
		focus.append("line")
			.attr("class", "y")
			.style("stroke", "grey")
			.style("stroke-dasharray", "3,3")
			.attr("x1", width)
			.attr("x2", width);

		// append the circle at the intersection
		focus.append("circle")
			.attr("class", "y")
			.style("fill", "none")
			.style("stroke", "grey")
			.attr("r", 4);

		// place the value at the intersection
		focus.append("text")
			.attr("class", "y1")
			.style("stroke", "white")
			.style("stroke-width", "3.5px")
			.style("opacity", 0.8)
			.attr("dx", 8)
			.attr("dy", "-.3em");
		focus.append("text")
			.attr("class", "y2")
			.attr("dx", 8)
			.attr("dy", "-.3em");

		// place the date at the intersection
		focus.append("text")
			.attr("class", "y3")
			.style("stroke", "white")
			.style("stroke-width", "3.5px")
			.style("opacity", 0.8)
			.attr("dx", 8)
			.attr("dy", "1em");
		focus.append("text")
			.attr("class", "y4")
			.attr("dx", 8)
			.attr("dy", "1em");

		// append the rectangle to capture mouse
		svg.append("rect")
			.attr("width", width)
			.attr("height", height)
			.style("fill", "none")
			.style("pointer-events", "all")
			.on("mouseover", function() { focus.style("display", null); })
			.on("mouseout", function() { focus.style("display", "none"); })
			.on("mousemove", mousemove);

		function mousemove() {
			var x0 = x.invert(d3.mouse(this)[0]),
				i = bisectDate(data, x0, 1),
				d0 = data[i - 1],
				d1 = data[i],
				d = x0 - d0.date > d1.date - x0 ? d1 : d0;

			focus.select("circle.y")
				.attr("transform",
					"translate(" + x(d.date) + "," +
					y(d.hits) + ")");

			focus.select("text.y1")
				.attr("transform",
					"translate(" + x(d.date) + "," +
					y(d.hits) + ")")
				.text(d.hits + " visitors");

			focus.select("text.y2")
				.attr("transform",
					"translate(" + x(d.date) + "," +
					y(d.hits) + ")")
				.text(d.hits + " visitors");

			focus.select("text.y3")
				.attr("transform",
					"translate(" + x(d.date) + "," +
					y(d.hits) + ")")
				.text(formatDate(d.date));

			focus.select("text.y4")
				.attr("transform",
					"translate(" + x(d.date) + "," +
					y(d.hits) + ")")
				.text(formatDate(d.date));

			focus.select(".x")
				.attr("transform",
					"translate(" + x(d.date) + "," +
					y(d.hits) + ")")
				.attr("y2", height - y(d.hits));

			focus.select(".y")
				.attr("transform",
					"translate(" + width * -1 + "," +
					y(d.hits) + ")")
				.attr("x2", width + width);
		}

	});

	function comp(a, b) {
		return new Date(a.date) - new Date(b.date);
	}
}

// Barchart für die RequestedFiles
function showRequestedFiles(){

    // width and height of the svg graphic
	var width = 800,
		height = 200,
        bar_height = 20,
        left_width = 100;
    var gap = 2, yRangeBand;

	var tip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-10, -30])
		.html(function(d) {
			return "URL: <span style='color:lightblue'>" + d.url + "</span><br>" + "Protocol: <span style='color:lightblue'>" + d.protocol + "</span>";
		})

	// create the svg graphic
	var svg = d3.select("#requestedFiles_container")
        .append("svg")
        .attr("class","req_chart")
        .attr("width", left_width + width + 40)
		.attr("height", (bar_height + gap * 2) * height + 30)
        .append("g")
        .attr("transform", "translate(10, 20)");


    //Get the data
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



        yRangeBand = bar_height + 2 * gap;

        y = function(i) { return yRangeBand * i; };

		svg.call(tip);

        //Sollte eigentlich vertikale Graue Striche zeichnen... tuts aber net die Sau
        svg.selectAll("line")
            .data(x.ticks(d3.max(usage)))
            .enter().append("line")
            .attr("x1", function(d) { return x(d) + left_width; })
            .attr("x2", function(d) { return x(d) + left_width; })
            .attr("y1", 0)
            .attr("y2", (bar_height + gap * 2) * height);

        //Sollte eigentlich die Striche beschriften
        svg.selectAll(".rule")
            .data(x.ticks(d3.max(usage)))
            .enter().append("text")
            .attr("class", "rule")
            .attr("x", function(d) { return x(d) + left_width; })
            .attr("y", 0)
            .attr("dy", -6)
            .attr("text-anchor", "middle")
            .attr("font-size", 10)
            .text(function (d) {return d});

        //Zeichnet die Balken
        svg.selectAll("rect")
            .data(usage)
            .enter().append("rect")
            .attr("x", left_width)
            .attr("y", function(d, i) { return y(i);})
            .attr("width", function (d) {return x(d.hits)})
            .attr("height", bar_height)
			.on('mouseover', tip.show)
			.on('mouseout', tip.hide);

        //Beschriftung vor den Balken
        svg.selectAll("text.name")
            .data(usage)
            .enter().append("text")
            .attr("x", left_width / 2)
            .attr("y", function(d, i){ return y(i) + bar_height/2; } )
            .attr("dx", -5)
            .attr("dy", ".36em")
            .attr("text-anchor", "middle")
            .attr('class', 'name')
            .text(function (d) {return d.hits + " Hits"});
    });




}
//-------------------------------------------------------------


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


