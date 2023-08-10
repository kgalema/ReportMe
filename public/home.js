// Setting options for date formatting (Chart labels)
const options = { year: "2-digit", month: "short", day: "2-digit" };

// Constructing today's date
const indexToday = new Date();
const indexTodayCopy = new Date();
// indexTodayCopy.setDate(indexTodayCopy.getDate() - 6);
let todayIndexDay = indexToday.getDate();
let todayIndexMonth = indexToday.getMonth() + 1;
const todayIndexYear = indexToday.getFullYear();

if (todayIndexDay <= 9) {
	todayIndexDay = "0" + todayIndexDay;
}

if (todayIndexMonth <= 9) {
	todayIndexMonth = "0" + todayIndexMonth;
}

const indexStartDateDay = "01";
const indexStartDate = `${todayIndexYear}-${todayIndexMonth}-${indexStartDateDay}`;
const indexEndDate = `${todayIndexYear}-${todayIndexMonth}-${todayIndexDay}`;

const start = document.getElementById("chart-from");
const end = document.getElementById("chart-to");
start.value = indexStartDate;
start.max = indexEndDate;
end.value = indexEndDate;
end.max = indexEndDate;

const rangeStart = new Date(new Date(indexStartDate).toDateString()).getTime();
const rangeEnd = new Date(new Date(indexEndDate).toDateString()).getTime();

const reports = document.getElementById("productions").innerText;
const parsedReports1 = JSON.parse(reports);

function compareFunction(a, b) {
	return new Date(a.general[0].shiftStart) - new Date(b.general[0].shiftStart);
}

parsedReports1.sort(compareFunction);

const indexShift = document.getElementById("index-shift").value;
const parsedReports2 = parsedReports1.filter(e => e.general[0].shift === indexShift.toLowerCase());

const parsedReports = parsedReports2.filter(prod => new Date(new Date(prod.general[0].shiftStart).toDateString()).getTime() >= rangeStart && new Date(new Date(prod.general[0].shiftStart).toDateString()).getTime() <= rangeEnd);

const shifts = document.getElementById("shifts").innerText;
const parsedShifts = JSON.parse(shifts);
const blastingShift = parsedShifts.filter(e => e.isBlasting)[0].name.toLowerCase();
const dayShiftData = parsedReports.filter(doc => doc.general[0].shift === blastingShift); //Day shift production data

const labels = parsedReports.map(e => new Date(e.general[0].shiftStart).toLocaleDateString("en-GB", options));
const blastLabels1 = dayShiftData.map(e => new Date(e.general[0].shiftStart).toLocaleDateString("en-GB", options));

const labels2 = labels.map((e, i, arr) => {
	if (i === 0) {
		return e.split(" ").slice(0, 2);
	}

	if (arr[i].split(" ")[1] !== arr[i - 1].split(" ")[1]) {
		return e.split(" ").slice(0, 2);
	}

	return e.split(" ")[0];
});

const blastLabels = blastLabels1.map((e, i, arr) => {
	if (i === 0) {
		return e.split(" ").slice(0, 2);
	}

	if (arr[i].split(" ")[1] !== arr[i - 1].split(" ")[1]) {
		return e.split(" ").slice(0, 2);
	}

	return e.split(" ")[0];
});

const arr = ["blast", "clean", "support", "drill", "prepared"];

arr.forEach(e => {
	const ctx = document.getElementById(e);

	switch (e) {
		case "blast":
			dataPoints = dayShiftData.map(e => e.blastedm);
			break;
		case "clean":
			dataPoints = parsedReports.map(e => e.cleaned);
			break;
		case "support":
			dataPoints = parsedReports.map(e => e.supported);
			break;
		case "drill":
			dataPoints = parsedReports.map(e => e.drilled);
			break;
		case "prepared":
			dataPoints = parsedReports.map(e => e.prepared);
			break;
		default:
			dataPoints = [];
	}

	new Chart(ctx, {
		type: "bar",
		data: {
			labels: e === "blast" ? blastLabels : labels2,
			datasets: [
				{
					label: e,
					data: dataPoints,
					borderWidth: 1,
					backgroundColor: "green",
					barPercentage: 1,
					// barThickness: 20,
					maxBarThickness: 25,
					hoverOffset: 4,
				},
			],
		},
		options: {
			responsive: true,
			maintainAspectRation: false,
			plugins: {
				legend: {
					display: false,
				},
			},
			scales: {
				y: {
					beginAtZero: true,
				},
				x: {
					ticks: {
						maxRotation: 0,
						// wrap: true,
						// maxWidth: 80,
						// autoSkip: false,
						// maxTicksLimit: labels.length,
					},
				},
			},
		},
	});
});

function filterParameters() {
	// Get the selected shift
	const indexShift = document.getElementById("index-shift").value;

	// Filter reports according to selected shifts
	const parsedReports2 = parsedReports1.filter(e => e.general[0].shift === indexShift.toLowerCase());

	// Get new start and end dates (new range)
	const newStart = document.getElementById("chart-from");
	const newEnd = document.getElementById("chart-to");

	const newRangeStart = new Date(new Date(newStart.value).toDateString()).getTime();
	const newRangeEnd = new Date(new Date(newEnd.value).toDateString()).getTime();

	// Filter production reports by selected date range
	const parsedReports = parsedReports2.filter(prod => new Date(new Date(prod.general[0].shiftStart).toDateString()).getTime() >= newRangeStart && new Date(new Date(prod.general[0].shiftStart).toDateString()).getTime() <= newRangeEnd);

	// Filter blasting shift data
	const blastingShiftData = parsedReports.filter(doc => doc.general[0].shift === blastingShift);

	return { parsedReports, blastingShiftData };
}

function chartRangeChange() {
	const { parsedReports, blastingShiftData } = filterParameters();

	// New labels
	const newLabels = parsedReports.map(e => new Date(e.general[0].shiftStart).toLocaleDateString("en-GB", options));
	const blastLabels1 = blastingShiftData.map(e => new Date(e.general[0].shiftStart).toLocaleDateString("en-GB", options));

	const labels3 = newLabels.map((e, i, arr) => {
		if (i === 0) {
			return e.split(" ").slice(0, 2);
		}

		if (arr[i].split(" ")[1] !== arr[i - 1].split(" ")[1]) {
			return e.split(" ").slice(0, 2);
		}

		return e.split(" ")[0];
	});

	const blastLabels = blastLabels1.map((e, i, arr) => {
		if (i === 0) {
			return e.split(" ").slice(0, 2);
		}

		if (arr[i].split(" ")[1] !== arr[i - 1].split(" ")[1]) {
			return e.split(" ").slice(0, 2);
		}

		return e.split(" ")[0];
	});

	arr.forEach(e => {
		switch (e) {
			case "blast":
				dataPoints = blastingShiftData.map(e => e.blasted);
				break;
			case "clean":
				dataPoints = parsedReports.map(e => e.cleaned);
				break;
			case "support":
				dataPoints = parsedReports.map(e => e.supported);
				break;
			case "drill":
				dataPoints = parsedReports.map(e => e.drilled);
				break;
			case "prepared":
				dataPoints = parsedReports.map(e => e.prepared);
				break;
			default:
				dataPoints = [];
		}

		const choosenChart = Chart.getChart(e);
		const checkedRadio = document.querySelector(`input[name=${e}]:checked`);

		choosenChart.data.labels = e === "blast" ? blastLabels : labels3;
		choosenChart.data.datasets[0].data = dataPoints;
		choosenChart.update();
		checkedRadio.onclick();
	});
}

function propertyChange(e) {
	const { parsedReports, blastingShiftData } = filterParameters();

	//selected chart (CHART TO EDIT)
	const choosenChart = Chart.getChart(e.name);

	const catFilter = e.id;

	let newData = [];

	switch (e.name) {
		case "blast":
			//get new data points
			switch (catFilter) {
				case "blast-meter":
					newData = blastingShiftData.map(e => e.blastedm);
					break;
				case "blast-meter-sqr":
					newData = blastingShiftData.map(e => e.blasted);
					break;
				case "blast-panels":
					newData = blastingShiftData.map(e => e.blast.length);
					break;
			}

			break;
		case "clean":
			switch (catFilter) {
				case "clean-meter":
					newData = parsedReports.map(e => e.cleaned);
					break;
				case "clean-meter-sqr":
					newData = parsedReports.map(e => e.blasted); // Sort this thing out. Get actual cleaned square meters
					break;
				case "clean-panels":
					newData = parsedReports.map(e => e.clean.length);
					break;
			}
			break;

		case "support":
			switch (catFilter) {
				case "support-meter":
					newData = parsedReports.map(e => e.supported);
					break;
				case "support-panels":
					newData = parsedReports.map(e => e.support.length);
					break;
				case "support-bolts":
					newData = parsedReports.map(e => e.supportedBolts.bolts);
					break;
				case "support-anchors":
					newData = parsedReports.map(e => e.supportedBolts.anchors);
					break;
			}
			break;
		case "drill":
			switch (catFilter) {
				case "drill-meter":
					newData = parsedReports.map(e => e.drilled);
					break;
				case "drill-panels":
					newData = parsedReports.map(e => e.drill.length);
					break;
				case "drill-holes":
					newData = parsedReports.map(e => e.drilledHoles);
					break;
			}
			break;

		case "prepared":
			switch (catFilter) {
				case "prepared-meter":
					newData = parsedReports.map(e => e.prepared);
					break;
				case "prepared-panels":
					newData = parsedReports.map(e => e.prep.length);
					break;
			}
			break;
		default:
			newData = [];
	}

	choosenChart.data.datasets[0].data = newData;
	choosenChart.update();
}

const radios = document.querySelectorAll("input[type=radio]");
radios.forEach(e => (e.onclick = propertyChange.bind(null, e)));
