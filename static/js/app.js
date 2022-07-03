// Belly Button Biodiversity - Plotly.js

// Build function to build charts
function buildCharts(patientID) {

    // Read in json data
    d3.json("samples.json").then((data => {

        // Define samples
        var samples = data.samples
        var metadata = data.metadata
        var filteredMetadata = metadata.filter(bacteriaInfo => bacteriaInfo.id == patientID)[0]

        // Filter by patient ID
        var filteredSample = samples.filter(bacteriaInfo => bacteriaInfo.id == patientID)[0]

        // Create variables for chart
        // Grab sample_values for the bar chart
        var sample_values = filteredSample.sample_values

        // Use otu_ids as the labels for bar chart
        var otu_ids = filteredSample.otu_ids

        // use otu_labels as the hovertext for bar chart
        var otu_labels = filteredSample.otu_labels

        // BAR CHART
        // Create the trace
        var bar_data = [{
            // Use otu_ids for the x values
            x: sample_values.slice(0, 10).reverse(),
            // Use sample_values for the y values
            y: otu_ids.slice(0, 10).map(otu_id => `OTU ${otu_id}`).reverse(),
            // Use otu_labels for the text values
            text: otu_labels.slice(0, 10).reverse(),
            type: 'bar',
            orientation: 'h',
            marker: {
                color: 'rgb(7, 92, 20)'
            },
        }]

        // Define plot layout
        var bar_layout = {
            title: "Top 10 Microbial Species in Belly Buttons",
            xaxis: { title: "Bacteria Sample Values" },
            yaxis: { title: "OTU IDs" }
        };

        // Display plot
        Plotly.newPlot('bar', bar_data, bar_layout)


        // Bubble chart
        // Create the trace
        var bubble_data = [{
            // Use otu_ids for the x values
            x: otu_ids,
            // Use sample_values for the y values
            y: sample_values,
            // Use otu_labels for the text values
            text: otu_labels,
            mode: 'markers',
            marker: {
                // Use otu_ids for the marker colors
                color: otu_ids,
                // Use sample_values for the marker size
                size: sample_values,
                colorscale: 'Greens'
            }
        }];

            // Define plot layout
        var layout = {
            title: "Belly Button Samples",
            xaxis: { title: "OTU IDs" },
            yaxis: { title: "Sample Values" }
         };
    
        // Display plot
         Plotly.newPlot('bubble', bubble_data, layout)


        // Gauge chart
        // Create variable for washing frequency
        var washFreq = filteredMetadata.wfreq


       // Create the trace
       var gauge_data = [
        {
            domain: { x: [0, 1], y: [0, 1] },
            value: washFreq,
            title: { text: "Washing Frequency (Times per Week)" },
            type: "indicator",
            mode: "gauge+number",
                gauge: {
                    bar: {color: 'lightblue'},
                    axis: {range: [null, 9] },
                    steps: [
                        { range: [0, 1], color: 'rgb(240, 247, 233)' },
                        { range: [1, 2], color: 'rgb(215, 245, 216)' },
                        { range: [2, 3], color: 'rgb(198, 245, 199)' },
                        { range: [3, 4], color: 'rgb(198, 245, 220)' },
                        { range: [4, 5], color: 'rgb(173, 247, 208)' },
                        { range: [5, 6], color: 'rgb(146, 247, 193)' },
                        { range: [6, 7], color: 'rgb(62, 171, 113)' },
                        { range: [7, 8], color: 'rgb(38, 171, 100)' },
                        { range: [8, 9], color: 'rgb(5, 168, 81)' },
                    ],
                }
            }
        ];

        // Define Plot layout
        var gauge_layout = { width: 500, height: 400, margin: { t: 0, b: 0 } };

        // Display plot
        Plotly.newPlot('gauge', gauge_data, gauge_layout);
    }))


};


// Build function to populate demographic info
function populateDemoInfo(patientID) {

    var demographicInfoBox = d3.select("#sample-metadata");

    d3.json("samples.json").then(data => {
        var metadata = data.metadata
        var filteredMetadata = metadata.filter(bacteriaInfo => bacteriaInfo.id == patientID)[0]

        console.log(filteredMetadata)
        Object.entries(filteredMetadata).forEach(([key, value]) => {
            demographicInfoBox.append("p").text(`${key}: ${value}`)
        })


    })
}

// Build function for option changed
function optionChanged(patientID) {
    console.log(patientID);
    buildCharts(patientID);
    populateDemoInfo(patientID);
}

// Build function with inital dashboard
function initDashboard() {
    var dropdown = d3.select("#selDataset")
    d3.json("samples.json").then(data => {
        var patientIDs = data.names;
        patientIDs.forEach(patientID => {
            dropdown.append("option").text(patientID).property("value", patientID)
        })
        buildCharts(patientIDs[0]);
        populateDemoInfo(patientIDs[0]);
    });
};

initDashboard();
