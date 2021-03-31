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

  });
}


// 2-3. Create a function to build plots

  
  

    //------------------------
    //  Horizontal Bar Chart
    //------------------------
    // Create a horizontal bar chart corresponding with a sample from dropdown menu and display the top 10 OTUs found in that individual.

    

    
    //------------------------
    //  Bubble Chart
    //------------------------
    // Create a bubble chart that displays each sample.

    



// 4-5. Display each key-value pair (individual's demographic information) from the metadata JSON object for the sample in dropdown menu.




// 6. Update all of the plots any time that a new sample is selected.




dropDownMenu();