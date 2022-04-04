console.time();
let fieldNumber = 1;
let panelInput = document.querySelector("#panel");
let quantityInput = document.querySelector("#length");
let boltsInput = document.querySelector("#bolts");
let anchorsInput = document.querySelector("#anchors");
let holesInput = document.querySelector("#holes");
let coyNumber = document.querySelector("#coyNumber");
let buckets = document.querySelector("#LHDbuckets");
let gl = document.querySelector("#LHDnumber");
let tbody = document.querySelector("tbody");

const coll = document.getElementsByClassName("collapsible");

for (let i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
        this.classList.toggle("active");
        let content = this.nextElementSibling;
        if (content.style.maxHeight) {
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        }
    });
}

function out(e) {
    if(e.querySelector("select")){
        const element = e.querySelector("select");
        const elementId = element.id;
        const firstSelect = document.getElementById(elementId);
        e.parentNode.removeChild(e);
        firstSelect.oninput();
    } else {
        e.parentNode.removeChild(e);
    }
};

function addAnotherField(e) {
    // let inputsCount = document.getElementById("blast-report").querySelectorAll("tr").length 
    // fieldNumber = fieldNumber + 1;
    // console.log(inputsCount)
    // let num = fieldNumber;
    let inputsCount = e.querySelectorAll("tr").length
    inputsCount = inputsCount + 1
    let num = inputsCount;
    let body = e.childNodes[1].childNodes[1];

    let newField = `<td class="form-row removeToggle">
                        <input type="text" id="panel" name="production[blast][${num}][panel]" placeholder=${panelInput.placeholder} required onkeyup="validatePanelName(event)">
                        </td>

                        <td class="form-row removeToggle">
                        <input type="number" min="0" id="length" name="production[blast][${num}][length]" placeholder=${quantityInput.placeholder} oninput="checkCallAchieved(event)" required>
                        </td>

                        <td class="form-row removeToggle">
                        <a href="#" onclick="out(this.parentNode.parentNode)" id="out">Delete</a>
                        </td>`;

    let tr = document.createElement("tr");
    tr.className = "removedToggle";
    tr.innerHTML = newField;

    body.appendChild(tr);
    e.style.maxHeight = e.scrollHeight + "px";
}

function addAnotherClean(e) {
    let inputsCount = e.querySelectorAll("tr").length;
    inputsCount = inputsCount + 1;
    let num = inputsCount;
    // fieldNumber = fieldNumber + 1;
    // let num = fieldNumber;
    let body = (e.childNodes[1].childNodes[1]);

    let newField = `<td class="form-row">
                        <input type="text" id="panel" name="production[clean][${num}][panel]" placeholder=${panelInput.placeholder} required onkeyup="validatePanelName(event)">
                    </td>

                    <td class="form-row">
                        <input type="number" min="0" id="length" name="production[clean][${num}][length]" placeholder=${quantityInput.placeholder} required>
                    </td>

                    <td class="form-row">
                        <input type="number" min="0" id="advance" name="production[clean][${num}][advance]" placeholder="advance" step="0.1" required>
                    </td>

                    <td class="form-row">
                        <a href="#" onclick="out(this.parentNode.parentNode)" id="out">Delete</a>
                    </td>`;


    let tr = document.createElement("tr");
    tr.innerHTML = newField;

    body.appendChild(tr);
    e.style.maxHeight = e.scrollHeight + "px";
}

function addAnotherSupport(e) {
    let inputsCount = e.querySelectorAll("tr").length;
    inputsCount = inputsCount + 1;
    let num = inputsCount;

    const options = document.getElementById("bolter").getElementsByTagName("option");
    let stringOpts = "";
    for(let i = 0; i < options.length; i++){
        stringOpts = stringOpts + `<option value=${options[i].value}>${options[i].value}</option>`;
    }

    // fieldNumber = fieldNumber + 1;
    // let num = fieldNumber;
    let body = (e.childNodes[1].childNodes[1]);

    let newField = `<td class="form-row">
                        <input type="text" id="panel" name="production[support][${num}][panel]" placeholder=${panelInput.placeholder} required onkeyup="validatePanelName(event)">
                    </td>

                    <td class="form-row">
                        <input type="number" min="0" id="length" name="production[support][${num}][length]" placeholder=${quantityInput.placeholder} required>
                    </td>

                    <td class="form-row">
                        <input type="number" min="0" id="bolts" name="production[support][${num}][bolts]" placeholder=${boltsInput.placeholder} required>
                    </td>

                    <td class="form-row">
                        <input type="number" min="0" id="anchors" name="production[support][${num}][anchors]" placeholder=${anchorsInput.placeholder} required>
                    </td>

                    <td class="form-row">
                        <select name="production[support][${num}][machine]" id="bolter" class="used-bolter" oninput="getAllProductionTMMs(this)">
                        ${stringOpts}
                        </select>
                    </td>

                    <td class="form-row">
                        <a href="#" onclick="out(this.parentNode.parentNode)" id="out">Delete</a>
                    </td>`;

    let tr = document.createElement("tr");
    tr.innerHTML = newField;

    body.appendChild(tr);
    e.style.maxHeight = e.scrollHeight + "px";
}

function addAnotherDrilled(e) {
    let inputsCount = e.querySelectorAll("tr").length;
    inputsCount = inputsCount + 1;
    let num = inputsCount;

    const options = document.getElementById("drillRig").getElementsByTagName("option");
	let stringOpts = "";
	for (let i = 0; i < options.length; i++) {
		stringOpts = stringOpts + `<option value=${options[i].value}>${options[i].value}</option>`;
	}

    // fieldNumber = fieldNumber + 1;
    // let num = fieldNumber;
    let body = (e.childNodes[1].childNodes[1]);

    let newField = `<td class="form-row">
                        <input type="text" id="panel" name="production[drill][${num}][panel]" placeholder=${panelInput.placeholder} required onkeyup="validatePanelName(event)">
                    </td>

                    <td class="form-row">
                        <input type="number" min="0" id="length" name="production[drill][${num}][length]" placeholder=${quantityInput.placeholder} required>
                    </td>

                    <td class="form-row">
                        <input type="number" min="0" id="holes" name="production[drill][${num}][holes]" placeholder=${holesInput.placeholder} required>
                    </td>

                    <td class="form-row">
                        <select name="production[drill][${num}][drillRig]" id="drillRig" class="used-drill-rig" oninput="getAllProductionTMMs(this)"  required>
                            ${stringOpts}
                        </select>
                    </td>

                    <td class="form-row">
                        <a href="#" onclick="out(this.parentNode.parentNode)" id="out">Delete</a>
                    </td>`;

    let tr = document.createElement("tr");
    tr.innerHTML = newField;

    body.appendChild(tr);
    e.style.maxHeight = e.scrollHeight + "px";
}

function addAnotherPrepared(e) {
    let inputsCount = e.querySelectorAll("tr").length;
    inputsCount = inputsCount + 1;
    let num = inputsCount;
    // fieldNumber = fieldNumber + 1;
    // let num = fieldNumber;
    let body = (e.childNodes[1].childNodes[1]);

    let newField = `<td class="form-row">
                        <input type="text" id="panel" name="production[prep][${num}][panel]" placeholder=${panelInput.placeholder} required onkeyup="validatePanelName(event)">
                    </td>

                    <td class="form-row">
                        <input type="number" min="0" id="length" name="production[prep][${num}][length]" placeholder=${quantityInput.placeholder} required>
                    </td>

                    <td class="form-row">
                        <a href="#" onclick="out(this.parentNode.parentNode)" id="out">Delete</a>
                    </td>`;

    let tr = document.createElement("tr");
    tr.innerHTML = newField;

    body.appendChild(tr);
    e.style.maxHeight = e.scrollHeight + "px";
}


function addAnotherNC(e) {
    let inputsCount = e.querySelectorAll("tr").length;
    inputsCount = inputsCount + 1;
    let num = inputsCount;
    // fieldNumber = fieldNumber + 1;
    // let num = fieldNumber;
    let body = (e.childNodes[1].childNodes[1]);

    let newField = `<td class="form-row">
                        <input type="text" id="panel" name="production[notClean][${num}][panel]" placeholder=${panelInput.placeholder} required onkeyup="validatePanelName(event)">
                    </td>

                    <td class="form-row">
                        <input type="number" min="0" id="length" name="production[notClean][${num}][length]" placeholder=${quantityInput.placeholder} required>
                    </td>

                    <td class="form-row">
                        <a href="#" onclick="out(this.parentNode.parentNode)" id="out">Delete</a>
                    </td>`;

    let tr = document.createElement("tr");
    tr.innerHTML = newField;

    body.appendChild(tr);
    e.style.maxHeight = e.scrollHeight + "px";
}


function addAnotherLHD(e) {
    let inputsCount = e.querySelectorAll("tr").length;
    inputsCount = inputsCount + 1;
    let num = inputsCount;

    const options = document.getElementById("LHDnumber").getElementsByTagName("option");
	let stringOpts = "";
	for (let i = 0; i < options.length; i++) {
		stringOpts = stringOpts + `<option value=${options[i].value}>${options[i].value}</option>`;
	}
    // console.log(stringOpts)
    // fieldNumber = fieldNumber + 1;
    // let num = fieldNumber;
    let body = (e.childNodes[1].childNodes[1]);

    let newField = `<td class="form-row">
                        <input type="number" min="0" id="coyNumber" name="production[LHD][${num}][coyNumber]" placeholder=${coyNumber.placeholder} required>
                    </td>

                    <td class="form-row">
                        <select name="production[LHD][${num}][LHDnumber]" id="LHDnumber" class="used-LHD" oninput="getAllProductionTMMs(this)" required>
                            ${stringOpts}
                        </select>
                    </td>

                    <td class="form-row">
                        <input type="number" min="0" id="LHDbuckets" name="production[LHD][${num}][buckets]" placeholder=${buckets.placeholder} required>
                    </td>

                    <td class="form-row">
                        <a href="#" onclick="out(this.parentNode.parentNode)" id="out">Delete</a>
                    </td>`;

    let tr = document.createElement("tr");
    tr.innerHTML = newField;

    body.appendChild(tr);
    e.style.maxHeight = e.scrollHeight + "px";
}

// Get all machines and then paste them the fleet perfomace schedule
function getAllProductionTMMs (yona){
    const contentDiv = document.getElementById("fleet-performance-content")

    // Used bolters - id = bolter
    const usedBolters = [];

    // Used drill rigs - id = drillRig
    const usedDrillRigs = [];

    // Used LHDs - id = LHDnumber
    const usedLHDs = [];
    
    const bolters = document.getElementsByClassName("used-bolter")
    const drillRigs = document.getElementsByClassName("used-drill-rig")
    const LHDs = document.getElementsByClassName("used-LHD")
    
    // Get the lengths of each category
    const boltersLength = bolters.length
    const drillRigsLength = drillRigs.length
    const LHDsLength = LHDs.length

    
    for(let i = 0; i < boltersLength && bolters[0].value !== ""; i++){
        if(usedBolters.indexOf(bolters[i].value) === -1){
            usedBolters.push(bolters[i].value);
        }
    }
    
    
    for (let i = 0; i < drillRigsLength && drillRigs[0].value !== ""; i++) {
		if (usedDrillRigs.indexOf(drillRigs[i].value) === -1) {
			usedDrillRigs.push(drillRigs[i].value);
		}
	}
    
    
    for (let i = 0; i < LHDsLength && LHDs[0].value !== ""; i++) {
		if (usedLHDs.indexOf(LHDs[i].value) === -1) {
			usedLHDs.push(LHDs[i].value);
		}
	}

    
    if (usedBolters.length > 0 && yona.id === "bolter") {
		getTable4Bolters(contentDiv, usedBolters);
	}

    
    if (usedDrillRigs.length > 0 && yona.id === "drillRig") {
		getTable4DrillRigs(contentDiv, usedDrillRigs);
	}


    if (usedLHDs.length > 0 && yona.id === "LHDnumber") {
		getTable4LHDs(contentDiv, usedLHDs);
	}
}

function getTable4LHDs(div, arr){
	const tableLHDs = document.getElementById("LHD-performance");
	arr.forEach((LHD, i) => {
		if (i === 0) {
			tableLHDs.innerHTML = "";
		}

		const row1 = tableLHDs.insertRow(0);
		row1.setAttribute("class", "form-row");

		const cell11 = row1.insertCell(0);
		const cell12 = row1.insertCell(1);
		cell11.setAttribute("class", "form-row");
		cell12.setAttribute("class", "form-row");
        const input = `<input type="text" name="production[fleetHrs][LHDs][${i}][name]" value=${arr[i]} required readonly hidden>`;
		cell11.innerHTML = `<strong>${arr[i]}</strong>`;
        cell12.innerHTML = input;

		const row2 = tableLHDs.insertRow(1);
		row2.setAttribute("class", "form-row");

		const cell21 = row2.insertCell(0);
		cell21.setAttribute("class", "form-row");

		const cell31 = row2.insertCell(1);
		cell31.setAttribute("class", "form-row");
		cell21.innerHTML = `<label style="display:block;" for=""><small>Start</small></label>
                            <input type="number" min="0" step="0.1" name="production[fleetHrs][LHDs][${i}][engine]" placeholder="engine" required>`;
		cell31.innerHTML = `<label style="display:block;" for=""><small>End</small></label>
                            <input type="number" min="0" step="0.1" name="production[fleetHrs][LHDs][${i}][engine]" placeholder="engine" required>`;
	});

    // Increase the visible height of the div housing this newly added hour meter inputs
	div.style.maxHeight = div.scrollHeight + "px";
}

function getTable4DrillRigs(div, arr) {
	const tableRigs = document.getElementById("rig-performance");
	arr.forEach((rig, i) => {
		if (i === 0) {
			tableRigs.innerHTML = "";
		}
		// Craete first row
		const row1 = tableRigs.insertRow(0);
		row1.setAttribute("class", "form-row");

		// Insert the the first <td> in the first row - should have only 1
		const cell11 = row1.insertCell(0);
        const cell12 = row1.insertCell(1);
        const input = `<input type="text" name="production[fleetHrs][drillRigs][${i}][name]" value=${arr[i]} required readonly hidden>`;
		cell11.setAttribute("class", "form-row");
        cell12.setAttribute("class", "form-row");
		cell11.innerHTML = `<strong>${arr[i]}</strong>`;
        cell12.innerHTML = input;

		// Create second row
		const row2 = tableRigs.insertRow(1);
		row2.setAttribute("class", "form-row");

		// Create first <td> of second row
		const cell21 = row2.insertCell(0);
		cell21.setAttribute("class", "form-row");
		cell21.innerHTML = `<label style="display:block;" for=""><small>Start</small></label>
                            <input type="number" min="0" step="0.1" name="production[fleetHrs][drillRigs][${i}][engine]" placeholder="engine" required>`;

		// Create second <td> of second row
		const cell22 = row2.insertCell(1);
		cell22.setAttribute("class", "form-row");
		cell22.innerHTML = `<label style="display:block;" for=""><small>End</small></label>
                            <input type="number" min="0" step="0.1" name="production[fleetHrs][drillRigs][${i}][engine]" placeholder="engine" required>`;

		// Create third row
		const row3 = tableRigs.insertRow(2);
		row3.setAttribute("class", "form-row");

		// Create first <td> of third row
		const cell31 = row3.insertCell(0);
		cell31.setAttribute("class", "form-row");
		cell31.innerHTML = `<label style="display:block;" for=""><small>Start</small></label>
                            <input type="number" min="0" step="0.1" name="production[fleetHrs][drillRigs][${i}][percussion]" placeholder="percussion" required>`;

		// Create second <td> of third row
		const cell32 = row3.insertCell(1);
		cell32.setAttribute("class", "form-row");
		cell32.innerHTML = `<label style="display:block;" for=""><small>End</small></label>
                            <input type="number" min="0" step="0.1" name="production[fleetHrs][drillRigs][${i}][percussion]" placeholder="percussion" required>`;

		// Create fourth row
		const row4 = tableRigs.insertRow(3);
		row2.setAttribute("class", "form-row");

		// Create first <td> of fourth row
		const cell41 = row4.insertCell(0);
		cell41.setAttribute("class", "form-row");
		cell41.innerHTML = `<label style="display:block;" for=""><small>Start</small></label>
                            <input type="number" min="0" step="0.1" name="production[fleetHrs][drillRigs][${i}][electrical]" placeholder="electrical" required>`;

		// Create second <td> of fourth row
		const cell42 = row4.insertCell(1);
		cell42.setAttribute("class", "form-row");
		cell42.innerHTML = `<label style="display:block;" for=""><small>End</small></label>
                            <input type="number" min="0" step="0.1" name="production[fleetHrs][drillRigs][${i}][electrical]" placeholder="electrical" required>`;
	});

	// Increase the visible height of the div housing this newly added hour meter inputs
	div.style.maxHeight = div.scrollHeight + "px";
}


function getTable4Bolters(div, arr) {
	const tableBolters = document.getElementById("bolters-performance");
	arr.forEach((rig, i) => {
		if (i === 0) {
			tableBolters.innerHTML = "";
		}

		// Craete first row
		const row1 = tableBolters.insertRow(0);
		row1.setAttribute("class", "form-row");

		// Insert the the first <td> in the first row - should have only 1
		const cell11 = row1.insertCell(0);
        const cell12 = row1.insertCell(1);
        const input = `<input type="text" name="production[fleetHrs][bolters][${i}][name]" value=${arr[i]} required readonly hidden>`;
		cell11.setAttribute("class", "form-row");
        cell12.setAttribute("class", "form-row");
		cell11.innerHTML = `<strong>${arr[i]}</strong>`;
        cell12.innerHTML = input;

		// Create second row
		const row2 = tableBolters.insertRow(1);
		row2.setAttribute("class", "form-row");

		// Create first <td> of second row
		const cell21 = row2.insertCell(0);
		cell21.setAttribute("class", "form-row");
		cell21.innerHTML = `<label style="display:block;" for=""><small>Start</small></label>
                            <input type="number" min="0" step="0.1" name="production[fleetHrs][bolters][${i}][engine]" placeholder="engine" required>`;

		// Create second <td> of second row
		const cell22 = row2.insertCell(1);
		cell22.setAttribute("class", "form-row");
		cell22.innerHTML = `<label style="display:block;" for=""><small>End</small></label>
                            <input type="number" min="0" step="0.1" name="production[fleetHrs][bolters][${i}][engine]" placeholder="engine" required>`;

		// Create third row
		const row3 = tableBolters.insertRow(2);
		row3.setAttribute("class", "form-row");

		// Create first <td> of third row
		const cell31 = row3.insertCell(0);
		cell31.setAttribute("class", "form-row");
		cell31.innerHTML = `<label style="display:block;" for=""><small>Start</small></label>
                            <input type="number" min="0" step="0.1" name="production[fleetHrs][bolters][${i}][drilling]" placeholder="drilling" required>`;

		// Create second <td> of third row
		const cell32 = row3.insertCell(1);
		cell32.setAttribute("class", "form-row");
		cell32.innerHTML = `<label style="display:block;" for=""><small>End</small></label>
                            <input type="number" min="0" step="0.1" name="production[fleetHrs][bolters][${i}][drilling]" placeholder="drilling" required>`;

		// Create fourth row
		const row4 = tableBolters.insertRow(3);
		row2.setAttribute("class", "form-row");

		// Create first <td> of fourth row
		const cell41 = row4.insertCell(0);
		cell41.setAttribute("class", "form-row");
		cell41.innerHTML = `<label style="display:block;" for=""><small>Start</small></label>
                            <input type="number" min="0" step="0.1" name="production[fleetHrs][bolters][${i}][electrical]" placeholder="electrical" required>`;

		// Create second <td> of fourth row
		const cell42 = row4.insertCell(1);
		cell42.setAttribute("class", "form-row");
		cell42.innerHTML = `<label style="display:block;" for=""><small>End</small></label>
                            <input type="number" min="0" step="0.1" name="production[fleetHrs][bolters][${i}][electrical]" placeholder="electrical" required>`;
	});

	// Increase the visible height of the div housing this newly added hour meter inputs
	div.style.maxHeight = div.scrollHeight + "px";
}



//======Making sure that panel name is all upper case and no spaces exist in between======
const newForm = document.getElementById("new-production")
if(newForm){
    // console.log(true)
    const allPanels = newForm.querySelectorAll("#panel")
    allPanels.forEach(p => p.setAttribute("onkeyup", "validatePanelName(event)"))
} else {
    // console.log(false)
}

function validatePanelName(e) {
  const newValue = e.target.value.toUpperCase().replace(/\s+/g, "");
  e.target.value = newValue;
}

// ================solution Showing Infomation selectively=======
// filter("combine")
let chartData;
function filter(c) {
    if(c === "blast-progs" || c === "charts"){
        const ronny = document.getElementById("filterDiv");
        const ramushu = [...ronny.children];
        ramushu.forEach((e) => e.disabled = true);
        ronny.style.display = "none";
    }

    if(c === "day" || c === "night"){
        const ronny = document.getElementById("filterDiv");
        const ramushu = [...ronny.children];
        ramushu.forEach((e, i) => {
            if(i !== 2){
                e.disabled = false;
            }
        });
        ronny.style.display = "block";
    }

    const all = document.getElementsByClassName("filterDiv");

    // Add the "show" class (display:block) to the filtered elements, and remove the "show" class from the elements that are not selected
    for (let i = 0; i < all.length; i++) {
        hideItem(all[i], "show");
        if (all[i].className.indexOf(c) > -1) {
            showItem(all[i], "show")
        };
    }
}

// Show filtered element (div/section)
function showItem(element, name) {
    const arr1 = element.className.split(" ");
    const arr2 = name.split(" ");
    for (let i = 0; i < arr2.length; i++) {
        if (arr1.indexOf(arr2[i]) == -1) {
            element.className += " " + arr2[i];
        }
    }
}

// Hide elements (div/section) that are not selected
function hideItem(element, name) {
    const arr1 = element.className.split(" ");
    const arr2 = name.split(" ");
    for (let i = 0; i < arr2.length; i++) {
        while (arr1.indexOf(arr2[i]) > -1) {
            arr1.splice(arr1.indexOf(arr2[i]), 1);
        }
    }
    element.className = arr1.join(" ");
}

// Add active class to the current control button (highlight it)
if (document.getElementById("myBtnContainer")) {
    const btnContainer = document.getElementById("myBtnContainer");
    const btns = btnContainer.getElementsByClassName("btn");
    for (let i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", function () {
            const current = document.getElementsByClassName("selected");
            current[0].className = current[0].className.replace(" selected", "");
            this.className += " selected";
        });
    }
}


// ===============date filtering=========
function dateChange(e) {
	// Getting the production data and parsing it from string to JSON object
	const production = document.getElementById("DB").innerText;
	const parsedProduction = JSON.parse(production);

    // Filtering production data by selected MO and section
    const MOandSectionProduction = fileterByMOandSections(e);

	// Getting the date that the user specified
    const selectedDate = document.getElementById("dateFilter").value
    console.log(selectedDate)

	// Creating next day so the the selected date
	const tomorrow = new Date(selectedDate);
	tomorrow.setDate(tomorrow.getDate() + 1);

	// This is a div where tables will be displayed in it
	let main = document.getElementById("tables");
	main.innerHTML = "";

	let prodFiltered = MOandSectionProduction.filter((prod) => moment(prod.created).format("YYYY-MM-DD") === selectedDate);
	let prodFilteredNight = MOandSectionProduction.filter((prod) => moment(prod.created).format("YYYY-MM-DD") === moment(tomorrow).format("YYYY-MM-DD"));

	// Sorting production data by section in ascending order
	prodFiltered.sort((a, b) => {
		if (a.section.name > b.section.name) {
			return 1;
		} else {
			return -1;
		}
	});

	// Filtering only day shift data from the production array
	const dayshift = prodFiltered.filter((prod) => prod.general[0].shift === "morning");

	// Filtering only night shift data from the production array
	const backshift = prodFilteredNight.filter((prod) => prod.general[0].shift === "backshift");

    // Creating tables to be pushed into the main div/container
	const content = `
                    <table id="day-shift" class="filterDiv day">
                        <thead>
                            <tr>

                            </tr>
                            <tr>
                                <th>Day</th>
                                <th>Blasted (m)</th>
                                <th>Cleaned (m)</th>
                                <th>Supported (m)</th>
                                <th>Drilled (m)</th>
                                <th>Prep'd (m)</th>
                                <th>Not Cleaned (m)</th>
                                <th>LHDs</th>
                            </tr>
                        </thead>
                        <tbody>
                      ${dayshift
							.map(function (e) {
								return (
									"<tr><td><a href='/sections/" +
									e.section.id +
									"/production/" +
									e._id +
									"'>" +
									e.section.name +
									"</a></td><td>" +
									e.blast.map((sub1) => sub1.length).reduce((i, j) => i + j, 0) +
									"</td><td>" +
									e.clean.map((sub1) => sub1.length).reduce((i, j) => i + j, 0) +
									"</td><td>" +
									e.support.map((sub1) => sub1.length).reduce((i, j) => i + j, 0) +
									"</td><td>" +
									e.drill.map((sub1) => sub1.length).reduce((i, j) => i + j, 0) +
									"</td><td>" +
									e.prep.map((sub1) => sub1.length).reduce((i, j) => i + j, 0) +
									"</td><td>" +
									e.notClean.map((sub1) => sub1.length).reduce((i, j) => i + j, 0) +
									"</td><td>" +
									e.LHD.length +
									"</td></tr>"
								);
							})
							.join("")}


                            <tr>
                                <th>Totals</th>
                                <td>
                                    ${dayshift
										.map((b) => b.blast)
										.map((sub1) => sub1.map((sub2) => sub2.length).reduce((i, j) => i + j))
										.reduce((x, y) => x + y, 0)}
                                </td>
                                <td>
                                    ${dayshift
										.map((b) => b.clean)
										.map((sub1) => sub1.map((sub2) => sub2.length).reduce((i, j) => i + j, 0))
										.reduce((x, y) => x + y, 0)}
                                </td>
                                <td>
                                    ${dayshift
										.map((b) => b.support)
										.map((sub1) => sub1.map((sub2) => sub2.length).reduce((i, j) => i + j, 0))
										.reduce((x, y) => x + y, 0)}
                                </td>
                                <td>
                                    ${dayshift
										.map((b) => b.drill)
										.map((sub1) => sub1.map((sub2) => sub2.length).reduce((i, j) => i + j, 0))
										.reduce((x, y) => x + y, 0)}
                                </td>
                                <td>
                                    ${dayshift
										.map((b) => b.prep)
										.map((sub1) => sub1.map((sub2) => sub2.length).reduce((i, j) => i + j, 0))
										.reduce((x, y) => x + y, 0)}
                                </td>
                                <td>
                                    ${dayshift
										.map((b) => b.notClean)
										.map((sub1) => sub1.map((sub2) => sub2.length).reduce((i, j) => i + j, 0))
										.reduce((x, y) => x + y, 0)}
                                </td>
                                <td>
                                    ${dayshift
										.map((b) => b.LHD)
										.map((sub1) => sub1.length)
										.reduce((i, j) => i + j, 0)}
                                </td>
                            </tr>
                        </tbody >
                    </table>
                    <br>
                    <table id="night-shift" class="filterDiv night">
                        <thead>
                            <tr>

                            </tr>
                            <tr>
                                <th>Night</th>
                                <th>Cleaned (m)</th>
                                <th>Supported (m)</th>
                                <th>Drilled (m)</th>
                                <th>Prep'd (m)</th>
                                <th>Not Cleaned (m)</th>
                                <th>LHDs</th>
                            </tr>
                        </thead>
                        <tbody>
                        ${backshift
                            .map(function (e) {
                                return (
                                    "<tr><td><a href='/sections/" +
                                    e.section.id +
                                    "/production/" +
                                    e._id +
                                    "'>" +
                                    e.section.name +
                                    "</a></td><td>" +
                                    e.clean.map((sub1) => sub1.length).reduce((i, j) => i + j, 0) +
                                    "</td><td>" +
                                    e.support.map((sub1) => sub1.length).reduce((i, j) => i + j, 0) +
                                    "</td><td>" +
                                    e.drill.map((sub1) => sub1.length).reduce((i, j) => i + j, 0) +
                                    "</td><td>" +
                                    e.prep.map((sub1) => sub1.length).reduce((i, j) => i + j, 0) +
                                    "</td><td>" +
                                    e.notClean.map((sub1) => sub1.length).reduce((i, j) => i + j, 0) +
                                    "</td><td>" +
                                    e.LHD.length +
                                    "</td></tr>"
                                );
                            })
                            .join("")}

                            <tr>
                                <th>Totals</th>
                                
                                <td>
                                    ${backshift
                                        .map((b) => b.clean)
                                        .map((sub1) => sub1.map((sub2) => sub2.length).reduce((i, j) => i + j, 0))
                                        .reduce((x, y) => x + y, 0)}
                                </td>
                                <td>
                                    ${backshift
                                        .map((b) => b.support)
                                        .map((sub1) => sub1.map((sub2) => sub2.length).reduce((i, j) => i + j, 0))
                                        .reduce((x, y) => x + y, 0)}
                                </td>
                                <td>
                                    ${backshift
                                        .map((b) => b.drill)
                                        .map((sub1) => sub1.map((sub2) => sub2.length).reduce((i, j) => i + j, 0))
                                        .reduce((x, y) => x + y, 0)}
                                </td>
                                <td>
                                    ${backshift
                                        .map((b) => b.prep)
                                        .map((sub1) => sub1.map((sub2) => sub2.length).reduce((i, j) => i + j, 0))
                                        .reduce((x, y) => x + y, 0)}
                                </td>
                                <td>
                                    ${backshift
                                        .map((b) => b.notClean)
                                        .map((sub1) => sub1.map((sub2) => sub2.length).reduce((i, j) => i + j, 0))
                                        .reduce((x, y) => x + y, 0)}
                                </td>
                                <td>
                                    ${backshift
                                        .map((b) => b.LHD)
                                        .map((sub1) => sub1.length)
                                        .reduce((i, j) => i + j, 0)}
                                </td>
                            </tr>
                        </tbody >
                    </table>`;

	const all = document.createElement("section");
	all.innerHTML = content;
	all.setAttribute("id", "wrapper");
	main.appendChild(all);
	document.getElementById("morning").click();
}


function fileterByMOandSections(e){
    console.log("This function runs")
	// Get all sections and parse them to a jSON object
	const sections = document.getElementById("DBS").innerText;
	const parsedSections = JSON.parse(sections);

	// Get selected MO and section
	const selectedSection = document.getElementById("sectionFilter").value;

	// Selected MO
	const selectedMO = document.getElementById("moFilter").value;

	// Get sections that belong to the
	const selectedMOSections = parsedSections.filter((e) => e.mineOverseer.name === selectedMO);
	const selectedMOSections2 = selectedMOSections.map((e) => e.name);

	const production = document.getElementById("DB").innerText;
	const parsedProduction = JSON.parse(production);

    const sectionsSelectTag = document.getElementById("sectionFilter");

	let MOproductions = parsedProduction;

	// What to do if MO select tag is changed
	if (e.id === "moFilter" || e.id === "dateFilter") {

		if (selectedMO === "allMO") {
			sectionsSelectTag.innerHTML = "<option value='allSections' selected>--section--</option>";
			sectionsSelectTag.disabled = true;
			return MOproductions;
		}

		// Clear out the original MOproductions array
		MOproductions = [];

        // Re-construct the MOproductions array with filtered data by MO
		parsedProduction.forEach((e) => {
			if (selectedMOSections2.indexOf(e.section.name) > -1) {
				MOproductions.push(e);
			}
		});

        // Enabling the filtering by section
        sectionsSelectTag.disabled = false;

        // Sections available are only those beloging to the selected mine overseer
		let stringToAppend = "";
		selectedMOSections2.forEach((e, i, arr) => {
			if (i === 0 && arr.length !== 1) {
				const option = "<option value='allSections' selected>--section--</option>";
				const option2 = `<option value='${e}'>${e}</option>`;
				stringToAppend += (option + option2);
			} else {
				const option = `<option value="${e}">${e}</option>`;
				stringToAppend += option;
			}
		});

		sectionsSelectTag.innerHTML = stringToAppend;
	}

	// What to do if section select tag is changed
	if (e.id === "sectionFilter" || e.id === "dateFilter") {
		const selectedSection = document.getElementById("sectionFilter").value;

		// By this stage
		const sectionsFiltered = parsedProduction.filter((e) => e.section.name === selectedSection);

		// Clear out the original MOproductions array
		MOproductions = [];

		if (selectedSection === "allSections") {
			parsedProduction.forEach((e) => {
				if (selectedMOSections2.indexOf(e.section.name) > -1) {
					MOproductions.push(e);
				}
			});
			return MOproductions;
		}

		sectionsFiltered.forEach((e) => {
			if (selectedMOSections2.indexOf(e.section.name) > -1) {
				MOproductions.push(e);
			}
		});
	}

	return MOproductions;
}



// **************************************************************************end***************************************************
// Selecting date range for blast 
let today = new Date();
const todayHours = today.getHours().toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
const todayMinutes = today.getMinutes().toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
let todayDay = today.getDate();
let todayMonth = today.getMonth() + 1;
let todayYear = today.getFullYear();

if (todayMonth <= 9) {
    todayMonth = "0" + todayMonth;
}

if (todayDay <= 9) {
    todayDay = "0" + todayDay;
}

let startDateDay = "01"
let htmlStartDate = `${todayYear}-${todayMonth}-${startDateDay}`
let htmlDate = `${todayYear}-${todayMonth}-${todayDay}`;

if(document.getElementById("tableDate")){
    document.getElementById("tableDate").innerHTML = htmlDate.slice(8) + "/" + htmlDate.slice(5, 7) + "/" + htmlDate.slice(0, 4)
}

if (document.getElementById("endDate") && document.getElementById("startDate")) {
    document.getElementById("endDate").value = htmlDate
    document.getElementById("endDate").max = htmlDate
    document.getElementById("startDate").value = htmlStartDate
    document.getElementById("startDate").max = htmlDate
}

if(document.getElementById("dateFilter")){
    document.getElementById("dateFilter").max = htmlDate
}

if(document.getElementById("startDate")){
    // document.getElementById("startDate").value = htmlDate
    document.getElementById("startDate").value = htmlStartDate
    document.getElementById("startDate").max = htmlDate
}


if(document.getElementById("declaredDate")){
    document.getElementById("declaredDate").max = htmlDate + "T23:59:59"
}


// Setting default date for breakdowns index
if (document.getElementById("breakdown-date")) {
	document.getElementById("breakdown-date").value = htmlDate;
	document.getElementById("breakdown-date").max = htmlDate;
}


if (document.getElementById("dateFilter")) {
    document.getElementById("dateFilter").value = htmlDate
}


if (document.getElementById("dateFilter")) {
    document.getElementById("dateFilter").oninput()
}


function blastFilter(e) {

    // Getting production data and converts it into a JSON object
    const production = document.getElementById("DB").innerText;
	const parsedProduction = JSON.parse(production);

    const endDate = document.getElementById("endDate").value;
    const startDate = document.getElementById("startDate").value;

    if (endDate < startDate) {
        console.log(today)
        e.target.value = ""
        document.getElementById("tableDate").innerHTML = endDate.slice(8) + "/" + endDate.slice(5, 7) + "/" + endDate.slice(0, 4)
        document.getElementById("endDate").value = moment(today).format('YYYY-MM-DD');
        return alert("Start date cannot be greater than end date. Please re-select your date range")
    }

    const filteredByDate = parsedProduction.filter(prod1 => { return moment(prod1.created).format('YYYY-MM-DD') >= startDate && moment(prod1.created).format('YYYY-MM-DD') <= endDate}).filter(a => a.general[0].shift === "morning")
    const todayProduction = parsedProduction.filter(prod1 => { return moment(prod1.created).format('YYYY-MM-DD') == endDate }).filter(a => a.general[0].shift === "morning")
    todayProduction.sort((a, b) => {
        if (a.section.name > b.section.name){
            return 1
        } else {
            return -1
        }
    })
    // let todayROM = roms.filter(roms1 => { return moment(roms1.created).format('YYYY-MM-DD') == endDate})
    // let todayPlantFeed = feeds.filter(feeds1 => { return moment(feeds1.created).format('YYYY-MM-DD') == endDate})
    const actualTotalBudget = todayProduction.map(b => b.section.budget).reduce((i, j) => i + j, 0)
    const actualTotalForecast = todayProduction.map(b => b.section.forecast).reduce((i, j) => i + j, 0)

    const actualTotalBlast2 = todayProduction.map(b => b.blast).map(sub1 => sub1.map(sub2 => sub2.length).reduce((i, j) => i + j, 0))
    const actualTotalAdvance = todayProduction.map(b => b.section.plannedAdvance)
    const actualBlastTotal = actualTotalBlast2.reduce((r, a, i) => r + a * actualTotalAdvance[i], 0)


    // const actualFeed = todayPlantFeed.map(b => b.actual).join("")
    // const forecastFeed = todayPlantFeed.map(b => b.forecast).join("")
    // const budgetFeed = todayPlantFeed.map(b => b.forecast).join("")
    // const actualROM = todayROM.map(b => b.actual).join("")
    // const forecastROM = todayROM.map(b => b.forecast).join("")
    // const budgetROM = todayROM.map(b => b.budget).join("")
    

    // const actualFeedProg = feeds.map(feed => feed.actual).reduce((a, b) => a + b, 0)
    // const actualROMProg = roms.map(rom => rom.actual).reduce((a, b) => a + b, 0)
    // const forecastFeedProg = feeds.map(feed => feed.forecast).reduce((a, b) => a + b, 0)
    // const forecastROMProg = roms.map(rom => rom.forecast).reduce((a, b) => a + b, 0)
    // const budegtROMProg = roms.map(rom => rom.budget).reduce((a, b) => a + b, 0)
    // const budgetFeedProg = feeds.map(feed => feed.budget).reduce((a, b) => a + b, 0)

    varianceTotals = Number(actualBlastTotal) - Number(actualTotalForecast)
    // varianceROM = Number(actualROM) - Number(forecastROM)
    // variancePlantFeed = Number(actualFeed) - Number(forecastFeed)
    // varianceProgFeed = Number(actualFeedProg) - Number(forecastFeedProg)
    // varianceProgROM = Number(actualROMProg) - Number(forecastROMProg)

    // const variancesArray = [varianceProgFeed, varianceProgROM]

    // for(let i = 0; i < variancesArray.length; ++i){
    //     if(Math.sign(variancesArray[i] === -1)){
    //         variancesArray[i] = `(${(variancesArray[i] * -1).toFixed(1)})`
    //     } else {
    //         variancesArray[i] = variancesArray[i].toFixed(1)
    //     }
    // }

    if (Math.sign(varianceTotals) === -1) { 
        varianceTotals = `(${(varianceTotals * -1).toFixed(1)})`
    } else {
        varianceTotals = varianceTotals.toFixed(1) 
    }

    // if (Math.sign(varianceROM) === -1) { 
    //     varianceROM = `(${(varianceROM * -1).toFixed(1)})`
    // } else {
    //     varianceROM = varianceROM.toFixed(1) 
    // }

    // if (Math.sign(variancePlantFeed) === -1) { 
    //     variancePlantFeed = `(${(variancePlantFeed * -1).toFixed(1)})`
    // } else {
    //     variancePlantFeed = variancePlantFeed.toFixed(1) 
    // }

    budgetProgTotal = filteredByDate.map(b2 => b2.section.budget).reduce((b3, b4) => b3 + b4, 0)
    forecastProgTotal = filteredByDate.map(b2 => b2.section.forecast).reduce((b3, b4) => b3 + b4, 0)
    const advances = filteredByDate.map(b => b.section.plannedAdvance)
    const blasts = filteredByDate.map(b5 => b5.blast.map(sub1 => sub1.length).reduce((i, j) => i + j))
    const squareMetersProgTotal = advances.reduce((r, a, i) => r + a * blasts[i], 0)
    varianceProgTotal = squareMetersProgTotal - forecastProgTotal

    if (Math.sign(varianceProgTotal) === -1) {
        varianceProgTotal = `(${(varianceProgTotal * -1).toFixed(1)})`
    } else {
        varianceProgTotal = varianceProgTotal.toFixed(1)
    }

    const numRows = todayProduction.length + 3

    document.getElementById("progressives").innerHTML = "";
    const content = `
                    <tbody>
                        <tr>
                            <th colspan="2"><span id="tableDate" >18-Jan</span></th>
                            <th colspan="6">Daily</th>
                            <th rowspan="${numRows}"></th>
                            <th colspan="5">Month to date</th>
                        </tr>
        

                        <tr>
                            <th colspan="2">Sections</th>
                            <th>Budget</th>
                            <th>Forecast</th>
                            <th>Actual</th>
                            <th>Variance</th>
                            <th></th>
                            <th>Comments</th>
                            
                            <th>Budget</th>
                            <th>Forecast</th>
                            <th>Actual</th>
                            <th>Variance</th>
                            <th></th>
                        </tr>

                        ${todayProduction.map(b => {
                            let variance = (b.blast.map(sub1 => sub1.length).reduce((i, j) => i + j) * (b.section.plannedAdvance)).toFixed(1) - b.section.forecast
                            let actual = (b.blast.map(sub1 => sub1.length).reduce((i, j) => i + j) * (b.section.plannedAdvance)).toFixed(1)
                            if (Math.sign(variance) === -1) {
                                variance = `(${(variance * -1).toFixed(1)})`
                            } else {
                                variance = variance.toFixed(1)
                            }
                            let sections = filteredByDate.filter(b1 => b1.section.name === b.section.name)
                            budgetProg = sections.map(b2 => b2.section.budget).reduce((b3, b4) => b3 + b4, 0)
                            forecastProg = sections.map(b2 => b2.section.forecast).reduce((b3, b4) => b3 + b4, 0)

                            // let actual2 = sections.map(b5 => b5.blast.map(sub1 => sub1.length).reduce((i, j) => i + j, 0)).reduce((b6, b7) => b6 + b7, 0).toFixed(1)
                            let actual21 = sections.map(b5 => b5.blast.map(sub1 => sub1.length).reduce((i, j) => i + j, 0)*b5.section.plannedAdvance).reduce((b6, b7) => b6 + b7, 0).toFixed(1)
                            // let advances = sections.map(b => b.section.plannedAdvance)
                            
                            
                            // let blasts = sections.map(b5 => b5.blast.map(sub1 => sub1.length).reduce((i, j) => i+j, 0))
                            
                            varianceProg = Number(actual21) - forecastProg

                            if (Math.sign(varianceProg) === -1) {
                                varianceProg = `(${(varianceProg * -1).toFixed(1)})`
                            } else {
                                varianceProg = varianceProg.toFixed(1)
                            }


                            return "<tr><th>" + b.section.name + "</th>" + "<th>m<sup>2</sup></th>" + "<td>" + b.section.budget.toFixed(1) + "</td>" + "<td>" + b.section.forecast.toFixed(1) + "</td>" + "<td>" + actual + "</td>" + "<td class=\"variance\" >" + variance + "</td>" + "<td class=\"smiley\">&#128577</td>" + "<td class=\"comments_cell\">" + b.general[0].comments + "</td>" + "<td>" + budgetProg.toFixed(1) + "</td>" + "<td>"+ forecastProg.toFixed(1) +"</td>" + "<td>" + actual21 +"</td>" + "<td class=\"variance\">"+ varianceProg +"</td>" + "<td>&#128577</td>" + "</tr>"
                        }).join("")}


                        <tr>
                            <th>Totals</th>
                            <th>m<sup>2</sup></th>
                            <th>
                                ${actualTotalBudget.toFixed(1)}
                            </th>
                            <th>
                                ${actualTotalForecast.toFixed(1)}
                            </th>
                            <th>
                                ${actualBlastTotal.toFixed(1)}
                            </th>
                            <th class="variance">
                                ${varianceTotals}
                            </th>
                            <td>&#128577</td>
                            <th>
                            </th>
                            <th>
                                ${budgetProgTotal.toFixed(1)}
                            </th>
                            <th>
                                ${forecastProgTotal.toFixed(1)}
                            </th>
                            <th>
                                ${squareMetersProgTotal.toFixed(1)}
                            </th>
                            <th class="variance">
                                ${varianceProgTotal}
                            </th>
                            <td>&#128577</td>
                        </tr>
                    </tbody>
                    
    
                `
    document.getElementById("progressives").innerHTML = content;
    document.getElementById("tableDate").innerHTML = endDate.slice(8) + "/" + endDate.slice(5, 7) + "/" + endDate.slice(0, 4)


    // **********Getting smileys to work**************
    const vari = document.getElementsByClassName("variance");
    for (let i = 0; i < vari.length; i++) {
        if (vari[i].textContent.indexOf("(") < 0) {
            vari[i].nextElementSibling.innerHTML = "&#128578";
            vari[i].nextElementSibling.style.backgroundColor = "green";
        } else {
            vari[i].nextElementSibling.innerHTML = "&#128577";
            vari[i].nextElementSibling.style.backgroundColor = "red";
            vari[i].style.color = "red";

        }
    }
}



if(document.getElementById("endDate") && document.getElementById("startDate")){
    document.getElementById("endDate").oninput();
}

// Making flash message disappear after few seconds
if(document.getElementById("flash")){
    setTimeout(()=> document.getElementById("flash").innerHTML = "", 10000)
}

// Changing the blast block based on which shift is selected
function shiftSelector(e) {
    const selectedShift = e.srcElement
    const comments = document.getElementById("comments")
    const commentsBox = document.getElementById("comments-box")
    const blastHeading = document.getElementById("blast-report-heading")
    const blastBody = document.getElementById("blast-report")
    const blastPanel = blastBody.querySelector("#panel")
    const blastLength = blastBody.querySelector("#length")

    const toBeRemoved = blastBody.getElementsByClassName("removedToggle")
    const count = toBeRemoved.length

    
    

    if(selectedShift.checked && selectedShift.id === "backshift"){
        blastPanel.required = false;
        blastPanel.value = null;
        blastLength.required = false;
        blastLength.value = null;
        comments.innerText = "Comments";
        commentsBox.required = false;


        if (toBeRemoved.length > 0) {
            for (let j = 0; j < count; j++) {
                console.log("Ronny")
                blastBody.querySelector(".removedToggle").remove();
           }
        }
         

        blastBody.style.display = "none";
        blastHeading.style.display = "none";
    }

    if(selectedShift.checked && selectedShift.id === "morning"){
        blastPanel.required = true;
        blastPanel.value = null;
        blastLength.required = true;
        blastLength.value = null;
        comments.innerText = "Target Not Achieved. Why?";
        commentsBox.required = true;
        
        if (toBeRemoved.length > 0) {
            for (let i = 0; i < count; i++) {
                blastBody.querySelector(".removedToggle").remove();
          }
        }

        blastBody.style.display = "block";
        blastHeading.style.display = "block";
    }
}



// Checking if whether target is achieved
let diva;
if(document.getElementById("blast-report")){
    diva = document.getElementById("blast-report")
    diva.addEventListener("click", checkCallAchieved)
}

function checkCallAchieved (e) {
    const faceLengths = diva.querySelectorAll("#length");
    const panelsBlastedLength = faceLengths.length;
    // const target = Number(document.getElementById("call").innerText)
    let target = 0;
    const productionShifts = JSON.parse(document.getElementById("productionShifts").innerText)
    const productionShifts1 = productionShifts.map(e => new Date(e).toDateString());
    const selectedDate = new Date().toDateString();
    // if(document.getElementById("startDate")){
    //     new Date(selectedDate = document.getElementById("startDate").value).toDateString();
    //     console.log("*********************YES*************")
    // }
    const index = productionShifts1.indexOf(selectedDate);
    console.log(selectedDate)
    if(productionShifts1[index] === selectedDate){
        target = Number(document.getElementById("call").innerText);
    }

    document.getElementById("target-number").innerText = target;

    let actual = 0;
    for (i = 0; i < panelsBlastedLength; i++) {
        actual = actual + Number(faceLengths[i].value)
    }

    if(actual >= target){
        document.getElementById("comments").innerText = "Comments"
        document.getElementById("comments-box").required = false
        return;
    }
    if(actual <= target){
        document.getElementById("comments").innerText = "Target Not Achieved. Why?"
        document.getElementById("comments-box").required = true
        return;
    }
}

const productionForm = document.querySelector(".new-production")
// const heading = document.querySelector("h2").innerText.includes("Edit")
// console.log(heading)

// if(heading && productionForm){
//     checkCallAchieved()
// }
if(productionForm){
    checkCallAchieved();
}


/*********************************************************TARP RED PANELS************************/
function redpanelFilter(e){
    const sections = document.getElementById("sections").innerText;
	const parsedSections = JSON.parse(sections);

    const selectedMO = document.getElementById("moFilter").value;
    const selectedMOSections = parsedSections.filter((e) => e.mineOverseer.name === selectedMO);
	const selectedMOSections2 = selectedMOSections.map((e) => e.name);

    const redpanels = document.getElementById("reds").innerText;
	const parsedRedpanels = JSON.parse(redpanels);

	const newReds = document.getElementById("newReds").innerText;
	const parsedNewReds = JSON.parse(newReds);


    if(e.id === "moFilter"){
        const totalLength = parsedNewReds.length + parsedRedpanels.length;
        document.getElementById("totalLength").innerText = totalLength;
        const tableAll = document.getElementById("tarp-red-tables");
        const sectionsSelectTag = document.getElementById("sectionFilter");
    
        tableAll.style.display = "none";
    
        if(selectedMO === "allMO"){
            tableAll.style.display = "flex";
            sectionsSelectTag.innerHTML = "<option value='allSections' selected>--section--</option>"
            sectionsSelectTag.disabled = true;
            const tableFiltered = document.getElementById("filtered-tarps");
            tableFiltered.innerText = "";
            return
        }
    
        const MOnewReds = []
        parsedNewReds.forEach(e => {
            if(selectedMOSections2.indexOf(e.section.name) > -1){
                MOnewReds.push(e)
            }
        })
    
        const MOreds = []
        parsedRedpanels.forEach((e) => {
            if (selectedMOSections2.indexOf(e.section.name) > -1) {
                MOreds.push(e);
            }
        });
    
        sectionsSelectTag.disabled = false;
        let stringToAppend = ""
        selectedMOSections2.forEach((e, i, arr) => {
            if(i === 0 && arr.length !== 1){
                const option = "<option value='allSections' selected>--section--</option>";
                const option2 = `<option value="${e}">${e}</option>`;
                stringToAppend += (option + option2);
            } else {
                const option =  `<option value="${e}">${e}</option>`
                stringToAppend += option
            }
        })
    
        sectionsSelectTag.innerHTML = stringToAppend;
    
        drawTables(MOnewReds, MOreds)
    }

    if(e.id === "sectionFilter"){
        const selectedSection = document.getElementById("sectionFilter").value;
        const newreds = parsedNewReds.filter(e => e.section.name === selectedSection)
        const reds = parsedRedpanels.filter(e => e.section.name === selectedSection)

        const MOreds = [];
        const MOnewReds = [];

        if (selectedSection === "allSections") {
            parsedNewReds.forEach((e) => {
				if (selectedMOSections2.indexOf(e.section.name) > -1) {
					MOnewReds.push(e);
				}
			});

            parsedRedpanels.forEach((e) => {
				if (selectedMOSections2.indexOf(e.section.name) > -1) {
					MOreds.push(e);
				}
			});

            drawTables(MOnewReds, MOreds);
			return;
		}

		newreds.forEach((e) => {
			if (selectedMOSections2.indexOf(e.section.name) > -1) {
				MOnewReds.push(e);
			}
		});

		reds.forEach((e) => {
			if (selectedMOSections2.indexOf(e.section.name) > -1) {
				MOreds.push(e);
			}
		});

		drawTables(MOnewReds, MOreds);
	}
}

// Constructing the TARP RED tables (new and in-progress)
function drawTables(newReds, reds){
    const totalLength = newReds.length + reds.length;
    document.getElementById("totalLength").innerText = totalLength;
    let newRedsRows = "";
    newReds.forEach(e => {
        const row = `<tr>
                        <td>
                            <a href="/newRedPanel/${e._id}">
                                ${e.panel}
                            </a>
                        </td>
                        <td>
                            ${e.section.name}
                        </td>
                        <td class="comments_cell">
                            ${e.triggers}
                        </td>
                        <td>
                            ${new Date(e.dateDeclared).toDateString()}
                        </td>
                        <td>
                            ${e.age}
                        </td>
                    </tr>`;
        newRedsRows += row;
    })
    const newRedsTable = `<table>
                            <colgroup>
                                <col style="background-color: grey; width: auto;" span="5">
                            </colgroup>
                            <tr>
                                <th colspan="5">
                                    ${newReds.length} Red Panels Awaiting Visits
                                </th>
                            </tr>
                            <tr>
                                <th>Panel</th>
                                <th>Section</th>
                                <th>Trigger(s)</th>
                                <th>Date Panel Declared</th>
                                <th>Age</th>
                            </tr>
                            ${newRedsRows}
    
                        </table>`;

    // const tableFiltered = document.getElementById("filtered-tarps");
    // tableFiltered.innerHTML = newRedsTable;

    let redsRows = "";
    reds.forEach(e => {
        const row = `<tr>
                        <td>
                            <a href="/redPanel/${e._id}">
                                ${e.panel}
                            </a>
                        </td>
                        <td>
                            ${e.section.name}
                        </td>
                        <td class="comments_cell">
                            ${e.trigger}
                        </td>
                        <td>
                            ${new Date(e.dateDeclared).toDateString()}
                        </td>
                        <td>
                            ${new Date(e.issueDate).toDateString()}
                        </td>
                        <td>
                            ${e.age}
                        </td>
                    </tr>`;
        redsRows += row;
    })
    const redsTable = `<table>
                            <colgroup>
                                <col style="background-color: grey; width: auto;" span="6">
                            </colgroup>
                            <tr>
                                <th colspan="6">
                                    ${reds.length} Red Panels Awaiting Visits
                                </th>
                            </tr>
                            <tr>
                                <th>Panel</th>
                                <th>Section</th>
                                <th>Trigger(s)</th>
                                <th>Date Panel Declared</th>
                                <th>Date Report Issued</th>
                                <th>Age</th>
                            </tr>
                            ${redsRows}
    
                        </table>`;

    const tableFiltered = document.getElementById("filtered-tarps");
    tableFiltered.innerHTML = newRedsTable + "<br>" + redsTable;
}



