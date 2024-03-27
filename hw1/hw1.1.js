/*Original data*/
const data = [
    { month: 'Jan', temperature: 12.29 },
    { month: 'Feb', temperature: 12.50 },
    { month: 'Mar', temperature: 13.11 },
    { month: 'Apr', temperature: 14.03 },
    { month: 'May', temperature: 15.01 },
    { month: 'Jun', temperature: 15.72 },
    { month: 'Jul', temperature: 15.99 },
    { month: 'Aug', temperature: 15.82 },
    { month: 'Sep', temperature: 15.23 },
    { month: 'Oct', temperature: 14.30 },
    { month: 'Nov', temperature: 13.28 },
    { month: 'Dec', temperature: 12.55 }
    ];

/*canvas size*/
const width = 1200;
const height = 700;
/*padding size*/
const padding = { top: 50, bottom: 50, left: 100, right: 50 };

/*add canvas*/
const svg = d3.select('body')
       .append('svg')
       .attr('width', width)
       .attr('height', height);

/*set xscale*/
month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const xScale = d3.scalePoint()
       .domain(month)
       .range([padding.left, width - padding.right])
       .padding(0.8); 
/*set yscale*/
const temperature = [12.29, 12.50, 13.11, 14.03, 15.01, 15.72, 15.99, 15.82, 15.23, 14.30, 13.28, 12.55]; 
const max = d3.max(temperature)
const min = d3.min(temperature)
const yScale = d3.scaleLinear()
       .domain([min - 0.5, max + 0.5])
       .range([height - padding.bottom, padding.top]);

/*add xaxis */
const xAxis = svg.append('g')
       .attr('class','xAxis')
       .attr('transform', 'translate(0,' + (height - padding.bottom) + ')')
       .call(d3.axisBottom(xScale));
/*add yaxis */
const yAxis = svg.append('g')
       .attr('class', 'yAxis')
       .attr('transform', `translate(100, 0)`)
       .call(d3.axisLeft(yScale).tickFormat(d => (d.toFixed(1)) + ' \u00B0C')); 

/*set line*/
const line = d3.line()
       .x((d)=>xScale(d.month))
       .y((d)=>yScale(d.temperature));

/*draw lines*/
svg.append('g').append("path").datum(data).attr('class', 'line')
.attr('fill', 'none').attr('stroke', 'steelblue').attr('stroke-width', 2).attr("d", line);
/*draw points*/
svg.append('g').selectAll("circle").data(data).enter().append("circle")
.attr("r", 6).attr('transform', (d)=>`translate(${xScale(d.month)}, ${yScale(d.temperature)})`);

/*title*/
const title = svg.append('text').attr("x", width / 4).attr("y", padding.top)
          .attr("font-size", 25).text("Average temperature Between Jan 1951 and Dec 1980")
/*Xtitle*/
const xtitle = svg.append('text').attr("x", width / 2).attr("y", height)
          .attr("font-size", 25).text("Month")
/*Ytitle*/
const ytitle = svg.append('text')
    .attr("x", -350)
    .attr("y", 50)
    .attr("font-size", 25)
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle")
    .text("Temperature");