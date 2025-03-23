const data = [
  [5, 10],
  [5, 10],
  [5, 10],
  [5, 10],
  [5, 10],
  [5, 10],
  [5, 10],
  [5, 10],
  [7, 14],
  [7, 14],
  [7, 14],
  [7, 14],
  [7, 14],
  [7, 14],
  [10, 20],
  [10, 20],
  [10, 20],
  [10, 20],
  [10, 20],
  [10, 20],
  [13, 26],
  [13, 26],
  [13, 26],
  [13, 26],
  [13, 26],
];

const state = {
  dataRow: 0,
  breathingIn: true,
  timeMs: 0,
  totalTimeMs: 0,
  started: false,

  timeout: 1000,
};

function init() {
  // initialize table entries
  function secondsToMinutes(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    let formattedMinutes = String(minutes).padStart(2, "0");
    if (minutes < 10) {
      formattedMinutes = String(minutes);
    }
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
  }

  const table = document.getElementById("table");
  for (let i = 0; i < data.length; i++) {
    const [inVal, outVal] = data[i];
    const inElement = document.createElement("p");
    inElement.className = "p-7 Helvetica col";
    inElement.innerText = secondsToMinutes(inVal);

    const outElement = document.createElement("p");
    outElement.className = "p-7 Helvetica col";
    outElement.innerText = secondsToMinutes(outVal);

    const totalElement = document.createElement("p");
    totalElement.className = "p-7 Helvetica col";
    totalElement.innerText = secondsToMinutes(inVal + outVal);

    const row = document.createElement("div");
    row.className = "row";
    row.appendChild(inElement);
    row.appendChild(outElement);
    row.appendChild(totalElement);
    table.appendChild(row);
  }

  let inSum = 0;
  let outSum = 0;
  for (let i = 0; i < data.length; i++) {
    const [inVal, outVal] = data[i];
    inSum += inVal;
    outSum += outVal;
  }

  // initialize table sums
  const inTotalElement = document.createElement("p");
  inTotalElement.className = "p-7 Helvetica-Bold col";
  inTotalElement.innerText = secondsToMinutes(inSum);

  const outTotalElement = document.createElement("p");
  outTotalElement.className = "p-7 Helvetica-Bold col";
  outTotalElement.innerText = secondsToMinutes(outSum);

  const totalTotalElement = document.createElement("p");
  totalTotalElement.className = "p-7 Helvetica-Bold col";
  totalTotalElement.innerText = secondsToMinutes(inSum + outSum);

  const row = document.createElement("div");
  row.className = "row";
  row.appendChild(inTotalElement);
  row.appendChild(outTotalElement);
  row.appendChild(totalTotalElement);
  table.appendChild(row);

  startStopButton = document.getElementById("button");
  startStopButton.addEventListener("click", toggleStarted);

  darkmodeToggleButton = document.getElementById("darkmode-toggle");
  darkmodeToggleButton.addEventListener("click", () => {
    const body = document.querySelector("body");
    body.classList.toggle("darkmode");
    body.classList.toggle("lightmode");

    const isDarkMode = body.classList.contains("darkmode");
    if (isDarkMode) {
      darkmodeToggleButton.innerText = "☼";
    } else {
      darkmodeToggleButton.innerText = "☾";
    }

    const url = new URL(window.location);
    url.searchParams.set("darkmode", isDarkMode);
    history.pushState({}, "", url);
  });

  const urlParams = new URLSearchParams(window.location.search);
  const darkModeState = urlParams.get("darkmode");
  if (darkModeState === "true") {
    document.querySelector("body").classList.add("darkmode");
    document.querySelector("body").classList.remove("lightmode");
    darkmodeToggleButton.innerText = "☼";
  } else {
    document.querySelector("body").classList.add("lightmode");
    document.querySelector("body").classList.remove("darkmode");
    darkmodeToggleButton.innerText = "☾";
  }
  render();
}

function toggleStarted() {
  state["started"] = !state["started"];
  if (state["started"]) {
    updateState();
  }
}

function updateState() {
  if (!state.started) {
    render();
    return;
  }

  state["timeMs"] += state["timeout"];
  state["totalTimeMs"] += state["timeout"];
  const targetTime = data[state["dataRow"]][state["breathingIn"] ? 0 : 1];
  if (state.timeMs >= targetTime * 1000) {
    if (!state["breathingIn"]) {
      state["dataRow"] += 1;
    }

    if (state["dataRow"] === data.length) {
      state.started = false;
    }

    state["breathingIn"] = !state["breathingIn"];

    state["timeMs"] = 0;
  } else {
  }

  setTimeout(updateState, state["timeout"]);
  render();
}

function render() {
  const table = document.getElementById("table");
  const childNodes = table.childNodes;
  for (let i = 0; i < data.length; i++) {
    // start index at one to skip header row
    const row = childNodes[i + 1];
    row.childNodes.forEach((p) =>
      p.classList.remove("background-color-yellow"),
    );
  }

  const activeRow = childNodes[state["dataRow"] + 1];
  if (state["breathingIn"]) {
    activeRow.childNodes[0].classList.add("background-color-yellow");
  } else {
    activeRow.childNodes[1].classList.add("background-color-yellow");
  }

  const directionElement = document.getElementById("direction");
  if (state["breathingIn"]) {
    directionElement.innerText = "IN";
  } else {
    directionElement.innerText = "OUT";
  }

  const segmentTimeElement = document.getElementById("segment-time");
  segmentTimeElement.innerText = state["timeMs"] / 1000;

  const targetTimeElement = document.getElementById("target-time");
  const targetTime = data[state["dataRow"]][state["breathingIn"] ? 0 : 1];
  targetTimeElement.innerText = `/${targetTime}`;

  // const totalTimeElement = document.getElementById("total-time");
  // totalTimeElement.innerText = state["totalTimeMs"] / 1000;

  const startStopButton = document.getElementById("button");
  if (state["started"]) {
    startStopButton.innerText = "stop";
  } else {
    startStopButton.innerText = "start";
  }
}

init();
updateState();
