
var cvsfile = "https://raw.githubusercontent.com/siddharthagit/datasets/main/csv/spotify-2023.csv";
//const Chart_By_Artist = "byartist";
//const Chart_By_Track = "bytrack";
async function loadTop10TracksByStreams(e,gtype) {
  var X_FIELD_NAME = "track_name";
  var Y_FIELD_NAME = "artist_name";

  var htmlParentId = "#my_dataviz"
  //clear the screen
  d3.select(htmlParentId).html("");
  var selectedYear = e;
  //alert(selectedYear)
  
  // set the dimensions and margins of the graph
  var margin = { top: 30, right: 30, bottom: 70, left: 60 },
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3.select(htmlParentId)
    .append("svg").attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g").attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  // Parse the Data
  d3.csv(cvsfile, function (data) {

    if (selectedYear == -1) {

    }
    else {
      data = data.filter(function (d) { return d.released_year == selectedYear })
    }

    data = data.sort(function (a, b) {
      return d3.descending(+a.streams, +b.streams);
    }).slice(0, 10);//top 10 here

    if (gtype == "byartist") {
      var data3 = d3.nest()
      .key(function (d) { return d.artist_name; })
      .rollup(function (d) {
        return d3.sum(d, function (g) { return g.streams; });
      }).entries(data);
      data = data3;
    }

    var maxDomain = d3.max(data, function (d) { return +d.streams; });
    var minDomain = d3.min(data, function (d) { return +d.streams; });

    console.log("Sidd Debug maxDomain " + maxDomain);
    console.log("Sidd Debug minDomain " + minDomain);

    tooltip = d3
    .select('body')
    .append('div')
    .attr('class', 'd3-tooltip')
    .style('position', 'absolute')
    .style('z-index', '10')
    .style('visibility', 'hidden')
    .style('padding', '10px')
    .style('background', 'rgba(0,0,0,0.6)')
    .style('border-radius', '4px')
    .style('color', '#fff')
    .text('a simple tooltip');

    // X axis
    var x = d3.scaleBand()
      .range([0, width])
      .domain(data.map(function (d) { return d[X_FIELD_NAME]; }))
      .padding(0.2);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Add Y axis
    var yscale = d3.scaleLinear().domain([minDomain-10000000, maxDomain]).range([height, 0]);
    //svg.append("g").call(d3.axisLeft(yscale));
    var yaxis = d3.axisLeft(yscale).tickFormat(function(d){return d/1000000 + " M"});
    svg.append("g").call(yaxis);
    // Bars
    svg.selectAll("mybar")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", function (d) { return x(d[X_FIELD_NAME]); })
      .attr("y", function (d) { return yscale(d.streams); })
      .attr("width", x.bandwidth())
      .attr("height", function (d) { return height - yscale(d.streams); })
      .attr("fill", "#69b3a2")
      .on('mouseover', function (d, i) {
        tooltip
          .html(
            `<div>Track: ${d[X_FIELD_NAME]}</div><div>Artist: ${d[Y_FIELD_NAME]}</div><div>Streams: ${ Math.floor(d["streams"]/1000000) + " Millions"}</div>`
          )
          .style('visibility', 'visible');
        d3.select(this).transition().attr('fill', hoverColor);
    })
    .on('mousemove', function () {
        tooltip
          .style('top', d3.event.pageY - 10 + 'px')
          .style('left', d3.event.pageX + 10 + 'px');
    })
    .on('mouseout', function () {
        tooltip.html(``).style('visibility', 'hidden');
        d3.select(this).transition().attr('fill', staticColor);
    });

  })
}