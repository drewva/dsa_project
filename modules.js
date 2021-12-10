function randomString(length) {
	let str = "";
	let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJLKMNOPQRSTUVWXYZ1234567890";
	for (let j = 0; j < length; j++)
		str += chars[Math.floor(Math.random()*62)]
	return str;
}

function remove(arr, index) {
	for (let j = index; j < arr.length-1; j++)
		arr[j] = arr[j+1];
	arr.pop();
}

let Video = function(title = randomString(10)) {
	this.url = "https://www.youtube.com/watch?v=" + randomString(15);
	this.title = title;
	this.views = Math.floor(Math.random()*16384);
	this.likes = Math.floor(Math.random()*2048);
	this.dislikes = Math.floor(Math.random()*1024);
	this.comments = Math.floor(Math.random()*1024);
	this.length = Math.floor(Math.random()*2048);
	//this.popularity = this.views + 2*(this.likes - this.dislikes); //delete probably
	this.topic = Math.floor(Math.random()*32768);
	//lower scores are better
	this.likeScore = 100 - Math.round(this.likes/20.48);
	this.dislikeScore = Math.round(this.dislikes/10.24);
	this.commentScore = 100 - Math.round(this.dislikes/10.24);
	this.shortLengthScore = Math.round(this.length/20.48);
	this.longLengthScore = 100 - this.shortLengthScore;
	this.ratioScore = Math.floor((this.likeScore + this.dislikeScore)/2);
}

let Edge = function(to, metrics) {
	this.to = to;
	let weight = metrics[0]*to.likeScore;
	weight += metrics[1]*to.dislikeScore;
	weight += metrics[2]*to.commentScore;
	weight += metrics[3]*to.shortLengthScore;
	weight += metrics[4]*to.longLengthScore;
	weight += metrics[5]*to.ratioScore;
	this.weight = weight;
}

let Graph = function(size, metrics, vids = new Array()) {
	this.size = size;
	this.videos = new Array(size);
	this.adjList = new Array(size);
	this.adjList.fill(new Array());
	//add vertices
	for (let i = 0; i < vids.length && i < size; i++)
		this.videos[i] = vids[i];
	for (let i = vids.length; i < size; i++)
		this.videos[i] = new Video();
	//add edges
	for (let i = 0; i < size; i++) {
		for (let j = 0; j < this.size; j++) {
			if (i == j)
				continue;
			let edge = new Edge(this.videos[j], metrics);
			if (edge.weight < 1024)
				this.adjList[i].push(edge);
		}
	}
	this.print = function() {
		//Mar should feel free to change this to something that interacts with the user interface
		for (let i = 0; i < size; i++)
			console.log((i+1) + ": " + this.videos[i].title + " @ " + this.videos[i].url);
		console.log();
	};
}

function sortDijkstra(graph, source = 0) {
	let start = process.hrtime();
	let visited = new Array(graph.size);
	visited.fill(false);
	let predecessors = new Array(graph.size);
	let distances = new Array(graph.size);
	let queue = new Array();
	queue.push(source);
	visited[source] = true;
	predecessors[source] = -1;
	distances[source] = 0;
	while (queue.length > 0) {
		let vertex = queue.shift();
		//create an array of sorted neighbors
		let sortedNeighbors = new Array(graph.adjList[vertex].length);
		for (let i = 0; i < sortedNeighbors.length; i++) {
			let minimum = 32767;
			let minIndex = -1;
			for (let j = i; j < sortedNeighbors.length; j++) {
				if (graph.adjList[vertex][j].weight < minimum) {
					minimum = graph.adjList[vertex][j].weight;
					minIndex = j;
				}
			}
			let temp = graph.adjList[vertex][minIndex];
			graph.adjList[vertex][minIndex] = graph.adjList[vertex][i];
			graph.adjList[vertex][i] = temp;
			sortedNeighbors[i] = graph.adjList[vertex][i];
		}
		for (let i = 0; i < sortedNeighbors.length; i++) {
			let neighbor = graph.videos.indexOf(sortedNeighbors[i].to);
			if (!visited[neighbor]) {
				queue.push(neighbor);
				visited[neighbor] = true;
				predecessors[neighbor] = vertex;
				distances[neighbor] = distances[vertex] + sortedNeighbors[i].weight;
			}
			else if (distances[neighbor] > distances[vertex] + sortedNeighbors[i].weight) {
				predecessors[neighbor] = vertex;
				distances[neighbor] = distances[vertex] + sortedNeighbors[i].weight;
			}
		}
	}
	//all videos that aren't connected to the source get initialized to a high value
	for (let i = 0; i < graph.size; i++)
		if (!visited[i])
			distances[i] = 32766;
	//sort videos in order of ascending distances
	for (let i = 0; i < graph.size; i++) {
		let minimum = 32767;
		let minIndex = -1;
		for (let j = i; j < graph.size; j++) {
			if (distances[j] < minimum) {
				minimum = distances[j];
				minIndex = j;
			}
		}
		distances[minIndex] = distances[i];
		distances[i] = minimum;
		let temp = graph.videos[minIndex];
		graph.videos[minIndex] = graph.videos[i];
		graph.videos[i] = temp;
	}
	return process.hrtime(start);
}

function sortBF(graph, source = 0) {
	let start = process.hrtime();
	let predecessors = new Array(graph.size);
	predecessors.fill(-1);
	let distances = new Array(graph.size);
	distances.fill(32766);
	predecessors[source] = -1;
	distances[source] = 0;
	for (let i = 0; i < graph.size; i++) {
		for (let j = 0; j < graph.adjList[i].length; j++) {
			let edge = graph.adjList[i][j];
			let toIndex = graph.videos.indexOf(edge.to);
			if (distances[toIndex] > distances[i] + edge.weight) {
				predecessors[toIndex] = i;
				distances[toIndex] = distances[i] + edge.weight;
			}
		}
	}
	//sort videos in order of ascending distances
	for (let i = 0; i < graph.size; i++) {
		let minimum = 32767;
		let minIndex = -1;
		for (let j = i; j < graph.size; j++) {
			if (distances[j] < minimum) {
				minimum = distances[j];
				minIndex = j;
			}
		}
		distances[minIndex] = distances[i];
		distances[i] = minimum;
		let temp = graph.videos[minIndex];
		graph.videos[minIndex] = graph.videos[i];
		graph.videos[i] = temp;
	}
	return process.hrtime(start);
}