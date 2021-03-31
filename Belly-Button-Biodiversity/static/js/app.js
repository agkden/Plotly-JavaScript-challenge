// 1. Use the D3 library to read in 'samples.json'.
d3.json("data/samples.json").then((importedData) => {
  console.log(importedData);
});

// Create dropdown list of Subject IDs
function dropDownMenu() {

  // use d3 to select the dropdown html element
  var dropdownId = d3.select("#selDataset");

  // fetch data from JSON samples['names'] and assign to variable
  d3.json("data/samples.json").then((importedData) => {
    var subjectIds = importedData.names;
    console.log(subjectIds);

    // create dropdown menu
    subjectIds.forEach((individ) => {
      dropdownId.append("option").text(individ).property("value", individ);      
    });    


    // initialize the dashboard with the first sample
    demographicInfo(0);
    buildPlot(0);

  });
}


// 2-3. Create a function to build plots
function buildPlot(sampleIdx) {

  // use d3 to fetch the data for the plots
  d3.json("data/samples.json").then((importedData) => {    
    arrayOfSamples = importedData.samples[sampleIdx];
    console.log(arrayOfSamples);

    // grab values from the response json object for plotting charts
    otuIds = arrayOfSamples['otu_ids'];    
    sampleValues = arrayOfSamples['sample_values'];
    otuLabels = arrayOfSamples['otu_labels'];  
  

    //------------------------
    //  Horizontal Bar Chart
    //------------------------
    // Create a horizontal bar chart corresponding with a sample from dropdown menu and display the top 10 OTUs found in that individual.

    // check the slicing of the first 10 objects for plotting    
    console.log(otuIds.slice(0,10));
    console.log(sampleValues.slice(0,10));
    console.log(otuLabels.slice(0,10));

    // create the data array for the plot
    var hbarData = [{
      type: "bar",
      x: sampleValues.slice(0,10).reverse(),
      y: otuIds.slice(0,10).map(id => `OTU ${id}`).reverse(),
      text: otuLabels.slice(0,10).reverse(),
      orientation: "h"
    }];

    // Render the plot to the div tag with id "bar"
    Plotly.newPlot("bar", hbarData);    

    
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
      xaxis: {title: "OTU ID"}
      //yaxis:
    };

    // Plot the bubble chart to the div tag with id "bubble"
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

  });    
}


// 4-5. Display each key-value pair (individual's demographic information) from the metadata JSON object for the sample selected in the dropdown menu.

function demographicInfo(sampleIdx) {
  
  d3.json("data/samples.json").then((importedData) => {
    var demographics = importedData.metadata[sampleIdx];
    console.log(demographics);

    // use d3 to select 'Demographic Info' panel by id
    infoPanel = d3.select("#sample-metadata");

    // clear any previous input
    infoPanel.html("");

    // add each key-value pair to the panel
    Object.entries(demographics).forEach(([key, value]) => {
      infoPanel.append("p").text(`${key}: ${value}`);
    });

  });

}


// 6. Update all of the plots any time that a new sample is selected.




dropDownMenu();