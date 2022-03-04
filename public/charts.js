let chartCreated;

function drawnChart(chart){
    chartCreated = chart;
    return chartCreated;
}


if (document.getElementById("prod_charts")) {
	document.getElementById("startdate").value = htmlStartDate;
	document.getElementById("enddate").value = htmlDate;
	drawProductionGraph();
}

function drawProductionGraph(){
	if (chartCreated) {
		console.log("Chart created exist");
		chartCreated.destroy();
	}
	const mongoDB = document.getElementById("DB").innerText;
	const prodDataCharts = JSON.parse(mongoDB);

	// Now sort by date in ascending order
	prodDataCharts.sort(compareFunction);
	function compareFunction(a, b) {
		return new Date(moment(a.created).format("YYYY-MM-DD")) - new Date(moment(b.created).format("YYYY-MM-DD"));
	}

	const startDate = document.getElementById("startdate").value || htmlStartDate;
	const endDate = document.getElementById("enddate").value || htmlDate;
	const selectedSection = document.getElementById("selectedSection").value;
	const data = prodDataCharts.filter((e) => moment(e.created).format("YYYY-MM-DD") >= startDate && moment(e.created).format("YYYY-MM-DD") <= endDate);
	const dayShiftData = data.filter((doc) => doc.general[0].shift === "morning"); //Day shift production data
	const dayShiftDataSection = dayShiftData.filter((doc) => doc.section.name === selectedSection); //Day shift production data of 1 particular section
	const labels = dayShiftDataSection.map((e) => moment(e.created).format("YYYY-MM-DD"));
	const dataForecast = dayShiftDataSection.map((e) => e.forecast);
	const dataBlasted = dayShiftDataSection.map((e) => e.blasted);

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
					text: "Production Report",
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

	drawnChart(myChart);
}

// drawProductionGraph()
