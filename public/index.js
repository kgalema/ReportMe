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
    e.parentNode.removeChild(e);
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
                        <select name="production[support][${num}][machine]" id="bolter">
                            <option value=""></option>
                            <option value="RB01">RB01</option>
                            <option value="RB02">RB02</option>
                            <option value="RB03">RB03</option>
                            <option value="RB04">RB04</option>
                            <option value="RB05">RB05</option>
                            <option value="RB06">RB06</option>
                            <option value="RB07">RB07</option>
                            <option value="RDO">RDO</option>
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
                        <select name="production[drill][${num}][drillRig]" id="drillRig" required>
                            <option value=""></option>
                            <option value="TDR01">TDR01</option>
                            <option value="TDR02">TDR02</option>
                            <option value="TDR03">TDR03</option>
                            <option value="TDR04">TDR04</option>
                            <option value="TDR05">TDR05</option>
                            <option value="TDR06">TDR06</option>
                            <option value="TDR07">TDR07</option>
                            <option value="TDR104">TDR104</option>
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
    // fieldNumber = fieldNumber + 1;
    // let num = fieldNumber;
    let body = (e.childNodes[1].childNodes[1]);

    let newField = `<td class="form-row">
                        <input type="number" min="0" id="coyNumber" name="production[LHD][${num}][coyNumber]" placeholder=${coyNumber.placeholder} required>
                    </td>

                    <td class="form-row">
                        <select name="production[LHD][${num}][LHDnumber]" id="LHDnumber" required>
                            <option value="" selected disabled>GL#</option>
                            <option value="GL11">GL11</option>
                            <option value="GL02">GL02</option>
                            <option value="GL03">GL03</option>
                            <option value="GL04">GL04</option>
                            <option value="GL05">GL05</option>
                            <option value="RR1">RR1</option>
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




//======Making sure that panel name is all upper case and no spaces exist in between======
const newForm = document.getElementById("new-production")
if(newForm){
    console.log(true)
    const allPanels = newForm.querySelectorAll("#panel")
    allPanels.forEach(p => p.setAttribute("onkeyup", "validatePanelName(event)"))
} else {
    console.log(false)
}

function validatePanelName(e) {
  const newValue = e.target.value.toUpperCase().replace(/\s+/g, "");
  e.target.value = newValue;
}

// ================solution Showing Infomation selectively=======
filter("combine")
let chartData;
function filter(c, data = []) {
    let chartData = data
    let all = document.getElementsByClassName("filterDiv");
    if (c == "all") {
        var hideProg = c
        c = ""
    };
    // Add the "show" class (display:block) to the filtered elements, and remove the "show" class from the elements that are not selected
    for (let i = 0; i < all.length; i++) {
        hideItem(all[i], "show");
        if (all[i].className.indexOf(c) > -1) showItem(all[i], "show");
    }
    if(hideProg == "all"){
        let section = all[all.length-1]
        let splitted = section.className.split(" ")
        let spliced = splitted.splice(0, splitted.length - 1)
        section.className = spliced.join(" ");
    }
}

// Show filtered elements
function showItem(element, name) {
    // var i, arr1, arr2;
    let arr1 = element.className.split(" ");
    let arr2 = name.split(" ");
    for (let i = 0; i < arr2.length; i++) {
        if (arr1.indexOf(arr2[i]) == -1) {
            element.className += " " + arr2[i];
        }
    }
}

// Hide elements that are not selected
function hideItem(element, name) {
    let arr1 = element.className.split(" ");
    let arr2 = name.split(" ");
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
            let current = document.getElementsByClassName("selected");
            current[0].className = current[0].className.replace(" selected", "");
            this.className += " selected";
        });
    }
}


// ===============date filtering=========
function dateChange(e, f) {
    console.log(f);
    // const productions = JSON.parse(f);
    // console.log(productions);
    selectedDate = e.value
    let main = document.getElementById("tables")
    let section = main.getElementsByTagName("section")
    main.innerHTML = ""
    let prodFiltered = f.filter(prod => moment(prod.created).format('YYYY-MM-DD') === selectedDate)
    prodFiltered.sort((a, b) => {
        if (a.section.name > b.section.name) {
            return 1
        } else {
            return -1
        }
    })
    let dayshift = prodFiltered.filter(prod => prod.general[0].shift === "morning")
    let backshift = prodFiltered.filter(prod => prod.general[0].shift === "backshift")
    let content = `
                    <table id="all-shift" class="filterDiv all combine" style="display: none">
                        <thead>
                            <tr>

                            </tr>
                            <tr>
                                <th>All</th>
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
                    ${prodFiltered.map(function (e) {
        return "<tr><td><a href='/sections/" + e.section.id + "/production/" + e._id + "'>" + e.section.name + "</a></td><td>" + e.blast.map(sub1 => sub1.length).reduce((i, j) => i + j, 0) + "</td><td>" + e.clean.map(sub1 => sub1.length).reduce((i, j) => i + j, 0) + "</td><td>" + e.support.map(sub1 => sub1.length).reduce((i, j) => i + j, 0) + "</td><td>" + e.drill.map(sub1 => sub1.length).reduce((i, j) => i + j, 0) + "</td><td>" + e.prep.map(sub1 => sub1.length).reduce((i, j) => i + j, 0) + "</td><td>" + e.notClean.map(sub1 => sub1.length).reduce((i, j) => i + j, 0) + "</td><td>" + e.LHD.length + "</td></tr>"
    }).join("")}

                            <tr>
                                <th>Totals</th>
                                <td>
                                    ${prodFiltered.map(b => b.blast).map(sub1 => sub1.map(sub2 => sub2.length).reduce((i, j) => i + j)).reduce((x, y) => x + y, 0)}
                                </td>
                                <td>
                                    ${prodFiltered.map(b => b.clean).map(sub1 => sub1.map(sub2 => sub2.length).reduce((i, j) => i + j, 0)).reduce((x, y) => x + y, 0)}
                                </td>
                                <td>
                                    ${prodFiltered.map(b => b.support).map(sub1 => sub1.map(sub2 => sub2.length).reduce((i, j) => i + j, 0)).reduce((x, y) => x + y, 0)}
                                </td>
                                <td>
                                    ${prodFiltered.map(b => b.drill).map(sub1 => sub1.map(sub2 => sub2.length).reduce((i, j) => i + j, 0)).reduce((x, y) => x + y, 0)}
                                </td>
                                <td>
                                    ${prodFiltered.map(b => b.prep).map(sub1 => sub1.map(sub2 => sub2.length).reduce((i, j) => i + j, 0)).reduce((x, y) => x + y, 0)}
                                </td>
                                <td>
                                    ${prodFiltered.map(b => b.notClean).map(sub1 => sub1.map(sub2 => sub2.length).reduce((i, j) => i + j, 0)).reduce((x, y) => x + y, 0)}
                                </td>
                                <td>
                                    ${prodFiltered.map(b => b.LHD).map(sub1 => sub1.length).reduce((i, j) => i + j, 0)}
                                </td>
                            </tr>

                        </tbody >
                    </table>
                    <br>
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
                      ${dayshift.map(function (e) {
        return "<tr><td><a href='/sections/" + e.section.id + "/production/" + e._id + "'>" + e.section.name + "</a></td><td>" + e.blast.map(sub1 => sub1.length).reduce((i, j) => i + j, 0) + "</td><td>" + e.clean.map(sub1 => sub1.length).reduce((i, j) => i + j, 0) + "</td><td>" + e.support.map(sub1 => sub1.length).reduce((i, j) => i + j, 0) + "</td><td>" + e.drill.map(sub1 => sub1.length).reduce((i, j) => i + j, 0) + "</td><td>" + e.prep.map(sub1 => sub1.length).reduce((i, j) => i + j, 0) + "</td><td>" + e.notClean.map(sub1 => sub1.length).reduce((i, j) => i + j, 0) + "</td><td>" + e.LHD.length + "</td></tr>"
    }).join("")}


                            <tr>
                                <th>Totals</th>
                                <td>
                                    ${dayshift.map(b => b.blast).map(sub1 => sub1.map(sub2 => sub2.length).reduce((i, j) => i + j)).reduce((x, y) => x + y, 0)}
                                </td>
                                <td>
                                    ${dayshift.map(b => b.clean).map(sub1 => sub1.map(sub2 => sub2.length).reduce((i, j) => i + j, 0)).reduce((x, y) => x + y, 0)}
                                </td>
                                <td>
                                    ${dayshift.map(b => b.support).map(sub1 => sub1.map(sub2 => sub2.length).reduce((i, j) => i + j, 0)).reduce((x, y) => x + y, 0)}
                                </td>
                                <td>
                                    ${dayshift.map(b => b.drill).map(sub1 => sub1.map(sub2 => sub2.length).reduce((i, j) => i + j, 0)).reduce((x, y) => x + y, 0)}
                                </td>
                                <td>
                                    ${dayshift.map(b => b.prep).map(sub1 => sub1.map(sub2 => sub2.length).reduce((i, j) => i + j, 0)).reduce((x, y) => x + y, 0)}
                                </td>
                                <td>
                                    ${dayshift.map(b => b.notClean).map(sub1 => sub1.map(sub2 => sub2.length).reduce((i, j) => i + j, 0)).reduce((x, y) => x + y, 0)}
                                </td>
                                <td>
                                    ${dayshift.map(b => b.LHD).map(sub1 => sub1.length).reduce((i, j) => i + j, 0)}
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
                    ${backshift.map(function (e) {
        return "<tr><td><a href='/sections/" + e.section.id + "/production/" + e._id + "'>" + e.section.name + "</a></td><td>" + e.clean.map(sub1 => sub1.length).reduce((i, j) => i + j, 0) + "</td><td>" + e.support.map(sub1 => sub1.length).reduce((i, j) => i + j, 0) + "</td><td>" + e.drill.map(sub1 => sub1.length).reduce((i, j) => i + j, 0) + "</td><td>" + e.prep.map(sub1 => sub1.length).reduce((i, j) => i + j, 0) + "</td><td>" + e.notClean.map(sub1 => sub1.length).reduce((i, j) => i + j, 0) + "</td><td>" + e.LHD.length + "</td></tr>"
    }).join("")}


                        <tr>
                            <th>Totals</th>
                            
                            <td>
                                ${backshift.map(b => b.clean).map(sub1 => sub1.map(sub2 => sub2.length).reduce((i, j) => i + j, 0)).reduce((x, y) => x + y, 0)}
                            </td>
                            <td>
                                ${backshift.map(b => b.support).map(sub1 => sub1.map(sub2 => sub2.length).reduce((i, j) => i + j, 0)).reduce((x, y) => x + y, 0)}
                            </td>
                            <td>
                                ${backshift.map(b => b.drill).map(sub1 => sub1.map(sub2 => sub2.length).reduce((i, j) => i + j, 0)).reduce((x, y) => x + y, 0)}
                            </td>
                            <td>
                                ${backshift.map(b => b.prep).map(sub1 => sub1.map(sub2 => sub2.length).reduce((i, j) => i + j, 0)).reduce((x, y) => x + y, 0)}
                            </td>
                            <td>
                                ${backshift.map(b => b.notClean).map(sub1 => sub1.map(sub2 => sub2.length).reduce((i, j) => i + j, 0)).reduce((x, y) => x + y, 0)}
                            </td>
                            <td>
                                ${backshift.map(b => b.LHD).map(sub1 => sub1.length).reduce((i, j) => i + j, 0)}
                            </td>
                        </tr>
                    </tbody >
                </table>
`

    let all = document.createElement("section");
    all.innerHTML = content;
    all.setAttribute("id", "wrapper");
    main.appendChild(all)
    document.getElementById('morning_shift').click()
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
    console.log("Here")
    console.log(todayMonth)
}
if (todayDay <= 9) {
    todayDay = "0" + todayDay;
    console.log(todayDay);
}

let startDateDay = "01"
let htmlStartDate = `${todayYear}-${todayMonth}-${startDateDay}`
let htmlDate = `${todayYear}-${todayMonth}-${todayDay}`;
console.log(htmlDate);
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
    document.getElementById("startDate").value = htmlDate
    document.getElementById("startDate").max = htmlDate
}


if(document.getElementById("declaredDate")){
    document.getElementById("declaredDate").max = htmlDate + "T23:59:59"
}


// Setting max time for input type=time
if(document.getElementById("startTime")){
    document.getElementById("startTime").max = `${todayHours}:${todayMinutes}`;
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


function blastFilter(e, prod) {
    let endDate = document.getElementById("endDate").value
    let startDate = document.getElementById("startDate").value
    document.getElementById("tableDate").innerHTML = endDate.slice(8) + "/" + endDate.slice(5, 7) + "/" + endDate.slice(0, 4)
    if (endDate < startDate) {
        e.target.value = ""
        document.getElementById("tableDate").innerHTML = endDate.slice(8) + "/" + endDate.slice(5, 7) + "/" + endDate.slice(0, 4)
        return alert("Start date cannot be greater than end date. Please re-select your date range")
    }

    let filteredByDate = prod.filter(prod1 => { return moment(prod1.created).format('YYYY-MM-DD') >= startDate && moment(prod1.created).format('YYYY-MM-DD') <= endDate}).filter(a => a.general[0].shift === "morning")
    let todayProduction = prod.filter(prod1 => { return moment(prod1.created).format('YYYY-MM-DD') == endDate }).filter(a => a.general[0].shift === "morning")
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
    let advances = filteredByDate.map(b => b.section.plannedAdvance)
    let blasts = filteredByDate.map(b5 => b5.blast.map(sub1 => sub1.length).reduce((i, j) => i + j))
    let squareMetersProgTotal = advances.reduce((r, a, i) => r + a * blasts[i], 0)
    varianceProgTotal = squareMetersProgTotal - forecastProgTotal

    if (Math.sign(varianceProgTotal) === -1) {
        varianceProgTotal = `(${(varianceProgTotal * -1).toFixed(1)})`
    } else {
        varianceProgTotal = varianceProgTotal.toFixed(1)
    }

    let numRows = todayProduction.length + 3

    document.getElementById("progressives").innerHTML = "";
    let content = `
                    <thead>

                    </thead>
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

                            let actual2 = sections.map(b5 => b5.blast.map(sub1 => sub1.length).reduce((i, j) => i + j, 0)).reduce((b6, b7) => b6 + b7, 0).toFixed(1)
                            let actual21 = sections.map(b5 => b5.blast.map(sub1 => sub1.length).reduce((i, j) => i + j, 0)*b5.section.plannedAdvance).reduce((b6, b7) => b6 + b7, 0).toFixed(1)
                            let advances = sections.map(b => b.section.plannedAdvance)
                            
                            
                            let blasts = sections.map(b5 => b5.blast.map(sub1 => sub1.length).reduce((i, j) => i+j, 0))
                            
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
    let vari = document.getElementsByClassName("variance")
    for (let i = 0; i < vari.length; i++) {
        if (vari[i].textContent.indexOf("(") < 0) {
            vari[i].nextElementSibling.innerHTML = "&#128578"
            vari[i].nextElementSibling.style.backgroundColor = "green"
        } else {
            vari[i].nextElementSibling.innerHTML = "&#128577"
            vari[i].nextElementSibling.style.backgroundColor = "red"
            vari[i].style.color = "red"

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
    const target = Number(document.getElementById("call").innerText)

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
    console.log("Success");
    checkCallAchieved();
}

console.log("ENd");

