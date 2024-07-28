var cvsfile = "https://raw.githubusercontent.com/siddharthagit/datasets/main/csv/spotify-2023.csv";
//const Chart_By_Artist = "byartist";
//const Chart_By_Track = "bytrack";


async function showBubbleChart3(htmlParentId, pmyear) {

  d3.select(htmlParentId).html("");
  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 20, bottom: 30, left: 50 },
    width = 1000 - margin.left - margin.right,
    height = 820 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3.select(htmlParentId)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  //Read the data
  d3.csv(cvsfile, function (data) {

    var data = data.sort(function (a, b) {
      return d3.descending(+a.streams, +b.streams);
    }).slice(0, 100);//top 10 here

    // Add X axis label:
    svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", width / 2 + margin.left)
      .attr("y", height + margin.top + 20)
      .text("Liveliness %");

    // Y axis label:
    svg.append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 20)
      .attr("x", -margin.top - height / 2 + 20)
      .text("Danceability %")

    // Add X axis
    var x = d3.scaleLinear()
      .domain([0, 100])
      .range([0, width]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, 100])
      .range([height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Add a scale for bubble size
    var z = d3.scaleLinear()
      .domain([200000, 1310000000])
      .range([4, 40]);

    // Add a scale for bubble color
    var myColor = d3.scaleOrdinal()
      .domain(1980,2024)
      .range(d3.schemeCategory10);

    // -1- Create a tooltip div that is hidden by default:
    var tooltip = d3.select(htmlParentId)
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "black")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("color", "white")

    // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
    var showTooltip = function (d) {
      tooltip
        .transition()
        .duration(200)
      tooltip
        .style("opacity", 1)
        .html("Track: " + d.track_name + "<br> Artist: " + d.artist_name + "<br> Stream: " + d.streams/1000000 + "M" + "<BR> Year: " + d.released_year)
        .style("left", (d3.mouse(this)[0] + 30) + "px")
        .style("top", (d3.mouse(this)[1] + 30) + "px")
    }
    var moveTooltip = function (d) {
      tooltip
        .style("left", (d3.mouse(this)[0] + 30) + "px")
        .style("top", (d3.mouse(this)[1] + 30) + "px")
    }
    var hideTooltip = function (d) {
      tooltip
        .transition()
        .duration(200)
        .style("opacity", 0)
    }

    var xAnnotation = width / 2;
        var yAnnotation = 3;
        svg.append("text")
            .attr("x", xAnnotation)
            .attr("y", yAnnotation)
            .attr("class", "annotation")
            .style("text-anchor", "middle")
            .text("Tip 1: hover over the bubles for more details;")
            .style('opacity', 10);

    // ---------------------------//
      //       LEGEND              //
      // ---------------------------//
  
      // Add legend: circles
      var valuesToShow = [10000000, 100000000, 1000000000]
      var xCircle = 390
      var xLabel = 440
      svg
        .selectAll("legend")
        .data(valuesToShow)
        .enter()
        .append("circle")
          .attr("cx", xCircle)
          .attr("cy", function(d){ return height - 100 - z(d) } )
          .attr("r", function(d){ return z(d) })
          .style("fill", "none")
          .attr("stroke", "black")
  
      // Add legend: segments
      svg
        .selectAll("legend")
        .data(valuesToShow)
        .enter()
        .append("line")
          .attr('x1', function(d){ return xCircle + z(d) } )
          .attr('x2', xLabel)
          .attr('y1', function(d){ return height - 100 - z(d) } )
          .attr('y2', function(d){ return height - 100 - z(d) } )
          .attr('stroke', 'black')
          .style('stroke-dasharray', ('2,2'))
  
      // Add legend: labels
      svg
        .selectAll("legend")
        .data(valuesToShow)
        .enter()
        .append("text")
          .attr('x', xLabel)
          .attr('y', function(d){ return height - 100 - z(d) } )
          .text( function(d){ return d/1000000 } )
          .style("font-size", 10)
          .attr('alignment-baseline', 'middle')
  
      // Legend title
      svg.append("text")
        .attr('x', xCircle)
        .attr("y", height - 100 +30)
        .text("Streams (M)")
        .attr("text-anchor", "middle")
        
        var showTooltipHighRect = function (d) {
          tooltip
            .transition()
            .duration(200)
          tooltip
            .style("opacity", 1)
            .html(" Tracks with High Danceability and liveness")
            .style("left", (d3.mouse(this)[0] + 30) + "px")
            .style("top", (d3.mouse(this)[1] + 30) + "px")
        }

        drawMaxMaxLine(svg, width, height);
        drawHighRect(svg, showTooltipHighRect, moveTooltip, hideTooltip, 400, 10, 350,350);
    // Add dots
    svg.append('g')
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "bubbles")
      .attr("cx", function (d) { return x(d.liveness_pct); })
      .attr("cy", function (d) { return y(d.Danceability_pct); })
      .attr("r", function (d) { return z(d.streams/2); })
      .style("fill", function (d) { return myColor(d.released_year); })
      // -3- Trigger the functions
      .on("mouseover", showTooltip)
      .on("mousemove", moveTooltip)
      .on("mouseleave", hideTooltip)

      // Legend title
    /*svg.append("text")
    .attr('x', 390)
    .attr("y", height - 100 +30)
    .text("Population (M)")
    .attr("text-anchor", "middle")*/

  })
}
