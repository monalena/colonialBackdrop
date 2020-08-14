// Global variables to make data accessible from different functions
var convictData = [];
var cummulative = false;
var selection = 0;
var checkedBoxes = [true, true];

// Global variables to make selections and populate the legend
var gender = ["Male", "Female"];
var cumGender = ["cumMale", "cumFemale"];
var arrivals = ["NSW", "VDL", "NOR", "PP", "MOR", "WA"];
var arrivalNames = ["Sydney", "Hobart", "Norfolk Island", "Port Phillip", "Moreton Bay", "Swan River"];
var cumArrivals = ["cumNSW", "cumVDL", "cumNOR", "cumPP", "cumMOR", "cumWA"];
var origins = ["England", "Ireland", "Overseas"];
var originNames = ["England", "Ireland", "Overseas Territory"];
var cumOrigins = ["cumEng", "cumIre", "cumOve"];
var protesters = ["Protesters", "Nonprotesters"];
var protesterNames = ["Protesters", "Non Protesters"];
var cumProtesters = ["cumProt", "cumNon"];

// Global color
// nice color picker under https://coolors.co/f94144-f3722c-f8961e-f9c74f-90be6d-43aa8b-577590
//var colorSet10 = ["264653","287271","2a9d8f","8ab17d","e9c46a","efb366","f4a261","e76f51","c64c2e","a4290b"]
var colorset = ["287271", "C64C2E"];

var genderColors = ["287271", "C64C2E"];
var arrivalColors = ["264653","2a9d8f","8cca9c","e9c46a","e76f51","a4290b"];
var departureColors = ["8AB17D","EFB366","E76F51"];
var protesterColors = ["264653","e9c46a"];



// LOAD function to get data and add cummulative counts
function loadData() {
    d3.csv("data/wideData.csv", function (data) {
        // calculate cummulative gender count
        let tempFemale = 0, tempMale = 0;
        let tempNSW = 0, tempVDL = 0, tempNOR = 0, tempPP = 0, tempMOR = 0, tempWA = 0;
        let tempEng = 0, tempIre = 0, tempOve = 0;
        let tempProt = 0, tempNonprot = 0;

        for (var i = 0; i < data.length; i++) {
            //console.log(data[i].NOR);

            tempFemale += +data[i].Female;
            data[i].cumFemale = tempFemale;

            tempMale += +data[i].Male;
            data[i].cumMale = tempMale;

            tempNSW += +data[i].NSW;
            data[i].cumNSW = tempNSW;

            tempVDL += +data[i].VDL;
            data[i].cumVDL = tempVDL;

            tempNOR += +data[i].NOR;
            data[i].cumNOR = tempNOR;

            tempPP += +data[i].PP;
            data[i].cumPP = tempPP;

            tempMOR += +data[i].MOR;
            data[i].cumMOR = tempMOR;

            tempWA += +data[i].WA;
            data[i].cumWA = tempWA;

            tempEng += +data[i].England;
            data[i].cumEng = tempEng;

            tempIre += +data[i].Ireland;
            data[i].cumIre = tempIre;

            tempOve += +data[i].Overseas;
            data[i].cumOve = tempOve;

            tempProt += +data[i].Protesters;
            data[i].cumProt = tempProt;

            tempNonprot += +data[i].Nonprotesters;
            data[i].cumNon = tempNonprot;

            //console.log(data[i].cumProt);
        }

        convictData = data;

        chooseParameters(convictData);

    });
}

// HELPER function to set all buttons in selection to plain background
function setButtonsPlain() {
    let buttons = document.querySelectorAll("#selection a");
    for (let i = 0; i<buttons.length; i++) {
        buttons[i].setAttribute("class", "button secondary");
    }
}

// HELPER function for clearing selection buttons
function clearUp() {
    let allSets = document.querySelectorAll("fieldset");
    for (let i = 0; i < allSets.length; i++) {
        allSets[i].setAttribute("class", "detail hide");
    }
}

// HELPER function create boolean checkbox array in the right length on initial graph load
function setCheckboxArrayLength(dataArray) {
    checkedBoxes = [];
    for (let i = 0; i < dataArray.length; i++) {
        checkedBoxes.push(true);
    }
}

// HELPER function to detect visible checkboxes and form their ticks into an array
function tickedBoxesTrigger() {
    let visible = document.querySelector(".detail:not(.hide)");
    let visibleBoxes = visible.querySelectorAll('input');
    //console.log(visibleBoxes);
    checkedBoxes = [];
    for (let i = 0; i < visibleBoxes.length; i++) {
        checkedBoxes.push(visibleBoxes[i].checked);
    }
    d3.select("svg").remove();
    chooseParameters(convictData);
}

// BUTTON functions connected to buttons triggering new bar charts
function loadAbsolute() {
    d3.select("svg").remove();
    cummulative = false;
    chooseParameters(convictData);
    document.querySelector("#absolute").setAttribute("class", "button secondary active");
    document.querySelector("#cummulative").setAttribute("class", "button secondary");
}

function loadCummulative() {
    d3.select("svg").remove();
    cummulative = true;
    chooseParameters(convictData);
    document.querySelector("#cummulative").setAttribute("class", "button secondary active");
    document.querySelector("#absolute").setAttribute("class", "button secondary");
}

function loadGender() {
    d3.select("svg").remove(); //remove the old svg
    selection = 0; // 0 for gender, 1 for arrival, 2 for departure, 3 for protester selection
    colorset = genderColors; // pick the right color set for this selection
    setCheckboxArrayLength(gender); // set the right number of true Boolean values in the checkbox array
    chooseParameters(convictData); // choose the correct data columns
    setButtonsPlain(); //set the background color of all button group to plain, then make this one active
    document.querySelector("#gender").setAttribute("class", "button secondary active");
    clearUp(); // hide all optional checkboxes, then show this one
    document.querySelector('#genderFields').setAttribute("class", "detail");
}

function loadArrivals() {
    d3.select("svg").remove();
    selection = 1;
    colorset = arrivalColors;
    setCheckboxArrayLength(arrivals);
    chooseParameters(convictData);
    setButtonsPlain();
    document.querySelector("#arrival").setAttribute("class", "button secondary active");
    clearUp();
    document.querySelector('#arrivalFields').setAttribute("class", "detail");
}

function loadOrigins() {
    d3.select("svg").remove();
    selection = 2;
    colorset = departureColors;
    setCheckboxArrayLength(departureColors);
    chooseParameters(convictData);
    setButtonsPlain();
    document.querySelector("#origin").setAttribute("class", "button secondary active");
    clearUp();
    document.querySelector('#departureFields').setAttribute("class", "detail");
}

function loadProtesters() {
    d3.select("svg").remove();
    selection = 3;
    colorset = protesterColors;
    setCheckboxArrayLength(protesterColors);
    chooseParameters(convictData);
    setButtonsPlain();
    document.querySelector("#protester").setAttribute("class", "button secondary active");
    clearUp();
}
// MAIN function to stack the dataset based on the right parameters
function chooseParameters(data) {
    let colvars = [];
    let legendVars = [];
    let colors = colorset;
    var parse = d3.time.format("%Y").parse;

    if (cummulative === false) {
        switch (selection) {
                case 0:
                    colvars = gender;
                    legendVars = gender;
                    break;
                case 1:
                    colvars = arrivals;
                    legendVars = arrivalNames;
                    break;
                case 2:
                    colvars = origins;
                    legendVars = originNames;
                    break;
                case 3:
                    colvars = protesters;
                    legendVars = protesterNames;
            }
    } else {
        switch (selection) {
            case 0:
                colvars = cumGender;
                legendVars = gender;
                break;
            case 1:
                colvars = cumArrivals;
                legendVars = arrivalNames;
                break;
            case 2:
                colvars = cumOrigins;
                legendVars = originNames;
                break;
            case 3:
                colvars = cumProtesters;
                legendVars = protesterNames;
        }

    }

    const indices = checkedBoxes.reduce(
        (out, bool, index) => bool ? out.concat(index) : out, []
    )

    let selectedColvars = indices.map(i => colvars[i]);
    let selectedLegendVars = indices.map(i => legendVars[i]);
    let selectedColors = indices.map(i => colors[i]);

    // Transpose the data into layers
    dataset = d3.layout.stack()(selectedColvars.map(function (selectedLegendVars) {
        return data.map(function (d) {
            return {x: parse(d.Year), y: +d[selectedLegendVars]};
        });
    }));

    createBarchart(dataset, selectedLegendVars, selectedColors);
}

// DRAW function to create the bar chart
function createBarchart(data, legendvars, selectedColors) {
    var dataset = data;
// set the dimensions and margins of the graph
var margin = {top: 10, right: 160, bottom: 40, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#bar_chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");



// Set x, y and colors
var x = d3.scale.ordinal()
    .domain(dataset[0].map(function(d) { return d.x; }))
    .rangeRoundBands([10, width-10], 0.02);

var y = d3.scale.linear()
    .domain([0, d3.max(dataset, function(d) {  return d3.max(d, function(d) { return d.y0 + d.y; });  })])
    .range([height, 0]);

//var colors = ["b33040", "#d25c4d", "#f2b447", "#d9d574"];
var colors = selectedColors.slice(0, dataset.length);

// Define and draw axes
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10)
    .tickSize(-width, 0, 0)
    .tickFormat( function(d) { return d } );

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(function(d) { return d.getFullYear() % 4==0 ? d3.time.format("%Y")(d) : "" });

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .selectAll("text")
    .attr("y", 0)
    .attr("x", 9)
    .attr("dy", ".35em")
    .attr("transform", "rotate(90)")
    .style("text-anchor", "start");



// Create groups for each series, rects for each segment
var groups = svg.selectAll("g.cost")
    .data(dataset)
    .enter().append("g")
    .attr("class", "cost")
    .style("fill", function(d, i) { return colors[i]; });

var rect = groups.selectAll("rect")
    .data(function(d) { return d; })
    .enter()
    .append("rect")
    .attr("x", function(d) { return x(d.x); })
    .attr("y", function(d) { return y(d.y0 + d.y); })
    .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
    .attr("width", x.rangeBand())
    .on("mouseover", function() { tooltip.style("display", null); })
    .on("mouseout", function() { tooltip.style("display", "none"); })
    .on("mousemove", function(d) {
        var xPosition = d3.mouse(this)[0] - 15;
        var yPosition = d3.mouse(this)[1] - 25;
        tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
        tooltip.select("text").text(d.y);
    });


// Draw legend
var legend = svg.selectAll(".legend")
    .data(colors)
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(30," + i * 19 + ")"; });

legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", function(d, i) {return colors.slice()[i];});

legend.append("text")
    .attr("x", width + 5)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "start")
    .text(function(d, i) {
        return legendvars[i];
        // switch (i) {
        //     case 0: return "Female";
        //     case 1: return "Male";
        // }
    });


// Prep the tooltip bits, initial display is hidden
var tooltip = svg.append("g")
    .attr("class", "tooltip")
    .style("display", "none");

tooltip.append("rect")
    .attr("width", 30)
    .attr("height", 20)
    .attr("fill", "white")
    .style("opacity", 0.5);

tooltip.append("text")
    .attr("x", 15)
    .attr("dy", "1.2em")
    .style("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("font-weight", "bold");


}

