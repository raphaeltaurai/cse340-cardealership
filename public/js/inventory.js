'use strict' 

document.addEventListener('DOMContentLoaded', function() {
  // Get a list of items in inventory based on the classification_id 
  let classificationList = document.querySelector("#classificationList")
  let inventoryDisplay = document.getElementById("inventoryDisplay")

  if (classificationList) {
    classificationList.addEventListener("change", function () { 
     let classification_id = classificationList.value 
     console.log(`classification_id is: ${classification_id}`) 
     if (!classification_id) {
      inventoryDisplay.innerHTML = ''
      return
     }
     let classIdURL = "/inv/getInventory/"+classification_id 
     fetch(classIdURL) 
     .then(function (response) { 
      if (response.ok) { 
       return response.json(); 
      } 
      throw Error("Network response was not OK"); 
     }) 
     .then(function (data) { 
      console.log(data); 
      buildInventoryList(data); 
     }) 
     .catch(function (error) { 
      console.log('There was a problem: ', error.message) 
      inventoryDisplay.innerHTML = '<tr><td colspan="3">Error loading inventory.</td></tr>'
     }) 
    })
  }

  // Build inventory items into HTML table components and inject into DOM 
  function buildInventoryList(data) { 
    // Set up the table labels 
    let dataTable = '<thead>'; 
    dataTable += '<tr><th>Vehicle Name</th><th>Modify</th><th>Delete</th></tr>'; 
    dataTable += '</thead>'; 
    // Set up the table body 
    dataTable += '<tbody>'; 
    // Iterate over all vehicles in the array and put each in a row 
    if (data && data.length > 0) {
     data.forEach(function (element) { 
      console.log(element.inv_id + ", " + element.inv_model); 
      dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`; 
      dataTable += `<td><a href='/inv/edit/${element.inv_id}' title='Click to update'>Modify</a></td>`; 
      dataTable += `<td><a href='/inv/delete/${element.inv_id}' title='Click to delete'>Delete</a></td></tr>`; 
     })
    } else {
     dataTable += '<tr><td colspan="3">No vehicles found.</td></tr>'
    }
    dataTable += '</tbody>'; 
    // Display the contents in the Inventory Management view 
    inventoryDisplay.innerHTML = dataTable; 
  }
});