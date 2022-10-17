const COUNTER_STORAGE = 'counter-db';
const COUNTER_KEY = 'counter';
const COUNTER_NAME = 'widget-clicks';
const COUNT_VALUE = 'count';
let db = null;

const openDatabase = async () => {
  if (db) {
    return Promise.resolve();
  }
  // Let us open our training sample database.
  const DBOpenRequest = indexedDB.open(COUNTER_STORAGE);

  return new Promise((resolve, reject) => {
    // Register two event handlers to act on the database being opened successfully, or not.
    DBOpenRequest.onerror = () => {
      reject(new Error('Error loading database.'));
    };

    DBOpenRequest.onupgradeneeded = () => {
      const db = DBOpenRequest.result;
      db.createObjectStore(COUNTER_STORAGE, { keyPath: COUNTER_KEY });
    };

    DBOpenRequest.onsuccess = () => {
      db = DBOpenRequest.result;
      resolve();
    };
  });
};

const getObjectStore = async () => {
  await openDatabase();
  // open a read/write db transaction
  const transaction = db.transaction([COUNTER_STORAGE], 'readwrite');

  // report on the error of opening the transaction
  transaction.onerror = (event) => {
    console.error('Transaction failed', event);
  }

  // create an object store on the transaction
  return transaction.objectStore(COUNTER_STORAGE);
};

const getCount = async () => {
  const objectStore = await getObjectStore();
  return new Promise((resolve, reject) => {
    const objectStoreRequest = objectStore.get(COUNTER_NAME);
    objectStoreRequest.onerror = (event) => {
      // report the error of the request
      console.error('Object Store Request failed', event);
      reject();
    };

    objectStoreRequest.onsuccess = () => {
      const { result } = objectStoreRequest;
      resolve(result ? result[COUNT_VALUE] : 0);
    };
  });
};

const incrementCount = async (count) => {
  const objectStore = await getObjectStore();
  return new Promise((resolve, reject) => {
    const objectStoreRequest = objectStore.put({ [COUNTER_KEY]: COUNTER_NAME, [COUNT_VALUE]: count + 1 });
    objectStoreRequest.onerror = (event) => {
      // report the error of the request
      console.error('Object Store Request failed', event);
      reject();
    };

    objectStoreRequest.onsuccess = () => {
      resolve();
    };
  });
};

const getAndIncrementCount = async () => {
  const count = await getCount();
  await incrementCount(count);
  return count;
};