if (navigator.serviceWorker) {
  navigator.serviceWorker.register('./sw.js');
}

const updateTitle = (title) => {
	document.getElementById('title').textContent = title;
}


// Protocol handling:
const params = new URLSearchParams(window.location.search);
const testParam = params.get("test");
if (testParam) {
	updateTitle(testParam);
  console.log(`The query param is: ${testParam}`);
}


// File handling:
const updateTitleForFileHandling = async (file) => {
	const blob = await file.getFile();
	const title = await blob.text();
	updateTitle(title);
	console.log(title);
}

if ("launchQueue" in window) {
  window.launchQueue.setConsumer((launchParams) => {
    if (launchParams.files && launchParams.files.length) {
      updateTitleForFileHandling(launchParams.files[0])
    }
  });
}