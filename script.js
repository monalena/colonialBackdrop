Vue.component('info-button', {
    template: `<div>
                    <button class="button float-right secondary tiny" type="button" data-toggle="dropdown2">Info</button>
                    <div class="dropdown-pane bottom" id="dropdown2" dropdown>{{information}}</div>
                </div>`,
    data: function() {
        return {
            information: 'The data is sourced from Charles Bateson, The convict ships, 1787-1868 and George Rudé, Protest & Punishment. ' +
                'The Story of Social and Political Protesters transported to Australia, 1788-1868. The application is built with ' +
                'Vue.js, foundation.js and D3.js v3.'
        }
    },
    // mounted: function() {
    //     this.dropdown1 = new Foundation.Dropdown($('#dropdown1'), {
    //         // These options can be declarative using the data attributes
    //         vOffset: 20,
    //     });
    //     this.dropdown2 = new Foundation.Dropdown($('#dropdown2'), {
    //         hover: true,
    //     });
    // },
    // destroyed: function() {
    //     this.dropdown1.destroy();
    //     this.dropdown2.destroy();
    // }
})

Vue.component('backdrop-visualisation', {
    template: `<div class="grid-x grid-padding-x">
        <div class="cell medium-3">
            <h6>Selection</h6>
            <div class="button-group stacked hollow" id="selection">
                <a class="button secondary active" id="gender" @click="loadGender()">Gender</a>
                <a class="button secondary" id="arrival" @click="loadArrivals()">Arrival Ports</a>
                <a class="button secondary" id="origin" @click="loadOrigins()">Departure Ports</a>
                <a class="button secondary" id="protester" @click="loadProtesters()">Political Convicts</a>
            </div>
            <h6>Representation</h6>
            <div class="button-group hollow" >
                <a class="button secondary active" id="absolute" @click="loadAbsolute()">Absolute</a>
                <a class="button secondary" id="cummulative" @click="loadCummulative()">Cummulative</a>
            </div>
            <div>
                <fieldset class="detail" id="genderFields">
                    <p><h6>Detail</h6></p>
                    <div>
                        <input id="male" type="checkbox" checked="true" @click="tickedBoxesTrigger()">
                        <label for="male">Male</label>
                    </div>
                    <div>
                        <input id="female" type="checkbox" checked="true" @click="tickedBoxesTrigger()">
                        <label for="female">Female</label>
                    </div>
                </fieldset>
                <fieldset class="detail hide" id="arrivalFields">
                    <h6>Detail</h6>
                    <div>
                        <input id="sydney" type="checkbox" checked="true" @click="tickedBoxesTrigger()">
                        <label for="sydney">Sydney</label>
                    </div>
                    <div>
                        <input id="hobart" type="checkbox" checked="true" @click="tickedBoxesTrigger()">
                        <label for="hobart">Hobart</label>
                    </div>
                    <div>
                        <input id="norfolk" type="checkbox" checked="true" @click="tickedBoxesTrigger()">
                        <label for="norfolk">Norfolk Island</label>
                    </div>
                    <div>
                        <input id="port" type="checkbox" checked="true" @click="tickedBoxesTrigger()">
                        <label for="port">Port Phillip</label>
                    </div>
                    <div>
                        <input id="moreton" type="checkbox" checked="true" @click="tickedBoxesTrigger()">
                        <label for="moreton">Moreton Bay</label>
                    </div>
                    <div>
                        <input id="swan" type="checkbox" checked="true" @click="tickedBoxesTrigger()">
                        <label for="swan">Swan River</label>
                    </div>
                </fieldset>
                <fieldset class="detail hide" id="departureFields">
                    <p><h6>Detail</h6></p>
                    <div>
                        <input id="england" type="checkbox" checked="true" @click="tickedBoxesTrigger()">
                        <label for="england">England</label>
                    </div>
                    <div>
                        <input id="ireland" type="checkbox" checked="true" @click="tickedBoxesTrigger()">
                        <label for="ireland">Ireland</label>
                    </div>
                    <div>
                        <input id="overseas" type="checkbox" checked="true" @click="tickedBoxesTrigger()">
                        <label for="overseas">Overseas Territories</label>
                    </div>
                </fieldset>
            </div>
        </div>
        <div class="cell medium-9" >
            <div id="bar_chart"></div>
        </div>
    </div>`,
    data: function () {
        return {
            // Global variables to make data accessible from different functions
            convictData: [],
            cummulative: false,
            selection: 0,
            checkedBoxes: [true, true],
            colorset: ["287271", "C64C2E"],
            // Global variables to make selections and populate the legend
            gender: ["Male", "Female"],
            cumGender: ["cumMale", "cumFemale"],
            arrivals: ["NSW", "VDL", "NOR", "PP", "MOR", "WA"],
            arrivalNames: ["Sydney", "Hobart", "Norfolk Island", "Port Phillip", "Moreton Bay", "Swan River"],
            cumArrivals: ["cumNSW", "cumVDL", "cumNOR", "cumPP", "cumMOR", "cumWA"],
            origins: ["England", "Ireland", "Overseas"],
            originNames: ["England", "Ireland", "Overseas Territory"],
            cumOrigins: ["cumEng", "cumIre", "cumOve"],
            protesters: ["Protesters", "Nonprotesters"],
            protesterNames: ["Protesters", "Non Protesters"],
            cumProtesters: ["cumProt", "cumNon"],
            // Global color
            // nice color picker under https://coolors.co/f94144-f3722c-f8961e-f9c74f-90be6d-43aa8b-577590
            //var colorSet10 = ["264653","287271","2a9d8f","8ab17d","e9c46a","efb366","f4a261","e76f51","c64c2e","a4290b"]
            genderColors: ["287271", "C64C2E"],
            arrivalColors: ["264653", "2a9d8f", "8cca9c", "e9c46a", "e76f51", "a4290b"],
            departureColors: ["8AB17D", "EFB366", "E76F51"],
            protesterColors: ["264653", "e9c46a"]

        }
    },
    methods: {
        // HELPER function to set all buttons in selection to plain background
        setButtonsPlain: function () {
            let buttons = document.querySelectorAll("#selection a");
            for (let i = 0; i < buttons.length; i++) {
                buttons[i].setAttribute("class", "button secondary");
            }
        },

        // HELPER function for clearing selection buttons
        clearUp: function () {
            let allSets = document.querySelectorAll("fieldset");
            for (let i = 0; i < allSets.length; i++) {
                allSets[i].setAttribute("class", "detail hide");
            }
        },

        // HELPER function create boolean checkbox array in the right length on initial graph load
        setCheckboxArrayLength: function (dataArray) {
            this.checkedBoxes = [];
            for (let i = 0; i < dataArray.length; i++) {
                this.checkedBoxes.push(true);
            }
        },

        // HELPER function to detect visible checkboxes and form their ticks into an array
        tickedBoxesTrigger: function () {
            let visible = document.querySelector(".detail:not(.hide)");
            let visibleBoxes = visible.querySelectorAll('input');
            //console.log(visibleBoxes);
            this.checkedBoxes = [];
            for (let i = 0; i < visibleBoxes.length; i++) {
                this.checkedBoxes.push(visibleBoxes[i].checked);
            }
            d3.select("svg").remove();
            this.chooseParameters(this.convictData);
        },

        // BUTTON functions connected to buttons triggering new bar charts
        loadAbsolute: function () {
            d3.select("svg").remove();
            this.cummulative = false;
            this.chooseParameters(this.convictData);
            document.querySelector("#absolute").setAttribute("class", "button secondary active");
            document.querySelector("#cummulative").setAttribute("class", "button secondary");
        },

        loadCummulative: function () {
            d3.select("svg").remove();
            this.cummulative = true;
            this.chooseParameters(this.convictData);
            document.querySelector("#cummulative").setAttribute("class", "button secondary active");
            document.querySelector("#absolute").setAttribute("class", "button secondary");
        },

        loadGender: function () {
            d3.select("svg").remove(); //remove the old svg
            this.selection = 0; // 0 for gender, 1 for arrival, 2 for departure, 3 for protester selection
            this.colorset = this.genderColors; // pick the right color set for this selection
            this.setButtonsPlain(); //set the background color of all button group to plain, then make this one active
            document.querySelector("#gender").setAttribute("class", "button secondary active");
            this.clearUp(); // hide all optional checkboxes, then show this one
            document.querySelector('#genderFields').setAttribute("class", "detail");
            this.setCheckboxArrayLength(this.colorset); // set the right number of true Boolean values in the checkbox array
            this.chooseParameters(this.convictData); // choose the correct data columns
        },

        loadArrivals: function () {
            d3.select("svg").remove();
            this.selection = 1;
            //Vue.set(app.data, 'colorset', this.arrivalColors);
            this.colorset = this.arrivalColors;
            this.setButtonsPlain();
            document.querySelector("#arrival").setAttribute("class", "button secondary active");
            this.clearUp();
            document.querySelector('#arrivalFields').setAttribute("class", "detail");
            this.setCheckboxArrayLength(this.colorset);
            this.chooseParameters(this.convictData);
        },

        loadOrigins: function () {
            d3.select("svg").remove();
            this.selection = 2;
            this.colorset = this.departureColors;
            this.setButtonsPlain();
            document.querySelector("#origin").setAttribute("class", "button secondary active");
            this.clearUp();
            document.querySelector('#departureFields').setAttribute("class", "detail");
            this.setCheckboxArrayLength(this.colorset);
            this.chooseParameters(this.convictData);
        },

        loadProtesters: function () {
            d3.select("svg").remove();
            this.selection = 3;
            this.colorset = this.protesterColors;
            this.setButtonsPlain();
            document.querySelector("#protester").setAttribute("class", "button secondary active");
            this.clearUp();
            this.setCheckboxArrayLength(this.colorset);
            this.chooseParameters(this.convictData);
        },

        // MAIN function to stack the dataset based on the right parameters
        chooseParameters: function (data) {
            let colvars = [];
            let legendVars = [];
            let colors = this.colorset;
            var parse = d3.time.format("%Y").parse;

            if (this.cummulative === false) {
                switch (this.selection) {
                    case 0:
                        colvars = this.gender;
                        legendVars = this.gender;
                        break;
                    case 1:
                        colvars = this.arrivals;
                        legendVars = this.arrivalNames;
                        break;
                    case 2:
                        colvars = this.origins;
                        legendVars = this.originNames;
                        break;
                    case 3:
                        colvars = this.protesters;
                        legendVars = this.protesterNames;
                }
            } else {
                switch (this.selection) {
                    case 0:
                        colvars = this.cumGender;
                        legendVars = this.gender;
                        break;
                    case 1:
                        colvars = this.cumArrivals;
                        legendVars = this.arrivalNames;
                        break;
                    case 2:
                        colvars = this.cumOrigins;
                        legendVars = this.originNames;
                        break;
                    case 3:
                        colvars = this.cumProtesters;
                        legendVars = this.protesterNames;
                }

            }

            const indices = this.checkedBoxes.reduce(
                (out, bool, index) => bool ? out.concat(index) : out, []
            );

            let selectedColvars = indices.map(i => colvars[i]);
            let selectedLegendVars = indices.map(i => legendVars[i]);
            let selectedColors = indices.map(i => colors[i]);

            // Transpose the data into layers
            dataset = d3.layout.stack()(selectedColvars.map(function (selectedLegendVars) {
                return this.convictData.map(function (d) {
                    return {x: parse(d.Year), y: +d[selectedLegendVars]};
                });
            }));
            console.log(dataset);

            this.createBarchart(dataset, selectedLegendVars, selectedColors);
        },

        // DRAW function to create the bar chart
        createBarchart: function (data, legendvars, selectedColors) {
            let dataset = data;
            // set the dimensions and margins of the graph
            let margin = {top: 10, right: 160, bottom: 40, left: 40},
                width = 960 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom;

            // append the svg object to the body of the page
            let svg = d3.select("#bar_chart")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");


            // Set x, y and colors
            let x = d3.scale.ordinal()
                .domain(dataset[0].map(function (d) {
                    return d.x;
                }))
                .rangeRoundBands([10, width - 10], 0.02);

            let y = d3.scale.linear()
                .domain([0, d3.max(dataset, function (d) {
                    return d3.max(d, function (d) {
                        return d.y0 + d.y;
                    });
                })])
                .range([height, 0]);

            //var colors = ["b33040", "#d25c4d", "#f2b447", "#d9d574"];
            let colors = selectedColors.slice(0, dataset.length);

            // Define and draw axes
            let yAxis = d3.svg.axis()
                .scale(y)
                .orient("left")
                .ticks(10)
                .tickSize(-width, 0, 0)
                .tickFormat(function (d) {
                    return d
                });

            let xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom")
                .tickFormat(function (d) {
                    return d.getFullYear() % 4 === 0 ? d3.time.format("%Y")(d) : ""
                });

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
            let groups = svg.selectAll("g.cost")
                .data(dataset)
                .enter().append("g")
                .attr("class", "cost")
                .style("fill", function (d, i) {
                    return colors[i];
                });

            let rect = groups.selectAll("rect")
                .data(function (d) {
                    return d;
                })
                .enter()
                .append("rect")
                .attr("x", function (d) {
                    return x(d.x);
                })
                .attr("y", function (d) {
                    return y(d.y0 + d.y);
                })
                .attr("height", function (d) {
                    return y(d.y0) - y(d.y0 + d.y);
                })
                .attr("width", x.rangeBand())
                .on("mouseover", function () {
                    tooltip.style("display", null);
                })
                .on("mouseout", function () {
                    tooltip.style("display", "none");
                })
                .on("mousemove", function (d) {
                    var xPosition = d3.mouse(this)[0] - 15;
                    var yPosition = d3.mouse(this)[1] - 25;
                    tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
                    tooltip.select("text").text(d.y);
                });


            // Draw legend
            let legend = svg.selectAll(".legend")
                .data(colors)
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function (d, i) {
                    return "translate(30," + i * 19 + ")";
                });

            legend.append("rect")
                .attr("x", width - 18)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", function (d, i) {
                    return colors.slice()[i];
                });

            legend.append("text")
                .attr("x", width + 5)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "start")
                .text(function (d, i) {
                    return legendvars[i];
                    // switch (i) {
                    //     case 0: return "Female";
                    //     case 1: return "Male";
                    // }
                });


            // Prep the tooltip bits, initial display is hidden
            let tooltip = svg.append("g")
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


    },
    mounted: function () {

        var dataLoaded = data => {
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


            this.chooseParameters(convictData);

        };

        // LOAD function to get data and add cummulative counts
        d3.csv("data/wideData.csv", dataLoaded);
    }
})

var app = new Vue({
    el: '#app'
});




