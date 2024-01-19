
const dbName = "eventLogs";
const dbVersion = 1;

/**
 * Events are logged in "events" as:
 *   key: auto-incremented,
 *   value: {
 *     type: [widget event type, e.g. "widgetresume"],
 *     time: [time event was fired],
 *   }
 */
const eventsOSName = "events";
/**
 * Event count is logged in "eventCount" as:
 *   key: [widget event type, e.g. "widgetresume"],
 *   value: {
 *     count: [total count of that event type],
 *     countAtLastAppLaunch:
 *         [this is reset to |count| whenever an in-scope Window is opened],
 *   }
 */
const eventCountOSName = "eventCount";

const logWidgetEvent = async (eventName, time) => {
  const request = indexedDB.open(dbName, dbVersion);

  request.onerror = (event) => {
    console.log(`Failed to open db with: ${event.errorCode}`)
  };

  request.onsuccess = (event) => {
    const db = event.target.result;
    const transaction = db.transaction([ eventsOSName, eventCountOSName ],
                                       "readwrite",
                                       { durability: "strict"});

    transaction.oncomplete = (event) => {
      console.log("widget event logged to IndexedDB");
    }

    transaction.onerror = (event) => {
      console.log(event.errorCode);
    }

    // Log the event and the time it was fired.
    const widgetEventInfo = {
      type: eventName,
      time: time,
    };
    const eventsOS = transaction.objectStore(eventsOSName);
    eventsOS.add(widgetEventInfo);

    // Increment the total count of events of this type fired.
    const eventCountOS = transaction.objectStore(eventCountOSName);
    const getRequest = eventCountOS.get(eventName);
    getRequest.onsuccess =  (event) => {
      let oldEventCountInfo = getRequest.result;
      if (!oldEventCountInfo) {
        eventCountOS.add({
          type: eventName,
          count: 1,
          countAtLastAppLaunch: 0,
        });
      } else {
        const newEventCountInfo = {
          ...oldEventCountInfo,
          count: ++oldEventCountInfo.count,
        };
        eventCountOS.put(newEventCountInfo);
      }
    }
    getRequest.onerror = (event) => {
      console.log(`Error when getting ${eventName} from "${eventCountOSName}": ${getRequest.errorCode}`);
    }
  };

  request.onupgradeneeded = (event) => {
    const db = event.target.result;

    const eventsOS =
        db.createObjectStore(eventsOSName, { autoIncrement: true });
    eventsOS.createIndex("type", "type", { unique: false });
    eventsOS.createIndex("time", "time", { unique: false });

    const eventCountOS =
        db.createObjectStore(eventCountOSName, { keyPath: "type" });
    eventCountOS.createIndex("count", "count", { unique: false });
    eventCountOS.createIndex("countAtLastAppLaunch",
                             "countAtLastAppLaunch",
                             { unique: false });
  }
}
