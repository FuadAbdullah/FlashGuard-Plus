
function listenStorageChange (object, area) {
    console.log("Change in storage area: " + area);

    let changedItems = Object.keys(object);
  
    for (let item of changedItems) {
      console.log(item + ' has changed:');
      console.log(`Old value: ${object[item].oldValue}`);
      console.log(`New value: ${object[item].newValue}`);
    }
}

chrome.storage.onChanged.addListener(listenStorageChange)