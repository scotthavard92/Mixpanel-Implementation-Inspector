//Look for network requests to the Mixpanel API endpoitns
function logURL(requestDetails) {
  if(requestDetails.url.includes("api-js.mixpanel.com/track")) {
    var dataParse = JSON.parse(requestDetails.requestBody.formData.data)
    for (let i = 0; i < dataParse.length; i++) {
      writeEvent(dataParse[i]["event"])
      document.getElementById("events").innerHTML += ("<br>" + "<b>Properties: </b>")
      writeEventProperties(dataParse[i]["properties"])
      document.getElementById("events").innerHTML += ("<br>")
    }
  }

  if(requestDetails.url.includes("api-js.mixpanel.com/engage")) {
    var dataParse = JSON.parse(requestDetails.requestBody.formData.data)
    for (let i = 0; i < dataParse.length; i++) {
      document.getElementById("profiles").innerHTML += ("<br>" + "<b>Properties: </b>")
      writeProfileProperties(dataParse[i]["$set"])
    }
  }
}

//Write out the event name in the sidebar
function writeEvent(event) {
  document.getElementById("events").innerHTML += ("<b>Event Name: </b>" + event)
}

//Write out the event properties in the sidebar
function writeEventProperties(properties) {
  for (const property in properties) {
      document.getElementById("events").innerHTML += (`${property}: ${properties[property]}` + ",<br>")
  }
}

//Write profile properties to the sidebar
function writeProfileProperties(userProperties) {
  for (const property in userProperties) {
      document.getElementById("profiles").innerHTML += (`${property}: ${userProperties[property]}` + ",<br>")
  }
}

//Clear sidebar on net new page
browser.tabs.onUpdated.addListener(function () {
  document.getElementById("events").innerHTML = ""
  document.getElementById("profiles").innerHTML = ""
});

//Run the network read and sidebar write
browser.webRequest.onBeforeRequest.addListener(
  logURL,
  {urls: ["<all_urls>"]},
  ["requestBody"]
);