
const dbName = "event_logs";
const objectStoreName = "events";

const logWidgetEvent = async (eventName, time) => {
  const widgetEventInfo = {
    type: eventName,
    time: time,
  };

  const request = indexedDB.open(dbName);

  request.onerror = (event) => {
    console.log(`Failed to open db with: ${event.errorCode}`)
  };

  request.onsuccess = (event) => {
    let db = event.target.result;
    const transaction =
        db.transaction(objectStoreName, "readwrite", { durability: "strict"});

    transaction.oncomplete = (event) => {
      console.log("widget event logged to IndexedDB");
    }

    transaction.onerror = (event) => {
      console.log(event.errorCode);
    }

    const objectStore = transaction.objectStore(objectStoreName);
    const request = objectStore.add(widgetEventInfo);
  };

  request.onupgradeneeded = (event) => {
    const db = event.target.result;
    const objectStore = db.createObjectStore("events", { autoIncrement: true });

    objectStore.createIndex("type", "type", { unique: false });
    objectStore.createIndex("time", "time", { unique: false });
  }
}
