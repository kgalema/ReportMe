let allOfThem;
function chartsData(){
    const canvas = document.getElementById("SECTION_1").getContext("2d");
    
    // allOfThem.forEach(el => console.log("Hey"))

}

//Filtering Data for Graphs
function filterData(){
    const start1 = document.getElementById("startdate").value || htmlStartDate
	const end1 = document.getElementById("enddate").value || htmlDate;
    if(end1 < start1) return alert("Start date cannot be greater than end date")
    let dates = dateRange(start1, end1);
    if(allOfThem){
        console.log("Charts created")
        allOfThem.forEach(ch => {
            ch.config.data.labels = dates;
            ch.update();
        });
    }
    return dates
}



//Creating Dates Array
function dateRange(startDate, endDate, steps = 1) {
  const dateArray = [];
  let currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    dateArray.push(moment(new Date(currentDate)).format('YYYY-MM-DD'));
    // Use UTC date to prevent problems with time zones and DST
    currentDate.setUTCDate(currentDate.getUTCDate() + steps);
  }

  return dateArray;
}

function startDrawing(){
	document.getElementById("enddate").max = htmlDate;
	document.getElementById("startdate").max = htmlDate;

	const mongoDB = document.getElementById("DB").innerText;
	const prodDataCharts = JSON.parse(mongoDB); //Production data


	const mongoDBS = document.getElementById("DBS").innerText;
	const sectionsGraphs = JSON.parse(mongoDBS); //Sections


	const dayShift = prodDataCharts.filter((doc) => doc.general[0].shift === "morning"); //Day shift production data
	
	
	const dataPointsTarget = dayShift.map((t) => t.section.forecast);
	const dataPointsSQM = [];


	const labels = filterData(); //Getting filtered labels
	document.getElementById("enddate").value = labels[labels.length - 1];
	document.getElementById("startdate").value = labels[0];




	//Increasing the length of dayShift productions to match labels array
	const increaseDayShift = labels.map(function(e, i) {
		//Day shift production data with 23 objects matching labels
		if (dayShift[i] === undefined) {
			dayShift[i] = this;
		}

		return dayShift[i];
	}, {
		created: "1979-12-12",
		blasted: 0,
		section: {
			forecast: 0
		}
	})

	//IncreasedDayShift
	console.log("increaseDayShift")
	// console.log(increaseDayShift)

	const positioned = []
	for(let i = 0; i < increaseDayShift.length; i++){
		positioned.push([])
	}
	// console.log("Before altering")
	// console.log(positioned)

	let startArr = 0
	for(let i = 0; i < increaseDayShift.length; i++){
		let hello = increaseDayShift.map(e => moment(e.created).format("YYYY-MM-DD")) //so that I can get the position in the increaseedArr

		if(i === 0){
			//Value (created)
			let key1 = hello[i]
			//Value (object)
			let objNumber1 = increaseDayShift[i]
	
			//Check position of created in labels
			let foundPosition = labels.indexOf(key1)
	
			//Use the position found to place the object
			positioned[foundPosition] = [objNumber1]

		} else if (i === increaseDayShift.length - 1){
			//Value (created)
			let key1 = hello[i];
			//Value (object)
			let objNumber1 = increaseDayShift[i];

			//Check position of created in labels
			let foundPosition = labels.indexOf(key1);

			if(foundPosition !== -1){
				//Use the position found to place the object
				positioned[foundPosition].push([objNumber1]);
			}

		} else {
			//Value (created)
			let key1 = hello[i];
			//Value (object)
			let objNumber1 = increaseDayShift[i];

			//Check position of created in labels
			let foundPosition = labels.indexOf(key1);

			if(foundPosition !== -1){
				positioned[foundPosition].push(objNumber1);
			}
		}
	}
	console.log("positioned")
	console.log(positioned)

	//Blasted Square Meters
	const blastedSQM = increaseDayShift.map((e) => e.blasted);
	

	//Target square meters
	const targets = increaseDayShift.map(e => e.section.forecast)
	const data1 = labels.filter(function(e, i) {
		return moment(increaseDayShift[i].created).format("YYYY-MM-DD") === labels[i];
	}, {})
	

	// const data3 = positioned[16]
	// console.log(data3)

	// *******You are going to loop this******** You creating an array of configs
	const configs = sectionsGraphs.map(function(e, i){
		//We need to filter by date first before mapping
		const actuals = []
		console.log(i)
		const data1 = positioned.map((arr, ind) => arr.filter(iner => (iner.section.name === e.name)));
		const data2 = data1.map((arr, ind) => arr.map(iner => (iner.blasted)));
		const data3 = data2.map(function(d, index) { 
			if (d[0] === undefined) {
				d[0] = this;
			}
			return d[0]
		}, "0");
		console.log(data3);

	

		//Targets for section1 *** this will loop 23 times
		const forecasts = labels.map((e) => dayShift[i].section.forecast)
		// const forecasts = labels.map((e, i) => dayShift[i].section.forecast)
		// const achieves = labels.map((e, i) => increaseDayShift[i].blasted)
		// console.log(forecasts)
		// console.log(achieves)

		const config = {
			data: {
				labels,
				datasets: [
					{
						type: "line",
						// data: [211, 326, 165, 350, 420, 370, 500, 375, 415],
						data: forecasts,
						borderColor: "#777",
						borderWidth: "2",
						label: "Target m\u00B2",
					},
					{
						type: "bar",
						// data: [211, 326, 165, 350, 420, 370, 500, 375, 415],
						// data: achieves,
						data: data3,
						backgroundColor: "blue",
						label: "Actual m\u00B2",
					},
				],
			},
			options: {
				plugins: {
					title: {
						display: true,
						text: `${e.name}`,
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
		return config;
	})



    //Use map to generate an array of configs. Pass that array to the constructor function

	const myCharts = [];
	for (let i = 0; i < sectionsGraphs.length; i++) {
		let myChart = new Chart(document.getElementById(sectionsGraphs[i].name).getContext("2d"), configs[i]);
		myCharts.push(myChart);
	}
	allCharts(myCharts);
}

if (document.getElementById("prod_charts")) {
    startDrawing();
}


function allCharts(myCharts){
    allOfThem = myCharts;
    return allOfThem;
}

// console.log(allOfThem)