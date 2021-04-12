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

    

}).catch(e => console.log(e));