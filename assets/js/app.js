// @TODO: YOUR CODE HERE!

// set up SVG size
const svgWidth = 960;
const svgHeight = 500

const margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom; 

//append svg wrapper to html in <div id="scatter">
const svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// append group element to svg to hold chart
const chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import data. Use autoType to cast numbers.
d3.csv("../demographics_health_risks/assets/data/data.csv", d3.autoType).then(data => {
    console.log(data);

    // compare healthcare and obesity through scatter plot

    // create scale functions
    const xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.healthcare), d3.max(data, d => d.healthcare)])
        .range([0, width]);
    
    const yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.obesity), d3.max(data, d => d.obesity)])
        .range([height, 0]);

    // create axis functions
    const bottomAxis = d3.axisBottom(xLinearScale);
    const leftAxis = d3.axisLeft(yLinearScale);

    // append axes to the chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    chartGroup.append("g")
        .call(leftAxis);

}).catch(e => console.log(e));