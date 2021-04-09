
const getData = (jsonData, target, dataLen) => {
    let data = [];
    for (let i = 0; i < dataLen; i++) {
        data.push(jsonData[i][target])
    }
    return data
}
const data = fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
    .then(response => response.json())
    .then(data => {
        const dataset = data.data;
        const dataLen = data.data.length;
        const values = getData(dataset, 1, dataLen)
        const dates = getData(dataset, 0, dataLen)
        makeGraph(dataset, values, dates, dataLen)
    })

const makeGraph = (dataset, values, dates, dataLen) => {

    // Initializing variables
    const width = 1000
    const height = 500
    const margin = {
        x: 60,
        y: 60
    }
    const maxValue = d3.max(values)
    const minDate = new Date(dates[0])
    const maxDate = new Date(dates[dataLen - 1])

    console.log(minDate.getFullYear())

    // Defining the svg node
    const svg = d3.select('#d3-container')
        .append('svg')
        .attr('height', height + margin.y)
        .attr('width', width + margin.x)

    // Defining the x and y scales
    const yScale = d3.scaleLinear()
        .domain([0, maxValue])
        .range([height - margin.y, margin.y])

    const xScale = d3.scaleTime()
        .domain([minDate, maxDate])
        .range([0, width - margin.x])

    console.log(yScale(maxValue))

    // Defining the axis
    const yAxis = d3.axisLeft(yScale)
    const xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.timeFormat("%Y"))
    
    // defining the tooltip
    const tooltip = d3.select('#d3-container').append("div")
        .attr("class", "tooltip")
        .attr("id", "tooltip")
        .style("opacity", 0)

    // Adding the rectangles
    svg.selectAll('rect')
        .data(dataset)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('data-date', (d, i) => d[0][i])
        .attr('y', (d, i) => yScale(d[1]))
        .attr('x', (d, i) => + margin.x + i * ((width - margin.x) / dataLen))
        .attr("height", (d) => yScale(0) - yScale(d[1]))
        .attr('width', width / dataLen)
        .attr('fill', '#4dff7c')
        .on("mouseover", (e, i) => {
            
            tooltip.transition()
                    .duration(300)
                    .style("opacity", 0.90)
            tooltip.html("<p class='date'><span class='bigger-text'>Date</span>:" + i[0].substr(0, 4) + " Q" + Math.floor((i[0].substr(5, 2))/3 + 1) + "</p><p class='gdp'><span class='bigger-text'>GDP</span>:$" + i[1] + " b</p>")
                    .style("left", (e.pageX + 10) + "px")
                    .style("top", (e.pageY - 100) + "px")
                    .attr('data-date', data.data[i][0])

          })
          .on("mouseout", function() {
            tooltip.transition()
                   .duration(300)
                   .style("opacity", 0);
          })

    // Adding the axes
    svg.append('g')
        .attr('id', 'y-axis')
        .call(yAxis)
        .attr("transform", "translate(" + margin.x + "," + "0)")

    svg.append('g')
        .attr('id', 'x-axis')
        .call(xAxis)
        .attr("transform", "translate("  + margin.x + ',' + (height - margin.y) + ")")

    console.log(xScale(dates[0]), yScale(250), xScale(1980))
}



