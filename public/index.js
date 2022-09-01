console.time();
// let fieldNumber = 1;
// let panelInput = document.querySelector("#panel");
// let quantityInput = document.querySelector("#length");
// let boltsInput = document.querySelector("#bolts");
// let anchorsInput = document.querySelector("#anchors");
// let holesInput = document.querySelector("#holes");
// let coyNumber = document.querySelector("#coyNumber");
// let buckets = document.querySelector("#LHDbuckets");
// let gl = document.querySelector("#LHDnumber");
// let tbody = document.querySelector("tbody");

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
    const panelPlaceHolder = e.querySelector("#panel").placeholder;
    const lengthPlaceHolder = e.querySelector("#length").placeholder;

    let inputsCount = e.querySelectorAll("tr").length
    inputsCount = inputsCount + 1
    let num = inputsCount;

    let body = e.childNodes[1].childNodes[1];

    let newField = `<td class="form-row removeToggle">
                        <input type="text" id="panel" name="production[blast][${num}][panel]" placeholder=${panelPlaceHolder} required onkeyup="validatePanelName(event)">
                        </td>

                        <td class="form-row removeToggle">
                        <input type="number" min="0" id="length" name="production[blast][${num}][length]" placeholder=${lengthPlaceHolder} oninput="checkCallAchieved(event)" required>
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
    const panelPlaceHolder = e.querySelector("#panel").placeholder;
	const lengthPlaceHolder = e.querySelector("#length").placeholder;

    let inputsCount = e.querySelectorAll("tr").length;
    inputsCount = inputsCount + 1;
    let num = inputsCount;
    
    let body = (e.childNodes[1].childNodes[1]);

    let newField = `<td class="form-row">
                        <input type="text" id="panel" name="production[clean][${num}][panel]" placeholder=${panelPlaceHolder} required onkeyup="validatePanelName(event)">
                    </td>

                    <td class="form-row">
                        <input type="number" min="0" id="length" name="production[clean][${num}][length]" placeholder=${lengthPlaceHolder} required>
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
    const panelPlaceHolder = e.querySelector("#panel").placeholder;
	const lengthPlaceHolder = e.querySelector("#length").placeholder;
	const boltsPlaceHolder = e.querySelector("#bolts").placeholder;
	const anchorsPlaceHolder = e.querySelector("#anchors").placeholder;

    let inputsCount = e.querySelectorAll("tr").length;
    inputsCount = inputsCount + 1;
    let num = inputsCount;

    const options = document.getElementById("bolter").getElementsByTagName("option");
    let stringOpts = "";
    for(let i = 0; i < options.length; i++){
        stringOpts = stringOpts + `<option value=${options[i].value}>${options[i].value}</option>`;
    }

    let body = (e.childNodes[1].childNodes[1]);

    let newField = `<td class="form-row">
                        <input type="text" id="panel" name="production[support][${num}][panel]" placeholder=${panelPlaceHolder} required onkeyup="validatePanelName(event)">
                    </td>

                    <td class="form-row">
                        <input type="number" min="0" id="length" name="production[support][${num}][length]" placeholder=${lengthPlaceHolder} required>
                    </td>

                    <td class="form-row">
                        <input type="number" min="0" id="bolts" name="production[support][${num}][bolts]" placeholder=${boltsPlaceHolder} required>
                    </td>

                    <td class="form-row">
                        <input type="number" min="0" id="anchors" name="production[support][${num}][anchors]" placeholder=${anchorsPlaceHolder} required>
                    </td>

                    <td class="form-row">
                        <select name="production[support][${num}][machine]" id="bolter" class="used-bolter">
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
    const panelPlaceHolder = e.querySelector("#panel").placeholder;
	const lengthPlaceHolder = e.querySelector("#length").placeholder;
	const holesPlaceHolder = e.querySelector("#holes").placeholder;

    let inputsCount = e.querySelectorAll("tr").length;
    inputsCount = inputsCount + 1;
    let num = inputsCount;

    const options = document.getElementById("drillRig").getElementsByTagName("option");
	let stringOpts = "";
	for (let i = 0; i < options.length; i++) {
		stringOpts = stringOpts + `<option value=${options[i].value}>${options[i].value}</option>`;
	}

    let body = (e.childNodes[1].childNodes[1]);

    let newField = `<td class="form-row">
                        <input type="text" id="panel" name="production[drill][${num}][panel]" placeholder=${panelPlaceHolder} required onkeyup="validatePanelName(event)">
                    </td>

                    <td class="form-row">
                        <input type="number" min="0" id="length" name="production[drill][${num}][length]" placeholder=${lengthPlaceHolder} required>
                    </td>

                    <td class="form-row">
                        <input type="number" min="0" id="holes" name="production[drill][${num}][holes]" placeholder=${holesPlaceHolder} required>
                    </td>

                    <td class="form-row">
                        <select name="production[drill][${num}][drillRig]" id="drillRig" class="used-drill-rig"  required>
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
    const panelPlaceHolder = e.querySelector("#panel").placeholder;
	const lengthPlaceHolder = e.querySelector("#length").placeholder;

    let inputsCount = e.querySelectorAll("tr").length;
    inputsCount = inputsCount + 1;
    let num = inputsCount;
    let body = (e.childNodes[1].childNodes[1]);

    let newField = `<td class="form-row">
                        <input type="text" id="panel" name="production[prep][${num}][panel]" placeholder=${panelPlaceHolder} required onkeyup="validatePanelName(event)">
                    </td>

                    <td class="form-row">
                        <input type="number" min="0" id="length" name="production[prep][${num}][length]" placeholder=${lengthPlaceHolder} required>
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
    const panelPlaceHolder = e.querySelector("#panel").placeholder;
	const lengthPlaceHolder = e.querySelector("#length").placeholder;

    let inputsCount = e.querySelectorAll("tr").length;
    inputsCount = inputsCount + 1;
    let num = inputsCount;
    let body = (e.childNodes[1].childNodes[1]);

    let newField = `<td class="form-row">
                        <input type="text" id="panel" name="production[notClean][${num}][panel]" placeholder=${panelPlaceHolder} required onkeyup="validatePanelName(event)">
                    </td>

                    <td class="form-row">
                        <input type="number" min="0" id="length" name="production[notClean][${num}][length]" placeholder=${lengthPlaceHolder} required>
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
    const operatorPlaceHolder = e.querySelector("#coyNumber").placeholder;
	const bucketsPlaceHolder = e.querySelector("#LHDbuckets").placeholder;

    let inputsCount = e.querySelectorAll("tr").length;
    inputsCount = inputsCount + 1;
    let num = inputsCount;

    const options = document.getElementById("LHDnumber").getElementsByTagName("option");
	let stringOpts = "";
	for (let i = 0; i < options.length; i++) {
		stringOpts = stringOpts + `<option value=${options[i].value}>${options[i].value}</option>`;
	}
    let body = (e.childNodes[1].childNodes[1]);

    let newField = `<td class="form-row">
                        <input type="number" min="0" id="coyNumber" name="production[LHD][${num}][coyNumber]" placeholder=${operatorPlaceHolder} required>
                    </td>

                    <td class="form-row">
                        <select name="production[LHD][${num}][LHDnumber]" id="LHDnumber" class="used-LHD" required>
                            ${stringOpts}
                        </select>
                    </td>

                    <td class="form-row">
                        <input type="number" min="0" id="LHDbuckets" name="production[LHD][${num}][buckets]" placeholder=${bucketsPlaceHolder} required>
                    </td>

                    <td class="form-row">
                        <a href="#" onclick="out(this.parentNode.parentNode)" id="out">Delete</a>
                    </td>`;

    let tr = document.createElement("tr");
    tr.innerHTML = newField;

    body.appendChild(tr);
    e.style.maxHeight = e.scrollHeight + "px";
}

function addAllocation(e){
    const parentDiv = e.parentNode.parentNode.parentNode.parentNode.parentNode;

    const selectTag = parentDiv.getElementsByTagName("select");
    const machineCat = selectTag[0].name.split("[")[0];
    
    if(selectTag[0].value === "none") {
        return alert(`No further ${machineCat}s can be selected if the first one is "none"`)
    }
    
    let inputsCount = parentDiv.querySelectorAll("tr").length;
	inputsCount = inputsCount + 1;
	const num = inputsCount;

    
    const options = selectTag[0].getElementsByTagName("option");
    const optionsAvailable = removeAlreadySelectedOptions(options, selectTag)

    if(optionsAvailable.length <= 0) {
        return alert(`All ${machineCat}s have been allocated sections`)
    }


    const td = document.createElement("td")
    td.classList = "form-row";

    const td2 = document.createElement("td")
    td2.classList = "form-row";

    const anchor = document.createElement("a")
    anchor.href = "#";
    anchor.setAttribute("onClick", "removeAllocation(this)")
    anchor.text = "remove"


    const select = document.createElement("select")
    select.name = `${machineCat}[${num}]`

    for (let i = 0; i < optionsAvailable.length; i++) {
		const opt = document.createElement("option");
        opt.value = optionsAvailable[i];
        opt.text = optionsAvailable[i];
        select.add(opt);
	}

    td.append(select)
    td2.append(anchor)

    const tr = document.createElement("tr");
    tr.append(td)
    tr.append(td2)

    const bodyTag = parentDiv.querySelector("tbody")
    
    bodyTag.append(tr)
    parentDiv.style.maxHeight = parentDiv.scrollHeight + "px";
}

function removeAllocation(e){
    e.parentNode.parentNode.remove();
}

function removeAlreadySelectedOptions(opts, selects){
    const options = [...opts];
    const selectTags = [...selects];
    const alreadySelected = [];
    const notYetSelected = [];
    selectTags.forEach(e => {
        alreadySelected.push(e.value);
    })

    options.forEach(e => {
        if(alreadySelected.indexOf(e.value) === -1 && e.value !== "none"){
            notYetSelected.push(e.value)
        }
    })

    return notYetSelected
}

if (document.querySelector("input[name = 'allocationToday']")){
    sortAllocationIndex();
}

function sortAllocationIndex() {
    const data = document.getElementById("allAllocatedResources").innerText;
    const parsedData = JSON.parse(data);

    let filterDate;
    const selectedDate = document.getElementById("todayDate");
    const today = new Date().toLocaleDateString("en-GB");

    if (selectedDate.value === "") {
        filterDate = today
	} else {
        filterDate = new Date(selectedDate.value).toLocaleDateString("en-GB");
    }
    
    const dataFiltered = parsedData.filter((e) => new Date(e.date).toLocaleDateString("en-GB") === filterDate);
    createTable4Allocation(dataFiltered)
}

function createTable4Allocation(e){
    const shifts = [];
    e.forEach(al => {
        if(shifts.indexOf(al.shift) === -1){
            shifts.push(al.shift);
        }
    });

    const shift1 = e.filter(data => data.shift === shifts[0])
    const shift2 = e.filter(data => data.shift === shifts[1])
    const shift3 = e.filter(data => data.shift === shifts[2])

    let table;
    if(shift1.length > 0){
        table = `
                <table>
                    <thead>
                        <tr>
                            <th>${shifts[0].toUpperCase()}</th>
                            ${shift1.map(e => ("<th><a href=/resource/"+ e._id +">"+ e.section + "</a></th>")).join("")}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>LHDs</th>
                            ${shift1.map(e => ("<td>"+ e.LHDs + "</td>")).join("")}
                        </tr>
                        <tr>
                            <th>Drill Rigs</th>
                            ${shift1.map(e => ("<td>"+ e.drillRigs + "</td>")).join("")}
                        </tr>
                        <tr>
                            <th>Bolters</th>
                            ${shift1.map(e => ("<td>"+ e.bolters + "</td>")).join("")}
                        </tr>
                    </tbody>
                </table>`
    } else {
        table = "<table></table>"
    }

    let table2;
    if(shift2.length > 0){
        table2 = `
                <table>
                    <thead>
                        <tr>
                            <th>${shifts[1].toUpperCase()}</th>
                            ${shift2.map(e => ("<th><a href=/resource/"+ e._id +">"+ e.section + "</a></th>")).join("")}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>LHDs</th>
                            ${shift2.map(e => ("<td>"+ e.LHDs + "</td>")).join("")}
                        </tr>
                        <tr>
                            <th>Drill Rigs</th>
                            ${shift2.map(e => ("<td>"+ e.drillRigs + "</td>")).join("")}
                        </tr>
                        <tr>
                            <th>Bolters</th>
                            ${shift2.map(e => ("<td>"+ e.bolters + "</td>")).join("")}
                        </tr>
                    </tbody>
                </table>`
    } else {
        table2 = "<table></table>"
    }

    
    let table3;
    if(shift3.length > 0){
        table3 = `
                <table>
                    <thead>
                        <tr>
                            <th>${shifts[2].toUpperCase()}</th>
                            ${shift3.map(e => ("<th><a href=/resource/"+ e._id +">"+ e.section + "</a></th>")).join("")}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>LHDs</th>
                            ${shift3.map(e => ("<td>"+ e.LHDs + "</td>")).join("")}
                        </tr>
                        <tr>
                            <th>Drill Rigs</th>
                            ${shift3.map(e => ("<td>"+ e.drillRigs + "</td>")).join("")}
                        </tr>
                        <tr>
                            <th>Bolters</th>
                            ${shift3.map(e => ("<td>"+ e.bolters + "</td>")).join("")}
                        </tr>
                    </tbody>
                </table>`
    } else {
        table3 = "<table></table>"
    }

    const div = document.getElementById("tablesForAllocations");
    div.innerHTML = table + "<br>" + table2 + "<br>" + table3;
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

function validatePanelActivity(e) {
    if(e.value.length !== 0 && e.value == 0){
        const parent = e.parentNode.parentNode;
        const children = parent.children;
        for(let i = 0; i < children.length; i++){
            children[i].children[0].disabled = true
        }
    }
}

// ================solution Showing Infomation selectively=======
// filter("combine")
let chartData;

// if (document.getElementById("blast-progs")) {
// 	document.getElementById("blast-progs").onclick();
// }

function filter(c) {
    const container = document.getElementById("myBtnContainer");
    const current = container.getElementsByClassName("selected");
    if(current.length !== 0){
        current[0].className = current[0].className.replace(" selected", "");
    }

    const selectedBtn = document.getElementById(c);

    selectedBtn.className += " " + "selected";

    if(c === "blast-progs" || c === "charts"){
        // Hiding MO and section filters
        const ronny = document.getElementById("filterDiv");
        const ramushu = [...ronny.children];
        ramushu.forEach((e) => e.disabled = true);
        ronny.style.display = "none";
    } else {
        // Unhiding MO and Section filters
        const ronny = document.getElementById("filterDiv");
		const ramushu = [...ronny.children];
		ramushu.forEach((e, i) => {
			if (i !== 2) {
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
// if (document.getElementById("myBtnContainer")) {
//     const btnContainer = document.getElementById("myBtnContainer");
//     const btns = btnContainer.getElementsByClassName("btn");
//     for (let i = 0; i < btns.length; i++) {
//         btns[i].addEventListener("click", function () {
//             const current = document.getElementsByClassName("selected");
//             current[0].className = current[0].className.replace(" selected", "");
//             this.className += " selected";
//         });
//     }
// }


// ===============date filtering=========
function dateChange(e) {
    // Filtering production data by selected MO and section
    const MOandSectionProduction = fileterByMOandSections(e);

	// Getting the date that the user specified
    const selectedDate = document.getElementById("dateFilter").value

	// This is a div where tables will be displayed in it
	const main = document.getElementById("tables");
	main.innerHTML = "";

    
    const productionFilteredByDate = MOandSectionProduction.filter((prod) => moment(prod.general[0].shiftStart).format("YYYY-MM-DD") === selectedDate);
    if(productionFilteredByDate.length !== 0){
        const btns = document.getElementById("myBtnContainer").children;
		const btnsToLeave = ["blast-progs", "charts"];
		for (let i = 0; i < btns.length; i++) {
			if (btnsToLeave.indexOf(btns[i].id) === -1) {
				btns[i].remove();
			}
		}
        createProductionIndexTables(productionFilteredByDate)
    } else {
        const btns = document.getElementById("myBtnContainer").children;
        const btnsToLeave = ['blast-progs', 'charts'];
        for(let i = 0; i < btns.length; i++){
            if(btnsToLeave.indexOf(btns[i].id) === -1){
                btns[i].remove();
            };
        }
    }
    // createProductionIndexTables(MOandSectionProduction)
}

function createProductionIndexTables(production){
    const shifts = [];
    production.forEach((p) => {
        if (shifts.indexOf(p.general[0].shift) === -1) {
			shifts.push(p.general[0].shift);
		}
    })
    
    const cont = document.getElementById("myBtnContainer");
    const contArr = [...cont.children].map(el => el.id);

    const buttons = [];
    shifts.forEach((el, i) => {
        const button = document.createElement("button");
        button.classList = "btn";
        button.id = el;
        button.innerHTML = el.toUpperCase();
        button.setAttribute("onclick", `filter('${el}')`);
        
        buttons.push(button)
    })
    
    buttons.forEach(e => {
        if(contArr.indexOf(e.id) === -1){
            cont.insertBefore(e, cont.children[0]);
        }
    })

    shifts.forEach((s, i, arr) => {
        const data = production.filter(p => p.general[0].shift === s)
        // console.log(cont)
        createShiftProductionTable(data, s, i, arr)
    })

}

function createShiftProductionTable(data, shift, index, arr) {
	const table = `<table id="${shift}-shift" class="filterDiv ${shift}">
                        <thead>
                            <tr>

                            </tr>
                            <tr>
                                <th>${shift.toUpperCase()}</th>
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
                        ${data
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
                                    ${data
										.map((b) => b.blast)
										.map((sub1) => sub1.map((sub2) => sub2.length).reduce((i, j) => i + j, 0))
										.reduce((x, y) => x + y, 0)}
                                </td>
                                <td>
                                    ${data
										.map((b) => b.clean)
										.map((sub1) => sub1.map((sub2) => sub2.length).reduce((i, j) => i + j, 0))
										.reduce((x, y) => x + y, 0)}
                                </td>
                                <td>
                                    ${data
										.map((b) => b.support)
										.map((sub1) => sub1.map((sub2) => sub2.length).reduce((i, j) => i + j, 0))
										.reduce((x, y) => x + y, 0)}
                                </td>
                                <td>
                                    ${data
										.map((b) => b.drill)
										.map((sub1) => sub1.map((sub2) => sub2.length).reduce((i, j) => i + j, 0))
										.reduce((x, y) => x + y, 0)}
                                </td>
                                <td>
                                    ${data
										.map((b) => b.prep)
										.map((sub1) => sub1.map((sub2) => sub2.length).reduce((i, j) => i + j, 0))
										.reduce((x, y) => x + y, 0)}
                                </td>
                                <td>
                                    ${data
										.map((b) => b.notClean)
										.map((sub1) => sub1.map((sub2) => sub2.length).reduce((i, j) => i + j, 0))
										.reduce((x, y) => x + y, 0)}
                                </td>
                                <td>
                                    ${data
										.map((b) => b.LHD)
										.map((sub1) => sub1.length)
										.reduce((i, j) => i + j, 0)}
                                </td>
                            </tr>
                        </tbody >
                    </table>`;

	const all = document.createElement("section");
	all.innerHTML = table;
	all.setAttribute("id", "wrapper");
	const main = document.getElementById("tables");
	main.appendChild(all);
    if(index === arr.length - 1) {
        document.getElementById(shift).onclick()
    }
}


function fileterByMOandSections(e){
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
if(document.getElementById("startdate")){
    document.getElementById("startdate").value = htmlStartDate;
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

    const shifts = document.getElementById("shifts").innerText;
	const parsedShifts = JSON.parse(shifts);
    const blastingShift = parsedShifts.filter(s => s.isBlasting)
    const shift = blastingShift[0].name.toLowerCase()

    const endDate = document.getElementById("endDate").value;
    const startDate = document.getElementById("startDate").value;

    if (endDate < startDate) {
        e.target.value = ""
        document.getElementById("tableDate").innerHTML = endDate.slice(8) + "/" + endDate.slice(5, 7) + "/" + endDate.slice(0, 4)
        document.getElementById("endDate").value = moment(today).format('YYYY-MM-DD');
        return alert("Start date cannot be greater than end date. Please re-select your date range")
    }

    const filteredByDate = parsedProduction.filter(prod1 => { return moment(prod1.created).format('YYYY-MM-DD') >= startDate && moment(prod1.created).format('YYYY-MM-DD') <= endDate}).filter(a => a.general[0].shift === "morning")
    const todayProduction = parsedProduction.filter(prod1 => { return moment(prod1.created).format('YYYY-MM-DD') == endDate }).filter(a => a.general[0].shift === shift)

    const actualTotalBudget = todayProduction.map(b => b.section.budget).reduce((i, j) => i + j, 0)
    const actualTotalForecast = todayProduction.map(b => b.section.forecast).reduce((i, j) => i + j, 0)

    const todayBlasted = todayProduction.map(b => b.blasted).reduce((a, b) => a + b, 0)

    let todayVarianceTotals = Number(todayBlasted) - Number(actualTotalForecast);

    if (Math.sign(todayVarianceTotals) === -1) {
		todayVarianceTotals = `(${(todayVarianceTotals * -1).toFixed(1)})`;
	} else {
		todayVarianceTotals = todayVarianceTotals.toFixed(1);
	}

    const budgetProgTotal2 = filteredByDate.map(b2 => b2.budget).reduce((b3, b4) => b3 + b4, 0)
    const forecastProgTotal2 = filteredByDate.map(b2 => b2.forecast).reduce((b3, b4) => b3 + b4, 0)

    const squareMetersProgTotal2 = filteredByDate.map(f => f.blasted).reduce((r, a) => r + a, 0)

    varianceProgTotal = squareMetersProgTotal2 - forecastProgTotal2

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
                            let variance2 = b.blasted - b.section.forecast

                            if (Math.sign(variance2) === -1) {
                                variance2 = `(${(variance2 * -1).toFixed(1)})`
                            } else {
                                variance2 = variance2.toFixed(1)
                            }

                            const sections = filteredByDate.filter(b1 => b1.section.name === b.section.name)
                            const budgetProg = sections.map(b2 => b2.budget).reduce((b3, b4) => b3 + b4, 0)
                            const forecastProg = sections.map(b2 => b2.forecast).reduce((b3, b4) => b3 + b4, 0)

                            const progActual = sections.map(b5 => b5.blasted).reduce((a, b) => a + b, 0)
                            
                            let varianceProg = Number(progActual) - forecastProg;

                            if (Math.sign(varianceProg) === -1) {
                                varianceProg = `(${(varianceProg * -1).toFixed(1)})`
                            } else {
                                varianceProg = varianceProg.toFixed(1)
                            }


                            return "<tr><th>" + b.section.name + "</th>" + "<th>m<sup>2</sup></th>" + "<td>" + b.budget.toFixed(1) + "</td>" + "<td>" + b.forecast.toFixed(1) + "</td>" + "<td>" + b.blasted + "</td>" + "<td class=\"variance\" >" + variance2 + "</td>" + "<td class=\"smiley\">&#128577</td>" + "<td class=\"comments_cell\">" + b.general[0].comments + "</td>" + "<td>" + budgetProg.toFixed(1) + "</td>" + "<td>"+ forecastProg.toFixed(1) +"</td>" + "<td>" + progActual +"</td>" + "<td class=\"variance\">"+ varianceProg +"</td>" + "<td>&#128577</td>" + "</tr>"
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
                                ${todayBlasted.toFixed(1)}
                            </th>
                            <th class="variance">
                                ${todayVarianceTotals}
                            </th>
                            <td>&#128577</td>
                            <th>
                            </th>
                            <th>
                                ${budgetProgTotal2.toFixed(1)}
                            </th>
                            <th>
                                ${forecastProgTotal2.toFixed(1)}
                            </th>
                            <th>
                                ${squareMetersProgTotal2.toFixed(1)}
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

    
    

    // if ((selectedShift.checked && selectedShift.id === "night") || (selectedShift.checked && selectedShift.id === "afternoon")) {
    if ((selectedShift.checked && selectedShift.dataset.blast === "false")) {
		blastPanel.required = false;
		blastPanel.value = null;
		blastLength.required = false;
		blastLength.value = null;
		comments.innerText = "Comments";
		commentsBox.required = false;

		if (toBeRemoved.length > 0) {
			for (let j = 0; j < count; j++) {
				blastBody.querySelector(".removedToggle").remove();
			}
		}

		blastBody.style.display = "none";
		blastHeading.style.display = "none";
	}

    // if(selectedShift.checked && selectedShift.id === "morning"){
    if(selectedShift.checked && selectedShift.dataset.blast === "true"){
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
        checkCallAchieved();
    }
}



// Checking if whether target is achieved
let diva;
if(document.getElementById("blast-report")){
    diva = document.getElementById("blast-report")
    diva.addEventListener("click", checkCallAchieved)
}

function checkCallAchieved4Date (e) {
    const selectedDate = new Date(e.target.value).toDateString();
    checkCallAchieved(0, selectedDate)
    advancePanels(selectedDate)
}

function advancePanels(selectedDate){
    const headingToHide = document.getElementById("advance-report-heading");
    if(headingToHide){
        const divToHide = document.getElementById("advance-report");
        const inputsToDisable = divToHide.querySelectorAll("input");
    
        const panelsAdvancedDate = document.getElementById("panelsAdvancedDate").innerText;
        const parsedPanelsAdvancedDate = JSON.parse(panelsAdvancedDate);
        const date = new Date(parsedPanelsAdvancedDate[0]).toDateString();
    
        // if (today.toDateString() !== selectedDate) {
        if (new Date(date) <= new Date(selectedDate)) {
            headingToHide.style.display = "block";
			divToHide.style.display = "block";
			inputsToDisable.forEach((e) => (e.disabled = false));
        } else if (new Date(date) > new Date(selectedDate)) {
			headingToHide.style.display = "none";
			divToHide.style.display = "none";
			inputsToDisable.forEach((e) => (e.disabled = true));
		}
    }
}

function checkCallAchieved (e, date) {
    const faceLengths = diva.querySelectorAll("#length");
    const panelsBlastedLength = faceLengths.length;
    // const target = Number(document.getElementById("call").innerText)
    let target = 0;
    const productionShifts = JSON.parse(document.getElementById("productionShifts").innerText)
    const productionShifts1 = productionShifts.map(e => new Date(e).toDateString());
    
    const date1 = document.getElementById("todayDate") ? document.getElementById("todayDate").value : "";
    // const date1 = document.getElementById("todayDate").value || "";
    const reportDate = new Date().toDateString();
    let date2;
    if ("" === date1) {
        date2 = reportDate;
	} else {
        date2 = new Date(date1).toDateString(); 
    }


    // const selectedDate = date || new Date().toDateString();
    const selectedDate = date || date2;
    // if(document.getElementById("startDate")){
    //     new Date(selectedDate = document.getElementById("startDate").value).toDateString();
    //     console.log("*********************YES*************")
    // }
    const index = productionShifts1.indexOf(selectedDate);
    
    if(productionShifts1[index] === selectedDate){
        target = Number(document.getElementById("call").innerText);
        document.getElementById("isProductionShift").value = true;
    } else {
        document.getElementById("isProductionShift").value = false;
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

if(productionForm){
    checkCallAchieved();
}


/*
 *
 *******************************TARP RED PANELS********************
 *
 */
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


/*
 *
 *******************************REHABILITAED TARP RED PANELS********************
 *
 */

function  rehabTARPFilters(){
	// Getting data to work with
	const rehabedPanels = document.getElementById("rehabed-panels").innerText;
	const parsedRehabedPanels = JSON.parse(rehabedPanels);
	const startDate = document.getElementById("startDate").value;
	const endDate = document.getElementById("endDate").value;
	const sectionSelected = document.getElementById("section-selected").value;

	// Get the container to draw the table
	const container = document.getElementById("rehabed-panels-table");

	// Filtering rehabilitated panels by date range
	const filteredByDate = parsedRehabedPanels.filter((e) => moment(e.rehabDate).format("YYYY-MM-DD") >= startDate && moment(e.rehabDate).format("YYYY-MM-DD") <= endDate);

	// Filtering rehabilitated panels by section selected
    let filteredBySection = filteredByDate;
    if(sectionSelected !== "all-sections"){
        filteredBySection = filteredByDate.filter(e => e.section.name === sectionSelected);
    }

    // Contruct the table
    const tableContents = rehabedPanelsTable(filteredBySection)
    container.innerHTML = tableContents;
}

function rehabedPanelsTable(data){
    if(data && data.length === 0){
        return "No Rehabilitated Panels."
    }

    let stringRows = "";
    data.forEach(e => {
        const row = `<tr>
                        <td>
                            <a href="/rehabedPanel/${e._id}">
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
                            ${new Date(e.declaredDate).toDateString()}
                        </td>

                        <td>
                            ${new Date(e.issueDate).toDateString()}
                        </td>

                        <td>
                            ${new Date(e.rehabDate).toDateString()}
                        </td>
                    </tr>`;

        stringRows += row
    })

    const contents = `
                    <table>
                        <colgroup>
                            <col style="background-color: grey; width: auto;" span=${6}>
                        </colgroup>

                        <tr>
                            <th colspan="7">
                                ${data.length}  Rehabilitated Panel(s)
                            </th>
                        </tr>
                        <tr>
                            <th>Panel</th>
                            <th>Section</th>
                            <th>Trigger(s)</th>
                            <th>Date Panel Declared</th>
                            <th>Date Report Issued</th>
                            <th>Date Rehabilitated</th>
                        </tr>
                        ${stringRows}
                    </table>`;
    return contents;
}



function changeCleanedLength(e){
    const tag = e.parentNode.parentNode

    const select1 = tag.querySelector("#clean-panel");
    const select2 = tag.querySelector("#clean-length");
    // const input = tag.querySelector("#input-length");

    if(e.id === "clean-panel"){
        select2.value = select2[select1.selectedIndex].value;
    }

    if(e.id === "clean-length"){
        select1.value = select1[select2.selectedIndex].value;
    }

    // input.value = select2[select1.selectedIndex].value;
    console.log(select1.selectedIndex)
    console.log(select2[1].value)
}
