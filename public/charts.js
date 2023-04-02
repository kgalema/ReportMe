let chartCreated;
let progChart;
let efficiencyChart;
let efficiencyChart2;

function drawnChart(chart) {
	chartCreated = chart;
	return chartCreated;
}

function drawnProgChart(chart) {
	progChart = chart;
	return progChart;
}

function drawnEffChart(chart) {
	efficiencyChart = chart;
	return efficiencyChart;
}
function drawnEffChart2(chart) {
	efficiencyChart2 = chart;
	return efficiencyChart2;
}

if (document.getElementById("prod_charts")) {
	document.getElementById("startdate").value = htmlStartDate;
	document.getElementById("enddate").value = htmlDate;
	drawProductionGraph();
}

function drawProductionGraph() {
	if (chartCreated) {
		console.log("Chart created exist");
		chartCreated.destroy();
	}
	if (progChart) {
		console.log("Progressive chart already exist");
		progChart.destroy();
	}
	const mongoDB = document.getElementById("DB").innerText;
	const prodDataCharts = JSON.parse(mongoDB);

	const shifts = document.getElementById("shifts").innerText;
	const parsedShifts = JSON.parse(shifts);

	const blastingShift = parsedShifts.filter(e => e.isBlasting)[0].name.toLowerCase();

	// Now sort by date in ascending order
	prodDataCharts.sort(compareFunction);
	function compareFunction(a, b) {
		// return new Date(moment(a.created).format("YYYY-MM-DD")) - new Date(moment(b.created).format("YYYY-MM-DD"));
		return new Date(moment(a.general[0].shiftStart).format("YYYY-MM-DD")) - new Date(moment(b.general[0].shiftStart).format("YYYY-MM-DD"));
	}

	const options = { year: "2-digit", month: "short", day: "2-digit" };

	const startDate = document.getElementById("startdate").value || htmlStartDate;
	const endDate = document.getElementById("enddate").value || htmlDate;
	const selectedSection = document.getElementById("selectedSection").value;
	// const data = prodDataCharts.filter((e) => moment(e.created).format("YYYY-MM-DD") >= startDate && moment(e.created).format("YYYY-MM-DD") <= endDate);
	const data = prodDataCharts.filter(e => moment(e.general[0].shiftStart).format("YYYY-MM-DD") >= startDate && moment(e.general[0].shiftStart).format("YYYY-MM-DD") <= endDate);
	// const dayShiftData = data.filter((doc) => doc.general[0].shift === "morning");
	const dayShiftData = data.filter(doc => doc.general[0].shift === blastingShift); //Day shift production data
	const dayShiftDataSection = dayShiftData.filter(doc => doc.section.name === selectedSection); //Day shift production data of 1 particular section
	// const labels = dayShiftDataSection.map((e) => moment(e.general[0].shiftStart).format("YYYY-MM-DD"));
	const labels = dayShiftDataSection.map(e => new Date(e.general[0].shiftStart).toLocaleDateString("en-GB", options));
	const dataForecast = dayShiftDataSection.map(e => e.forecast);
	const dataBlasted = dayShiftDataSection.map(e => e.blasted);

	// Configuring Progressive Values
	const cummulativeBlast = cummulateArr(dataBlasted);
	const cummulativeForecast = cummulateArr(dataForecast);

	// Thickness of bar graphs in pixels
	const thickness = 15;

	// Configuration for non-cummulative graph
	const config = {
		data: {
			labels: labels,
			datasets: [
				{
					type: "line",
					data: dataForecast,
					borderColor: "#777",
					borderWidth: "2",
					label: "Target m\u00B2",
				},
				{
					type: "bar",
					data: dataBlasted,
					backgroundColor: "blue",
					label: "Actual m\u00B2",
					maxBarThickness: thickness,
				},
			],
		},
		options: {
			plugins: {
				title: {
					display: true,
					text: `${selectedSection}`,
					padding: {
						bottom: 5,
					},
				},
				subtitle: {
					display: true,
					text: "Daily m\u00B2",
					padding: {
						bottom: 5,
					},
				},
				legend: {
					position: "bottom",
				},
			},
			responsive: true,
			scales: {
				y: {
					ticks: {
						callback: function (value) {
							return value + "m\u00B2";
						},
					},
					title: {
						display: true,
						text: "m\u00B2",
					},
				},
				x: {
					title: {
						display: true,
						text: "Date",
					},
				},
			},
		},
	};

	// Configurations for cummulative graph
	const configProgressive = {
		data: {
			labels: labels,
			datasets: [
				{
					type: "line",
					data: cummulativeForecast,
					borderColor: "#777",
					borderWidth: "2",
					label: "Progressive Target m\u00B2",
				},
				{
					type: "bar",
					data: cummulativeBlast,
					backgroundColor: "green",
					label: "Progressive Actual m\u00B2",
					maxBarThickness: thickness,
				},
			],
		},
		options: {
			plugins: {
				title: {
					display: true,
					text: `${selectedSection}`,
					padding: {
						bottom: 5,
					},
				},
				subtitle: {
					display: true,
					text: "Progressive m\u00B2",
					padding: {
						bottom: 5,
					},
				},
				legend: {
					position: "bottom",
				},
			},
			responsive: true,
			scales: {
				y: {
					ticks: {
						callback: function (value) {
							return value + "m\u00B2";
						},
					},
					title: {
						display: true,
						text: "m\u00B2",
					},
				},
				x: {
					title: {
						display: true,
						text: "Date",
					},
				},
			},
		},
	};

	// Draw requested function
	let myChart = new Chart(document.getElementById("draw").getContext("2d"), config);
	let myChartProgressive = new Chart(document.getElementById("drawProgressive").getContext("2d"), configProgressive);

	drawnChart(myChart);
	drawnProgChart(myChartProgressive);
}

// drawProductionGraph()

/*
 * Creating a chart for table of breakdowns efficiencies
 *
 */

function drawEffGraph() {
	if (efficiencyChart) {
		console.log("Chart efficiency chart exist");
		efficiencyChart.destroy();
	}
	const availabilities = document.getElementsByClassName("availability");
	// const utilisations = document.getElementsByClassName("utilisation");
	const efficiencies = document.getElementsByClassName("efficiency");

	const availabilitiesLength = availabilities.length;
	// const utilisationsLength = utilisations.length;
	const efficienciesLength = efficiencies.length;

	const avails = [];
	// const utils = [];
	const effs = [];

	for (let i = 0; i < availabilitiesLength; i++) {
		avails.push(Number(availabilities[i].innerText));
	}
	// for (let i = 0; i < utilisationsLength; i++) {
	// 	utils.push(Number(utilisations[i].innerText));
	// }
	for (let i = 0; i < efficienciesLength; i++) {
		effs.push(Number(efficiencies[i].innerText));
	}

	const configEffGraph = {
		data: {
			labels: ["Morning", "Afternoon", "Night"],
			datasets: [
				{
					type: "bar",
					data: avails,
					borderColor: "#777",
					borderWidth: "1",
					label: "Availability %",
					maxBarThickness: 40,
				},
				// {
				// 	type: "bar",
				// 	data: utils,
				// 	backgroundColor: "blue",
				// 	label: "Utilisation %",
				// 	maxBarThickness: 40,
				// },
				// {
				// 	type: "bar",
				// 	data: effs,
				// 	backgroundColor: "green",
				// 	label: "Efficiency %",
				// 	maxBarThickness: 40,
				// },
			],
		},
	};

	const foundTMM = document.getElementById("foundTMM").innerText;
	const parsedFoundTMM = JSON.parse(foundTMM);
	const tmmCat = parsedFoundTMM.parentCategory;

	if (tmmCat === "TMM") {
		let effGraph = new Chart(document.getElementById("effGraph").getContext("2d"), configEffGraph);
		drawnEffChart(effGraph);
	}
}

function drawEffGraph2() {
	const dates = document.getElementsByClassName("date");
	const dates2 = [...dates];
	const labels = dates2.map(e => e.innerText);
	console.log(labels);

	const avail = document.getElementsByClassName("avail");
	const avail2 = [...avail];
	const data = avail2.map(e => e.innerText);

	console.log("Graph2 is triggered");
	if (efficiencyChart2) {
		console.log("Chart efficiency chart exist");
		efficiencyChart2.destroy();
	}

	const options = {
		scales: {
			x: {
				ticks: {
					font: {
						size: 10,
					},
				},
			},
		},
	};

	const configEffGraph2 = {
		data: {
			labels: labels,
			datasets: [
				{
					type: "bar",
					data: data,
					// borderColor: "#777",
					backgroundColor: "blue",
					// borderWidth: "1",
					label: "Availability %",
					maxBarThickness: 20,
				},
				// {
				// 	type: "line",
				// 	data: [],
				// 	backgroundColor: "blue",
				// 	borderColor: "green",
				// 	borderWidth: 1,
				// 	label: "Target %",
				// },
			],
		},
		options: options,
	};

	const foundTMM = document.getElementById("foundTMM").innerText;
	const parsedFoundTMM = JSON.parse(foundTMM);
	const tmmCat = parsedFoundTMM.parentCategory;

	if (tmmCat === "TMM") {
		console.log("Graph 2 is working");
		let effGraph2 = new Chart(document.getElementById("effGraph2").getContext("2d"), configEffGraph2);
		drawnEffChart2(effGraph2);
	}
}

function cummulateArr(arr) {
	const arrLength = arr.length;
	const arr2 = [];
	for (let i = 1; i <= arrLength; i++) {
		const slicedArr = arr.slice(0, i);
		const pusher = slicedArr.reduce((e, i) => Number(e) + Number(i), 0);
		arr2.push(pusher);
	}
	return arr2;
}

if (document.getElementById("effGraph")) {
	const foundTMM = document.getElementById("foundTMM").innerText;
	const parsedFoundTMM = JSON.parse(foundTMM);
	const tmmCat = parsedFoundTMM.parentCategory;
	if (tmmCat === "TMM") {
		drawEffGraph();
	}
}

if (document.getElementById("effGraph2")) {
	const foundTMM = document.getElementById("foundTMM").innerText;
	const parsedFoundTMM = JSON.parse(foundTMM);
	const tmmCat = parsedFoundTMM.parentCategory;
	if (tmmCat === "TMM") {
		drawEffGraph2();
	}
}
