// Use the D3 library to read in 'samples.json' and
// create dropdown list of Subject IDs
function dropDownMenu() {

  // use d3 to select the dropdown html element
  var dropdownId = d3.select("#selDataset");

  // fetch data from JSON samples['names'] and assign to variable
  d3.json("data/samples.json").then((importedData) => {
    var subjectIds = importedData.names;    

    // create dropdown menu
    subjectIds.forEach((individ) => {
      dropdownId.append("option").text(individ).property("value", individ);      
    });    


    // initialize the dashboard with the first sample
    demographicInfo(0);
    buildPlot(0);
    buildGaugeChart(0);

  });
}


// Create a function to build plots
function buildPlot(sampleIdx) {

  // use d3 to fetch the data for the plots
  d3.json("data/samples.json").then((importedData) => {    
    var arrayOfSamples = importedData.samples[sampleIdx];    

    // grab values from the response json object for plotting charts
    var otuIds = arrayOfSamples['otu_ids'];    
    var sampleValues = arrayOfSamples['sample_values'];
    var otuLabels = arrayOfSamples['otu_labels'];  
  

    //------------------------
    //  Horizontal Bar Chart
    //------------------------
    // Create a horizontal bar chart corresponding with a sample from dropdown menu
    // and display the top 10 OTUs found in that individual.
    
    // create the data array for the plot
    var hbarData = [{
      type: "bar",
      x: sampleValues.slice(0,10).reverse(),
      y: otuIds.slice(0,10).map(id => `OTU ${id}`).reverse(),
      text: otuLabels.slice(0,10).reverse(),
      orientation: "h"
    }];

    var hbarLayout ={
      title: "<b>Top 10 OTUs</b> <br> Sample "+`${arrayOfSamples.id}`
    }

    // Render the plot to the div tag with id "bar"
    Plotly.newPlot("bar", hbarData, hbarLayout);    

    
    //------------------------
    //  Bubble Chart
    //------------------------
    // Create a bubble chart that displays each sample.

    // create the data array for the plot
    var bubbleData = [{
      type: "scatter",
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: "markers",
      marker: {
        size: sampleValues,
        color: otuIds
      }
    }];

    // define the plot layout
    var bubbleLayout = {     
      title: "<b>Microbial Diversity found in Sample: </b> "+`${arrayOfSamples.id}`,
      xaxis: {title: "OTU ID"}      
    };

    // Plot the bubble chart to the div tag with id "bubble"
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

  });    
}

    //------------------------
    //  Gauge Chart
    //------------------------
    // Create a Gauge Chart for the weekly washing frequency of the individual.

function buildGaugeChart(sampleIdx) {

  // use d3 to fetch the data for the plot
  d3.json("data/samples.json").then((importedData) => {
    var wfreqData = importedData.metadata[sampleIdx];    

    // grab washing frequency values from the response json object for plotting chart
    var wfreqNumber = wfreqData['wfreq'];
    
    // create the data array for the plot
    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: wfreqNumber,
        title: { text: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week" },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [0,9], dtick: `tick0`, tickwidth: 2, tickcolor: "blue" },
          bar: { color: "rgba(31,119,180,1)"},
          steps: [
            { range: [0, 1], color: "#ffeece", line: {color: "white", width: 2}},
            { range: [1, 2], color: "#fee6b6", line: {color: "white", width: 2}},
            { range: [2, 3], color: "#fee89a", line: {color: "white", width: 2}},
            { range: [3, 4], color: "#fed585", line: {color: "white", width: 2}},
            { range: [4, 5], color: "#fdbf70", line: {color: "white", width: 2}},
            { range: [5, 6], color: "#fba55f", line: {color: "white", width: 2}},
            { range: [6, 7], color: "#f78851", line: {color: "white", width: 2}},
            { range: [7, 8], color: "#ef6d4a", line: {color: "white", width: 2}},
            { range: [8, 9], color: "#e35449", line: {color: "white", width: 2}}
          ]
        }
      }
    ];
    
    // define the plot layout
    var gaugeLayout = { width: 500, height: 400, margin: { t: 0, b: 0 } };

    // Plot the gauge chart to the div tag with id "gauge"
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);

  });  
}


// Display each key-value pair (individual's demographic information) from the metadata JSON object
// for the sample selected in the dropdown menu.

function demographicInfo(sampleIdx) {
  
  d3.json("data/samples.json").then((importedData) => {
    var demographics = importedData.metadata[sampleIdx];    

    // use d3 to select 'Demographic Info' panel by id
    var infoPanel = d3.select("#sample-metadata");

    // clear any previous input
    infoPanel.html("");

    // add each key-value pair to the panel
    Object.entries(demographics).forEach(([key, value]) => {
      infoPanel.append("p").text(`${key}: ${value}`);
    });

  });
}


// Update all of the plots any time that a new sample is selected.
function optionChanged(newSample) {  

  d3.json("data/samples.json").then((importedData) => {
    var subjectIds = importedData.names;
    var nextIdx = subjectIds.findIndex(subj => subj === newSample);
    
    // call functions for the new sample
    demographicInfo(nextIdx);
    buildPlot(nextIdx);
    buildGaugeChart(nextIdx);

  });
}

dropDownMenu();