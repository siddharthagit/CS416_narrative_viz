var cvsfile = "https://raw.githubusercontent.com/siddharthagit/datasets/main/csv/spotify-2023.csv";
const Chart_By_Artist = "byartist";
const Chart_By_Track = "bytrack";


async function loadTop10ArtistByStreams(e, htmlParentId) {
  //var htmlParentId = "#my_dataviz"
  //clear the screen
  d3.select(htmlParentId).html("");
  var selectedYear = e;
  //alert(selectedYear)

  // set the dimensions and margins of the graph
  var margin = { top: 30, right: 30, bottom: 70, left: 60 },
    width = 600 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  // Parse the Data
  d3.csv(cvsfile, function (data) {

  if (selectedYear == -1) {

  }
  else {
    data = data.filter(function (d) { return d.released_year == selectedYear })
  }

    var data = data.sort(function (a, b) {
      return d3.descending(+a.Danceability_pct, +b.Danceability_pct);
    }).slice(0, 1000);//top 10 here

    var data3 = d3.nest()
      .key(function (d) { return d.artist_name; })
      .rollup(function (d) {
        return d3.sum(d, function (g) { return g.Danceability_pct; });
      }).entries(data);

    //alert(JSON.stringify(data3))

    data = data3;

    

    data = data.sort(function (a, b) {
      return d3.descending(+a.value, +b.value);
    }).slice(0, 25);

    var maxDomain = d3.max(data, function (d) { return d.value; });
    var minDomain = d3.min(data, function (d) { return d.value; });
    
    //alert(JSON.stringify(data))
    //alert(maxDomain)

    // X axis
    var x = d3.scaleBand()
      .range([0, width])
      .domain(data.map(function (d) { return d.key; }))
      .padding(0.2);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Add Y axis
    var y = d3.scaleLinear().domain([minDomain, maxDomain]).range([height, 100]);
    svg.append("g").call(d3.axisLeft(y));

    // Bars
    svg.selectAll("mybar")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", function (d) { return x(d.key); })
      .attr("y", function (d) { return y(d.value); })
      .attr("width", x.bandwidth())
      .attr("height", function (d) { return height - y(d.value); })
      .attr("fill", "#69b3a2")

  })
}