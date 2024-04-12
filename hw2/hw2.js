/**set constant */
const width = 650, height = 650, padding = { top: 100, bottom: 100, left: 100, right: 100 };
const Data = [{path: './Data/PCA.csv', svg: 'PCA'}, 
                 {path: './Data/TSNE.csv', svg: 'TSNE'}, 
                 {path: './Data/MDS.csv', svg: 'MDS'}];

/*choose svg and plot */
Data.forEach(({path, svg}) => {
    /*using id to choose svg and plot */
    const this_svg = d3.select(`#${svg}`).attr('width', width).attr('height', height);
    plot(path, this_svg);
});

/*detector */
setTimeout(() => {
    const circles = d3.selectAll("circle").on("mouseover", whenselect).on("mouseleave", endselect);
}, 50);

/*when select points */
const whenselect = function(){
    d3.selectAll(`circle[id="${d3.select(this).attr('id')}"]`)
      .transition().duration(200).attr("r", 8).attr("stroke", "black").attr("stroke-width", "3px");
}

/*end select points */
const endselect = function(){
    d3.selectAll(`circle[id="${d3.select(this).attr('id')}"]`)
      .transition().duration(200).attr("r", 4).attr("stroke-width", "0px");
}
/*read data and then plot points and axises*/
function plot(path, svg) {
    d3.csv(path).then(function(data){
        /*load data */
        const x = data.map((d) => parseFloat(d.X)), y = data.map(d => parseFloat(d.Y)), labels = data.map(d => parseInt(d.label));
        label_arr = new Set(labels);
        label_arr = Array.from(label_arr);
        label_arr = label_arr.sort((a, b) => a - b)
        //console.log(label_arr);
        /*set and add xaxis */
        const xScale = d3.scaleLinear().domain([d3.min(x) - 1, d3.max(x) + 1]).range([padding.left, width - padding.right]);
        svg.append("g").attr("class", "xaxis")
            .attr("transform", `translate(0, `+ (height - padding.bottom)+ `)`).call(d3.axisBottom(xScale));
        
        /*set and add yaxis */ 
        const yScale = d3.scaleLinear().domain([d3.min(y) - 1, d3.max(y) + 1]).range([height - padding.bottom, padding.top]);
        svg.append("g").attr("class", "yaxis")
            .attr("transform", `translate( `+ (padding.left + `, 0)`)).call(d3.axisLeft(yScale));
        /*set color scale */
        const colorScale = d3.scaleOrdinal().domain(label_arr).range(d3.schemeCategory10);
        
        /*need to add id for circles so that for next step we can easily choose them */
        svg.append("g").selectAll("circle").data(data).enter().append("circle")
            .attr('transform', (d) =>`translate(` + (xScale(parseFloat(d.X))) + `,` + (yScale(parseFloat(d.Y))) + `)`).attr("r", 4)
            .attr("fill", d => colorScale(d.label)).attr("id", (d, i)=> i);
        const title = svg.append('text').attr("x", width/3).attr("y", padding.top - 10 )
          .attr("font-size", 25).text(`${svg.attr("id")} method results`);
        /*Xtitle*/
        const xtitle = svg.append('text').attr("x", width / 2).attr("y", height)
          .attr("font-size", 25).text("Feature 1")
        /*Ytitle*/
        const ytitle = svg.append('text')
            .attr("x", -300)
            .attr("y", 50)
            .attr("font-size", 25)
            .attr("transform", "rotate(-90)")
            .attr("text-anchor", "middle")
            .text("Feature 2");
            });
}

