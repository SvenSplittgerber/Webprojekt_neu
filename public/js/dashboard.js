/* Function to show 'Visitors'-Graph*/
/* Author: Johannes Rehm */
function showVisitors(){
	// Set the dimensions of the graph
	var margin = {top: 30, right: 50, bottom: 30, left: 50},
		width = 800 - margin.left - margin.right,
		height = 530 - margin.top - margin.bottom;

	// Parse the date
	var parseDate = d3.time.format("%d/%b/%Y").parse,
		formatDate = d3.time.format("%d/%b"),
		bisectDate = d3.bisector(function(d) { return d.date; }).left;

	// Set the graph ranges
	var x = d3.time.scale().range([0, width]);
	var y = d3.scale.linear().range([height, 0]);

	// Define the X axis
	var xAxis = d3.svg.axis().scale(x)
		.orient("bottom").ticks(10);

	// Define the Y axis
	var yAxis = d3.svg.axis().scale(y)
		.orient("left").ticks(10);

	// Define the graph-line
	var graphLine = d3.svg.line()
		.x(function(d) { return x(d.date); })
		.y(function(d) { return y(d.hits); });

	// Adding the svg
	var svg = d3.select("#visitors_container")
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform",
			"translate(" + margin.left + "," + margin.top + ")");

	var lineSvg = svg.append("g");

	var focusDate = svg.append("g")
		.style("display", "none");

	// Get the json data
	d3.json("api/data", function(error, data) {

		// Getting just the visitors data
		data = data.visitors;

		// Sort the visitors data by date using the compareDate function
		data.sort(compareDate);

		data.forEach(function(d) {
			d.date = parseDate(d.date);
			d.hits = +d.hits;
		});

		// Scaling the range of the data
		x.domain(d3.extent(data, function(d) { return d.date; }));
		y.domain([0, d3.max(data, function(d) { return d.hits; })]);

		// Adding the graphLine path
		lineSvg.append("path")
			.attr("class", "line")
			.attr("d", graphLine(data));

		// Adding the X axis
		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);

		// Adding the Y axis
		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)
		.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 6)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text("Visitors");

		// Appending the X line (tooltip)
		focusDate.append("line")
			.attr("class", "x")
			.style("stroke", "grey")
			.style("stroke-dasharray", "3,3")
			.attr("y1", 0)
			.attr("y2", height);

		// Appending the Y line (tooltip)
		focusDate.append("line")
			.attr("class", "y")
			.style("stroke", "grey")
			.style("stroke-dasharray", "3,3")
			.attr("x1", width)
			.attr("x2", width);

		// Appending the circle (tooltip)
		focusDate.append("circle")
			.attr("class", "y")
			.style("fill", "none")
			.style("stroke", "grey")
			.attr("r", 4);

		// Placing the value (tooltip)
		focusDate.append("text")
			.attr("class", "y1")
			.style("stroke", "white")
			.style("stroke-width", "3.5px")
			.style("opacity", 0.8)
			.attr("dx", 8)
			.attr("dy", "-.3em");
		focusDate.append("text")
			.attr("class", "y2")
			.attr("dx", 8)
			.attr("dy", "-.3em");

		// Placing the date (tooltip)
		focusDate.append("text")
			.attr("class", "y3")
			.style("stroke", "white")
			.style("stroke-width", "3.5px")
			.style("opacity", 0.8)
			.attr("dx", 8)
			.attr("dy", "1em");
		focusDate.append("text")
			.attr("class", "y4")
			.attr("dx", 8)
			.attr("dy", "1em");

		// Appending rect for mouse capturing
		svg.append("rect")
			.attr("width", width)
			.attr("height", height)
			.style("fill", "none")
			.style("pointer-events", "all")
			.on("mouseover", function() { focusDate.style("display", null); })
			.on("mouseout", function() { focusDate.style("display", "none"); })
			.on("mousemove", mousemove);

		// Mousemove function
		function mousemove() {
			var x0 = x.invert(d3.mouse(this)[0]),
				i = bisectDate(data, x0, 1),
				d0 = data[i - 1],
				d1 = data[i],
				d = x0 - d0.date > d1.date - x0 ? d1 : d0;

			focusDate.select("circle.y")
				.attr("transform",
					"translate(" + x(d.date) + "," +
					y(d.hits) + ")");

			focusDate.select("text.y1")
				.attr("transform",
					"translate(" + x(d.date) + "," +
					y(d.hits) + ")")
				.text(d.hits + " visitors");

			focusDate.select("text.y2")
				.attr("transform",
					"translate(" + x(d.date) + "," +
					y(d.hits) + ")")
				.text(d.hits + " visitors");

			focusDate.select("text.y3")
				.attr("transform",
					"translate(" + x(d.date) + "," +
					y(d.hits) + ")")
				.text(formatDate(d.date));

			focusDate.select("text.y4")
				.attr("transform",
					"translate(" + x(d.date) + "," +
					y(d.hits) + ")")
				.text(formatDate(d.date));

			focusDate.select(".x")
				.attr("transform",
					"translate(" + x(d.date) + "," +
					y(d.hits) + ")")
				.attr("y2", height - y(d.hits));

			focusDate.select(".y")
				.attr("transform",
					"translate(" + width * -1 + "," +
					y(d.hits) + ")")
				.attr("x2", width + width);
		}
	});

	function compareDate(a, b) {
		return new Date(a.date) - new Date(b.date);
	}
}
//-------------------------------------------------------------

/* Function to show 'RequestedFiles'-Chart*/
/* Author: Sven Splittgerber */
function showRequestedFiles(){

	// Set the dimensions of the chart
	var width = 380,
		height = 200,
        bar_height = 20,
        left_width = 65;
    var gap = 2, yRangeBand;

	// Defining the tooltip for the chart using D3-Tip
	var tip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-10, 0])
		.html(function(d) {
			return "URL: <span style='color:lightblue'>" + d.url + "</span><br>" + "Protocol: <span style='color:lightblue'>" + d.protocol + "</span>";
		})

	// Adding the svg
	var svg = d3.select("#requestedFiles_container")
        .append("svg")
        .attr("class","req_chart")
        .attr("width", left_width + width + 40)
		.attr("height", (bar_height + gap * 2) * height + 30)
        .append("g")
        .attr("transform", "translate(10, 10)");


    // Get the json data
    d3.json("api/data", function(usage) {

		// Getting just the requested files data
        usage = usage.requestedFiles;

        var x,y;

		// Getting the requested file with most hits
        var maxFile = d3.max(usage, function(d) {
            return d.hits;
        });


		// Defining the scale for bars
        x = d3.scale.linear()
            .domain([0, maxFile])
            .range([0, width]);

        yRangeBand = bar_height + 2 * gap;

        y = function(i) { return yRangeBand * i; };

		// Calling the tooltip
		svg.call(tip);

        // Setting and appending the bars
        svg.selectAll("rect")
            .data(usage)
            .enter().append("rect")
            .attr("x", left_width)
            .attr("y", function(d, i) { return y(i);})
            .attr("width", function (d) {return x(d.hits)})
            .attr("height", bar_height)
			.on('mouseover', tip.show)
			.on('mouseout', tip.hide);

        // Setting and appending bar description
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

/* Function to show 'RequestedStaticFiles'-Chart*/
/* Author: Sven Splittgerber */
function showRequestedStaticFiles(){

	// Set the dimensions of the chart
	var width = 380,
		height = 200,
		bar_height = 20,
		left_width = 65;
	var gap = 2, yRangeBand;

	// Defining the tooltip for the chart using D3-Tip
	var tip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-10, 0])
		.html(function(d) {
			return "URL: <span style='color:lightblue'>" + d.url + "</span><br>" + "Protocol: <span style='color:lightblue'>" + d.protocol + "</span>";
		})

	// Adding the svg
	var svg = d3.select("#requestedStaticFiles_container")
		.append("svg")
		.attr("class","req_chart")
		.attr("width", left_width + width + 40)
		.attr("height", (bar_height + gap * 2) * height + 30)
		.append("g")
		.attr("transform", "translate(10, 10)");


	// Get the json data
	d3.json("api/data", function(usage) {

		// Getting just the requested static files data
		usage = usage.requestedStaticFiles;

		var x,y;

		// Getting the requested file with most hits
		var maxFile = d3.max(usage, function(d) {
			return d.hits;
		});


		// Defining the scale for bars
		x = d3.scale.linear()
			.domain([0, maxFile])
			.range([0, width]);

		yRangeBand = bar_height + 2 * gap;

		y = function(i) { return yRangeBand * i; };

		// Calling the tooltip
		svg.call(tip);

		// Setting and appending the bars
		svg.selectAll("rect")
			.data(usage)
			.enter().append("rect")
			.attr("x", left_width)
			.attr("y", function(d, i) { return y(i);})
			.attr("width", function (d) {return x(d.hits)})
			.attr("height", bar_height)
			.on('mouseover', tip.show)
			.on('mouseout', tip.hide);

		// Setting and appending bar description
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

/* Author: Jessica Cramme */
function showMap() {

	// var to store tooltip object
	var tooltip;

	// size of the svg graphic
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
		// showing the world
		var projection_conic_conformal = d3.geo.mercator()
			.scale((width + 1) / 2 / Math.PI)
			.translate([width / 2, (height / 2) + 100]);

		// use projection
		var path = d3.geo.path()
			.projection(projection_conic_conformal);


		// create svg elements of each country on earth
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
			var usageColors = ["#8BC1FD", "#66A6D1", "#2185C5", "#165882", "#0B2B40"];

			// color scale
			var scaleUsageColors = d3.scale.linear();

			// ----------- throws undefined
			var minimumUsage = d3.min(usage, function(d) {
				return d.visitors;
			});

			// ----------- throws undefined
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


