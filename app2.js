// @TODO: YOUR CODE HERE!

// set up SVG size
const svgWidth = 960;
const svgHeight = 500

const margin = {
    top: 20,
    right: 75,
    bottom: 80,
    left: 50
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


//adjustments to make dynamic chart axes

// Initial Params
let chosenXAxis = "poverty";

//function used for updating x-scale
function xScale(censusData, chosenXAxis) {
    //create scales
    const xLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[chosenXAxis]-1), 
        d3.max(censusData, d => d[chosenXAxis]+1)])
        .range([0, width]);
    
    return xLinearScale;
}

// function for updating xAxis upon click on axis label
function renderAxes(newXScale, xAxis) {
    const bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}

//function to update circle group on axis change
function renderCircles(circlesGroup, newXScale, chosenXAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]));

    return circlesGroup;
}

// function used for updating circles group with tooltip on xaxis label
function updateToolTip(chosenXAxis, circlesGroup) {
    let label;

    if (chosenXAxis === "poverty") {
        label = "Poverty Rate (%):";
    }
    else {
        label = "Age:"
    }

    const toolTip = d3.tip()
        .attr("class", "d3-tip")
        // .offset([0,0])
        .html(d => `${d.state}<br>${label} ${d[chosenXAxis]}`);

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(censusData) {
        toolTip.show(censusData);
    })
        .on("mouseout", function(censusData) {
            toolTip.hide(censusData);
        });
    return circlesGroup;
}

// Import data. Use autoType to cast numbers.
d3.csv("data.csv", d3.autoType).then(censusData => {
    // console.log(data);

    // xLinearScale function above csv import
    let xLinearScale = xScale(censusData, chosenXAxis);
    
    const yLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d.obesity), d3.max(censusData, d => d.obesity)])
        .range([height, 0]);

    // create axis functions
    const bottomAxis = d3.axisBottom(xLinearScale.nice());
    const leftAxis = d3.axisLeft(yLinearScale.nice());

    // append axes to the chart
    let xAxis = chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis)
        .classed("x-axis", true);
    
    chartGroup.append("g")
        .call(leftAxis);

    // create circles
    let circlesGroup = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d.obesity))
        .attr("r", 10)
        .attr("class", "stateCircle");
    
    // create group for two x-axis labels
    const labelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width /2}, ${height +20})`);
    
    // append x-axis labels to group
    const povertRateLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("Poverty Rate (%)");
    const ageLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age") // value to grab for event listener
        .classed("inactive", true)
        .text("Age");
    
    //append y-axis
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - (margin.left / 2) - 10)
        .attr("x", 0 - (height / 2) -40)
        .attr("class", "axisText")
        .text("Obesity Rate (%)");

    
    // updateToolTip function above csv import
    circlesGroup = updateToolTip(chosenXAxis, circlesGroup)

    // x-axis labels event listener
    labelsGroup.selectAll("text")
        .on("click", function() {
            //get value of selection
            const value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {
                //replace chosen xAxis with value
                chosenXAxis = value;
                console.log(chosenXAxis)
            
                //updates x scale for new data with function defined above csv import
                xLinearScale = xScale(censusData, chosenXAxis);
                
                //update axis with transition
                xAxis = renderAxes(xLinearScale, xAxis);

                //update circles with new x values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

                // updates tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

                //changes classes to change bold text
                if (chosenXAxis === "age") {
                    ageLabel.classed("active", true).classed("inactive", false);
                    povertRateLabel.classed("active", false).classed("inactive", true);
                }
                else {
                    ageLabel.classed("active", false).classed("inactive", true);
                    povertRateLabel.classed("active", true).classed("inactive", false);
                }
            }
        })

        // add state abbreviations on the
        const abbrGroup = chartGroup.selectAll(null)
            .data(censusData)
            .enter()
            .append("text")
            .classed("stateText", true)
            .attr("x", d => xLinearScale(d.healthcare))
            .attr("y", d => yLinearScale(d.obesity)+3)
            .text(d => d.abbr)
            // .attr("font-family", "sans-serif")
            .attr("font-size", "10px")

}).catch(e => console.log(e));