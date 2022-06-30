// Belly Button Biodiversity - Plotly.js

// Build function with inital dashboard
function initDashboard(){
    var dropdown = d3.select("#selDataset")
    d3.json("samples.json").then(data => {
        var participantID = data.names;
        participantID.forEach(participantIDs => {
            dropdown.append("option").text(participantIDs).property("value", participantIDs)
            });
            buildChart(participantID[0]);
            populateDemoInfo(participantID[0]);
    });
};

// Build function to populate demographic info
function populateDemoInfo(participantID) {
    var DemoInfoBox = d3.select("#sample-metadata");

    d3.json("samples.json").then(data => {
        var metadata = data.metadata
        var FilteredMetaData = metadata.filter(bacteriaInfo = bacteriaInfo.id == participantID)[0]

        console.log(FilteredMetaData);
        Object.entries(FilteredMetaData).forEach(([key, value]) => {
            DemoInfoBox.append("p").text('${key}: ${value}')
        });
    });
};

// Build function for option changed
function optionChanged(participantID) {
    console.log(participantID);
    buildChart(participantID);
    populateDemoInfo(participantID);
};

// Build function to build charts
function buildChart(participantID) {

    d3.json("samples.json").then((data => {

        var samples = data.samples
        var metadata = data.metadata
        var FilteredMetaData = metadata.filter(bacteriaInfo => bacteriaInfo.id == participantID)[0]

        var filteredSample = samples.filter(bacteriaInfo => bacteriaInfo.id == participantID)[0]

        var sample_values = filteredSample.sample_values

        var otu_ids = filteredSample.otu_ids

        var otu_labels = filteredSample.otu_labels

        // Bar chart

        var bar_data = [{

            x: sample_values.slice(0, 10).reverse(),

            y: otu_ids.slice(0, 10).map(otu_ids => 'OTU ${otu_id}').reverse(),

            text: otu_labels.slice(0, 10).reverse(),
            type: 'bar',
            orientation: 'h',
            marker: {
                color: 'rgb(242, 113, 102)'
            },
        }];

        // Define bar plot layout
        var bar_layout = {
            title: "Top 10 Microbial Species in Participant Belly Button",
            xaxis: {title: "Bacteria Sample Values"},
            yaxis: {title: "OTU IDs"}
        };

        // Display plot
        Plotly.newPlot('bar', bar_data, bar_layout)

        // Bubble chart

        var bubble_data = [{

            x: otu_ids,

            y: sample_values,

            text: otu_labels,
            mode: 'markers',
            markers: {

                color: otu_ids,

                size: sample_values,
                colorscale: 'Y10rRd'
            }
        }];

        // Define plot layout
        var layout = {
            title: "Belly Buttun Samples",
            xaxis: {title: "OTU IDs"},
            yaxis: {title: "Sample Values"}
        };

        // Display plot
        Plotly.newPlot('bubble', bubble_data, layout)

        // Gauge chart

        var washFrequency = FilteredMetaData.wfreq


        var gauge_data = [
            {
                domain: {x: [0, 1], y: [0, 1]},
                value: washFrequency,
                title: {text: "Washing Frequency (times per week)"},
                type: "indicator",
                mode: "gauge+number",
                gauge: {
                    bar: {color: 'white'},
                    axis: {range: [null, 9] },
                    steps: [
                        { range: [0, 3], color: 'rgb(253, 162, 73)' },
                        { range: [3, 6], color: 'rgb(242, 113, 102)' },
                        { range: [6, 9], color: 'rgb(166, 77, 104)' },
                    ],



                }

            }
        ];

        // Define plot layout
        var gauge_layout = { width: 500, height: 400, margin: {t: 0, b: 0 }};

        // Display plot
        Plotly.newPlot('gauge', gauge_data, gauge_layout)
    }));
};


initDashboard();
