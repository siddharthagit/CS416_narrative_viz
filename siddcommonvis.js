

function drawMaxMaxLine(svg, width, height) {
    svg.append('line')
      .style('stroke', 'black')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', width)
      .attr('y2', height)
      .style("stroke-opacity", 0)
      .transition().delay(2500).duration(2000).style('stroke-opacity', 0.7);
  }
  


  function drawHighRect(svg, showTooltipHighRect, moveTooltip, hideTooltip, x, y, xw, yw) {
    svg.append("rect")
      .attr("x", x)
      .attr("y", y)
      .attr("width", xw)
      .attr("height", yw)
      .style("fill-opacity", 0.0)
      .style("stroke-opacity", 0.0)
      .style("fill", "grey")
      .style("stroke", "black")
      .on("mouseover", showTooltipHighRect)
      .on("mousemove", moveTooltip)
      .on("mouseleave", hideTooltip).transition().delay(2500).duration(2000).style('stroke-opacity', 0.7).style('fill-opacity', 0.7);
  }
  
  function populateSelect(target, min, max){
    //alert(target)
    if (!target){
        return false;
    }
    else {
        var min = min || 0,
            max = max || min + 100;

        select = document.getElementById(target);

        for (var i = min; i<=max; i++){
            var opt = document.createElement('option');
            opt.value = i;
            opt.innerHTML = i;
            select.appendChild(opt);
        }
    }
}