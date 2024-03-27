/*Original data*/
Monthset = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
temperature = [12.29, 12.50, 13.11, 14.03, 15.01, 15.72, 15.99, 15.82, 15.23, 14.30, 13.28, 12.55]

/*convas size */
const width = 1200;
const height = 800;
const padding = { top: 50, bottom: 50, left: 50, right: 50 };
/*csv path*/
const origin_Data = "../temperature.csv"

/*set canvas*/
const svg = d3.select('body').append('svg')
      .attr('width', width).attr('height', height);
/*create box*/
const Box = d3.select('body').append('Box')

/*set mouse over detector*/
const mouseOver = function(event, d){
   /*set box for every time detection*/
   Box.style('opacity', 1)
      .style("position", "absolute")
      .style("top", (event.y - 10) + "px")
      .style("left", (padding.left - 35) + "px")
      .html(d.Year)

   d3.select(this).style('stroke','black')
}

/*set mouse leave detector so that we can remove the previous box */
const mouseLeave = function(){
   /*remove box*/
   Box.style('opacity', 0)
   d3.select(this).style('stroke','none')
}

d3.csv(origin_Data).then(function(data){
   /*read csv*/
   const copy_data = data.map(obj => ({ ...obj }));
   month = data.map((d)=>d.Month)
   year = data.map((d)=>d.Year)
   anomaly = data.map((d)=>d.Anomaly)

   /*get year for y axis*/
   Yearset = new Set(year)
   newyear = Array.from(Yearset)

   /*set Xscale*/
   const xScale = d3.scaleBand()
         .domain(month).range([padding.left, width - padding.right])
   /*add Xaxis*/
   const xAxis = svg.append("g").attr("class", "xAxis")
                     .attr("transform", 'translate(0,' + (height - padding.bottom) + ')')
                     .call(d3.axisBottom(xScale).tickFormat((i)=> Monthset[i - 1]))
   /*set yScale*/
   const yScale = d3.scaleBand()
         .domain(newyear).range([padding.top, height - padding.bottom])

   /*temperature dealt*/
   data.forEach(d => {
      d.Anomaly = parseFloat(d.Anomaly) + temperature[d.Month - 1];
  });
   actual_temperature = data.map(d => parseFloat(d.Anomaly));
   const max_temperature = d3.max(actual_temperature);
   //console.log(max_temperature)
   const min_temperature = d3.min(actual_temperature);
   //console.log(min_temperature)
   range = max_temperature - min_temperature
   //console.log(range)

   /*add rect*/
   svg.append("g").selectAll("rect").data(copy_data).enter().append("rect")
      .attr("x", (d)=>xScale(d.Month)).attr("y", (d)=>yScale(d.Year))
      .attr("width", xScale.bandwidth()).attr("height", yScale.bandwidth())
      .style("fill", function(d) { 
         return d3.interpolateRdBu(1 - parseFloat(temperature[d.Month - 1] + parseFloat(d.Anomaly) - min_temperature) / range)}
      ).on("mouseover", mouseOver)
      .on("mouseleave", mouseLeave)
   
   // legendScale setting for temperatures
   const legend_Scale = d3.scaleLinear()
                  .domain([0, 1])
                  .range([width / 2 - padding.left * 4, width / 2 + padding.right * 4])
   
   // create legendAxis on svg
   const legendAxis = svg.append("g").attr("class","legendAxis")
                  .attr("transform","translate(0,"+ (height - padding.top / 2) + ")")
                  .call(d3.axisBottom(legend_Scale).tickFormat((d)=> ((d * range + min_temperature) + "°C")).ticks(4))
   
   // add lengend rectangles
   legendAxis.append("g").selectAll("rect").data(d3.range(0, 1, 0.01)).enter().append("rect")
             .style("fill", (d)=>d3.interpolateRdBu(1 - d))
             .attr('height', 5).attr('width', 5)
             .attr("x", (d)=> legend_Scale(d))
});

/*title*/
const title = svg.append('text').attr("x", width / 6).attr("y", padding.top - 10)
          .attr("font-size", 25).text("Monthly Absolute Values Heatmap Between Jan 1951 and Dec 1980")