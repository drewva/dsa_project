import React, {useState} from 'react'
import "./App.css";
import "./modules.js";
const events = require("events");

function App() {
  // Stores user input
  const [AlgorithmInputted, SetAlgorithm] = useState("Dijkstra's");
  const [LikesInputted, SetLikes] = useState(7);
  const [DislikesInputted, SetDislikes] = useState(9);
  const [CommentsInputted, SetComments] = useState(1);
  const [ShortVidInputted, SetShortVid] = useState(3);
  const [LongVidInputted, SetLongVid] = useState(6);
  const [RatingRatioInputted, SetRatingRatio] = useState(10);

  // Stores the window to use, taking advantage of hooks to automatically update
  const [SeeResults, SetSeeResults] = useState(false);

  // Stores the rows of the results table
  const [ResultsRows, SetRows] = useState([]);

  // Handles one of the input areas (textbox, dropdown) being changed
  function handleChange(evt) {
    if(evt.target.id === "AlgorithmDropdown") {
      SetAlgorithm(evt.target.value);
    }
    else if(evt.target.id === "LikesInput") {
      if((evt.target.value >= 1 && evt.target.value <= 10) || evt.target.value === "") {
        SetLikes(evt.target.value);
      }
    }
    else if(evt.target.id === "DislikesInput") {
      if((parseInt(evt.target.value) >= 1 && parseInt(evt.target.value) <= 10) || evt.target.value === "") {
        SetDislikes(evt.target.value);
      }
    }
    else if(evt.target.id === "CommentsInput") {
      if((parseInt(evt.target.value) >= 1 && parseInt(evt.target.value) <= 10) || evt.target.value === "") {
        SetComments(evt.target.value);
      }
    }
    else if(evt.target.id === "ShortVidInput") {
      if((parseInt(evt.target.value) >= 1 && parseInt(evt.target.value) <= 10) || evt.target.value === "") {
        SetShortVid(evt.target.value);
      }
    }
    else if(evt.target.id === "LongVidInput") {
      if((parseInt(evt.target.value) >= 1 && parseInt(evt.target.value) <= 10) || evt.target.value === "") {
        SetLongVid(evt.target.value);
      }
    }
    else if(evt.target.id === "RatingRatioInput") {
      if((parseInt(evt.target.value) >= 1 && parseInt(evt.target.value) <= 10) || evt.target.value === "") {
        SetRatingRatio(evt.target.value);
      }
    }
  }

  // Handles when a button is clicked. Here, the buttons simply toggle the windows and clear the table if applicable
  function handleClick(evt) {
    if(evt.target.type === "button") {
      if(SeeResults) {
        // Curretly on results window, clear table
        clearTable();
      }
      else {
        // Currently on preferences window, set up table
        var metrics = [parseInt(LikesInputted), parseInt(DislikesInputted), parseInt(CommentsInputted), parseInt(ShortVidInputted), parseInt(LongVidInputted), parseInt(RatingRatioInputted)];
        // Todo: Generate graph and use print function to insert nodes
        fillTable(metrics);
      }
      // Toggle preferences and results window
      SetSeeResults(!SeeResults);
    }
  }

  // Clears the results table
  function clearTable() {
    SetRows([]);
  }

  function fillTable(userMetrics) {
    var table = document.getElementById("ResultsTable");

    // currentRows is an array of strings to be added to the table
    // to add video analytics, you'd do something like:

    /*
    As a placeholder, I filled the table with userMetrics.

    for(let i = 0; i < userMetrics.length; i++) {
      var currentRows = ResultsRows;
      currentRows.push(userMetrics[i]);
      SetRows(currentRows);
    }

    */
    
   // Here, currentRows replaces ResultsRows, and the table is updated with the SetRows() function

   /* So, we want something like this in this function:
   let videoGraph = new Graph(100, userMetrics);
   if(AlgorithmInputted === "Dijkstra's") {
      sortDijkstra(videoGraph);
   }
   else {
      sortBF(videoGraph);
   }
   videoGraph.print();

   And inside print(), instead of logging to console:
   for(let i = 0; i < size; i++) {
     var currentRows = ResultsRows;
     currentRows.push((i + 1) + ".) " + this.videos[i].title + " @ " + this.videos[i].url);
     SetRows(currentRows);
   }
   */

  }

  const Preferences = (
    <div id="Preferences">
      <h1>YouTube Roulette Sorter</h1>
      <div className="Algorithm">
          <h1>Algorithm</h1>
          <select id="AlgorithmDropdown" value={AlgorithmInputted} onChange={handleChange}>
            <option value="Dijkstra's">Dijkstra's</option>
            <option value="Bellman-Ford">Bellman-Ford</option>
          </select>
      </div>
      <div className="Metrics">
        <h1>Metric Weight</h1>
        <div className="MetricsGridContainer">
          <span className="LikesInputContainer">
            <span><b>Like Count</b></span>
            <input id="LikesInput" type="text" value={LikesInputted} onChange={handleChange}></input>
          </span>
          <span className="DislikesInputContainer">
            <span><b>Dislike Count</b></span>
            <input id="DislikesInput" type="text" value={DislikesInputted} onChange={handleChange}></input>
          </span>
          <span className="CommentsInputContainer">
            <span><b>Comment Count</b></span>
            <input id="CommentsInput" type="text" value={CommentsInputted} onChange={handleChange}></input>
          </span>
          <span className="ShortVidInputContainer">
            <input id="ShortVidInput" type="text" value={ShortVidInputted} onChange={handleChange}></input>
            <span><b>Short Video Length</b></span>
          </span>
          <span className="LongVidInputContainer">
            <input id="LongVidInput" type="text" value={LongVidInputted} onChange={handleChange}></input>
            <span><b>Long Video Length</b></span>
          </span>
          <span className="RatingRatioInputContainer">
            <input id="RatingRatioInput" type="text" value={RatingRatioInputted} onChange={handleChange}></input>
            <span><b>Like/Dislike Ratio</b></span>
          </span>
        </div>
      </div>
      <button className="NextButton" type="button" onClick={handleClick}>Next</button>
    </div>
  );

  const Results = (
    <div id="Results">
      <h1>Sorted YouTube Videos</h1>
      <div>
        <table id="ResultsTable" className="ResultsTableContainer">
          {/* JS map allows us to run a function with all the elements of an array. Here, we simply repeatedly creaate multiple rows */}
          {/* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map */}
          {ResultsRows.map((rowToAdd) => (
            <tr>{rowToAdd}</tr>
          ))}
        </table>
      </div>
      <button className="ReturnButton" type="button" onClick={handleClick}>Return</button>
    </div>
  );

  return (
    <div className="App">
      {SeeResults ? Results : Preferences}
    </div>
  );
}

export default App;

//main back end code
console.log("the following are created by randomly generated data & are not real youtube videos\n");
let ui = App();
//set variable defaults
let dijkstra = false;
let metrics = new Array(6);
metrics.fill(1);
//add event listeners
let emitter = new events.EventEmitter();
emitter.setMaxListeners(14);
emitter.on("toggleAlgorithm", () => {
	dijkstra = !dijkstra;
});
emitter.on("likes++", () => {
	if (metrics[0] < 10)
		metrics[0]++;
});
emitter.on("likes--", () => {
	if (metrics[0] > 1)
		metrics[0]--;
});
emitter.on("dislikes++", () => {
	if (metrics[1] < 10)
		metrics[1]++;
});
emitter.on("dislikes--", () => {
	if (metrics[1] > 1)
		metrics[1]--;
});
emitter.on("comments++", () => {
	if (metrics[2] < 10)
		metrics[2]++;
});
emitter.on("comments--", () => {
	if (metrics[2] > 1)
		metrics[2]--;
});
emitter.on("short++", () => {
	if (metrics[3] < 10)
		metrics[3]++;
});
emitter.on("short--", () => {
	if (metrics[3] > 1)
		metrics[3]--;
});
emitter.on("long++", () => {
	if (metrics[4] < 10)
		metrics[4]++;
});
emitter.on("long--", () => {
	if (metrics[4] > 1)
		metrics[4]--;
});
emitter.on("ratio++", () => {
	if (metrics[5] < 10)
		metrics[5]++;
});
emitter.on("ratio--", () => {
	if (metrics[5] > 1)
		metrics[5]--;
});
emitter.on("reset", () => {
	metrics.fill(1);
});
//use buttons
let loadBtn = document.getElementsByClassName("NextButton")[0];
loadBtn.onclick = function() {
	//show the results via a graph
	console.log("display graph");
	/* might delete later
	let graph = new Graph(16, metrics);
	if (dijkstra)
		sortDijkstra(graph);
	else
		sortBF(graph);
	graph.print();
	*/
}