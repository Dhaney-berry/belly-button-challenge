// Load the data from the provided URL
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// Fetch the JSON data and initialize the dashboard
function init() {
    d3.json(url).then((data) => {
        let sampleNames = data.names;
        
        // Populate the dropdown menu
        let dropdown = d3.select("#selDataset");
        sampleNames.forEach((id) => {
            dropdown.append("option").text(id).property("value", id);
        });

        // Initialize plots with the first sample
        let firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
    });
}

// Function to update metadata panel
function buildMetadata(sample) {
    d3.json(url).then((data) => {
        let metadata = data.metadata;
        let result = metadata.find(obj => obj.id == sample);
        let panel = d3.select("#sample-metadata");
        panel.html(""); // Clear existing metadata
        
        Object.entries(result).forEach(([key, value]) => {
            panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });
    });
}

// Function to build the bar and bubble charts
function buildCharts(sample) {
    d3.json(url).then((data) => {
        let samples = data.samples;
        let result = samples.find(obj => obj.id == sample);
        
        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values;
        
        // Bar Chart (Top 10 OTUs)
        let barData = [{
            x: sample_values.slice(0, 10).reverse(),
            y: otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
            text: otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h"
        }];
        let barLayout = {
            title: "Top 10 OTUs",
            margin: { t: 30, l: 150 }
        };
        Plotly.newPlot("bar", barData, barLayout);

        // Bubble Chart
        let bubbleData = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        }];
        let bubbleLayout = {
            title: "OTU Distribution",
            xaxis: { title: "OTU ID" },
            hovermode: "closest"
        };
        Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    });
}

// Function to handle dropdown change
function optionChanged(newSample) {
    buildCharts(newSample);
    buildMetadata(newSample);
}

// Initialize dashboard
init();
