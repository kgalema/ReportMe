function breakdownFilter(date, data, closedData) {
    const shiftData = document.getElementById('shiftData').innerText;
    const shiftDataParsed = JSON.parse(shiftData)
    const overlappingShift = shiftDataParsed.filter(e => e.overlap)
    const overlappingShiftName = (overlappingShift[0].name).toLowerCase();
    const overlappingShiftEndTime = overlappingShift[0].end;
    const overlappingShiftStartTime = overlappingShift[0].start;
    const overlappingShiftStartHour = Number(overlappingShiftStartTime.split(":")[0]);
    
    
    const section = document.getElementById("all-breakdowns");
    const shift = document.getElementsByClassName("breakdownShift");
    const shiftArr = [...shift]
    const shiftSelected = shiftArr.filter(e => e.checked)
    const openShiftFilteredBreakdowns = data.filter(e => e.shift === shiftSelected[0].value);
    const closedShiftFilteredBreakdowns = closedData.filter(e => e.breakdown.shift === shiftSelected[0].value);
    
    section.innerHTML = "";

    let allBreakdowns = openShiftFilteredBreakdowns.filter(e => moment(e.startTime).format('YYYY-MM-DD') === date);
    let closedBreakdowns = closedShiftFilteredBreakdowns.filter(e => moment(e.breakdown.startTime).format('YYYY-MM-DD') === date);
    

    // Sort out dates for overlaps
    const today = new Date(date + "T" + overlappingShiftEndTime);
    const nightShiftEnd = new Date(date + "T06:00");
    const tomorrowSec = today.setDate(today.getDate() - 1);
    const tomorrowDate = new Date(tomorrowSec);
    const hoursCorrectSec = tomorrowDate.setHours(overlappingShiftStartHour);
    const nightShiftStart = new Date(hoursCorrectSec);


    if(shiftSelected[0].value === overlappingShiftName){
        console.log("Shift selected is night shift for open breakdowns")
        allBreakdowns = openShiftFilteredBreakdowns.filter((e) => (new Date(e.startTime)) >= nightShiftStart && (new Date(e.startTime)) <= nightShiftEnd);
    }

    if(shiftSelected[0].value === overlappingShiftName){
        console.log("Shift selected is night shift for closed breakdowns")
        closedBreakdowns = closedShiftFilteredBreakdowns.filter((e) => (new Date(e.breakdown.startTime)) >= nightShiftStart && (new Date(e.breakdown.startTime)) <= nightShiftEnd);
    }

    const LHDs = allBreakdowns.filter((e) => e.category === "LHD");
    const drillRigs = allBreakdowns.filter((e) => e.category === "drillRig");
    const bolters = allBreakdowns.filter((e) => e.category === "roofBolter");
    const LDVs = allBreakdowns.filter((e) => e.category === "LDV");
    const UVs = allBreakdowns.filter((e) => e.category === "UV");
    const belts = allBreakdowns.filter((e) => e.category === "UGBelts");
    const electrical = allBreakdowns.filter((e) => e.category === "electrical");
    const mechanical = allBreakdowns.filter((e) => e.category === "mechanical");
    const other = allBreakdowns.filter((e) => e.category === "other");

    const closedLHDs = closedBreakdowns.filter((e) => e.breakdown.category === "LHD");
    const closedDrillRigs = closedBreakdowns.filter((e) => e.breakdown.category === "drillRig");
    const closedBolters = closedBreakdowns.filter((e) => e.breakdown.category === "roofBolter");
    const closedLDVs = closedBreakdowns.filter((e) => e.breakdown.category === "LDV");
    const closedUVs = closedBreakdowns.filter((e) => e.breakdown.category === "UV");
    const closedBelts = closedBreakdowns.filter((e) => e.breakdown.category === "UGBelts");
    const closedElectrical = closedBreakdowns.filter((e) => e.breakdown.category === "electrical");
    const closedMechanical = closedBreakdowns.filter((e) => e.breakdown.category === "mechanical");
    const closedOther = closedBreakdowns.filter((e) => e.breakdown.category === "other");

    const allBreakdownsLength = [LHDs.length, drillRigs.length, bolters.length, LDVs.length, UVs.length, belts.length, electrical.length, mechanical.length, other.length ];
    const openBdownsLength = allBreakdownsLength.reduce((i, j) => i + j, 0);

    const closedBreakdownsLength = [closedLHDs.length, closedDrillRigs.length, closedBolters.length, closedLDVs.length, closedUVs.length, closedBelts.length, closedElectrical.length, closedMechanical.length, closedOther.length ];
    const closedBdownsLength = closedBreakdownsLength.reduce((i, j) => i + j, 0);


    const table = `
                <table>
                    <thead>
                        <tr>
                            <th colspan="5">Open Breakdowns (${openBdownsLength})</th>
                        </tr>
                        <tr>
                            <th>CAT</th>
                            <th>ID</th>
                            <th>Section</th>
                            <th>Description</th>
                            <th>Start Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                            ${LHDs.map((e, i, arr) => {
                                if (i === 0) {
                                    return ("<tr><th rowspan=" + (arr.length) + ">LHDs</th>" +
                                            "" +
                                                "<td>" +
                                                    "<a href='/breakdown/"+ e._id + "'>"+ e.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.section.name + "</td>" + 
                                                "<td>" + e.description + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                            "");
                                } else if (i === arr.length - 1){
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/breakdown/"+ e._id + "'>"+ e.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.section.name + "</td>" + 
                                                "<td>" + e.description + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                            "</tr></tr>");
                                } else {
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/breakdown/"+ e._id + "'>"+ e.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.section.name + "</td>" + 
                                                "<td>" + e.description + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                            "</tr>")};
                            }).join("")}
                        
                            
                        
                            ${drillRigs.map((e, i, arr) => {
                                if (i === 0) {
                                    return ("<tr><th rowspan=" + (arr.length) + ">Drill Rigs</th>" +
                                            "" +
                                                "<td>" +
                                                    "<a href='/breakdown/"+ e._id + "'>"+ e.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.section.name + "</td>" + 
                                                "<td>" + e.description + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                            "");
                                } else if (i === arr.length - 1){
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/breakdown/"+ e._id + "'>"+ e.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.section.name + "</td>" + 
                                                "<td>" + e.description + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                            "</tr></tr>");
                                } else {
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/breakdown/"+ e._id + "'>"+ e.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.section.name + "</td>" + 
                                                "<td>" + e.description + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                            "</tr>")};
                            }).join("")}
                        

                        
                            ${bolters.map((e, i, arr) => {
                                if (i === 0) {
                                    return ("<tr><th rowspan=" + (arr.length) + ">Roof Bolters</th>" +
                                            "" +
                                                "<td>" +
                                                    "<a href='/breakdown/"+ e._id + "'>"+ e.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.section.name + "</td>" + 
                                                "<td>" + e.description + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                            "");
                                } else if (i === arr.length - 1){
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/breakdown/"+ e._id + "'>"+ e.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.section.name + "</td>" + 
                                                "<td>" + e.description + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                            "</tr></tr>");
                                } else {
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/breakdown/"+ e._id + "'>"+ e.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.section.name + "</td>" + 
                                                "<td>" + e.description + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                            "</tr>")};
                            }).join("")}
                        

                        
                            ${LDVs.map((e, i, arr) => {
                                if (i === 0) {
                                    return ("<tr><th rowspan=" + (arr.length) + ">LDVs</th>" +
                                            "" +
                                                "<td>" +
                                                    "<a href='/breakdown/"+ e._id + "'>"+ e.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.section.name + "</td>" + 
                                                "<td>" + e.description + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                            "");
                                } else if (i === arr.length - 1){
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/breakdown/"+ e._id + "'>"+ e.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.section.name + "</td>" + 
                                                "<td>" + e.description + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                            "</tr></tr>");
                                } else {
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/breakdown/"+ e._id + "'>"+ e.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.section.name + "</td>" + 
                                                "<td>" + e.description + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                            "</tr>")};
                            }).join("")}
                        

                        
                            ${UVs.map((e, i, arr) => {
                                if (i === 0) {
                                    return ("<tr><th rowspan=" + (arr.length) + ">UVs</th>" +
                                            "" +
                                                "<td>" +
                                                    "<a href='/breakdown/"+ e._id + "'>"+ e.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.section.name + "</td>" + 
                                                "<td>" + e.description + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                            "");
                                } else if (i === arr.length - 1){
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/breakdown/"+ e._id + "'>"+ e.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.section.name + "</td>" + 
                                                "<td>" + e.description + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                            "</tr></tr>");
                                } else {
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/breakdown/"+ e._id + "'>"+ e.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.section.name + "</td>" + 
                                                "<td>" + e.description + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                            "</tr>")};
                            }).join("")}
                        
                        
                            ${belts.map((e, i, arr) => {
                                if (i === 0) {
                                    return ("<tr><th rowspan=" + (arr.length) + ">UG Belts</th>" +
                                            "" +
                                                "<td>" +
                                                    "<a href='/breakdown/"+ e._id + "'>"+ e.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.section.name + "</td>" + 
                                                "<td>" + e.description + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                            "");
                                } else if (i === arr.length - 1){
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/breakdown/"+ e._id + "'>"+ e.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.section.name + "</td>" + 
                                                "<td>" + e.description + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                            "</tr></tr>");
                                } else {
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/breakdown/"+ e._id + "'>"+ e.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.section.name + "</td>" + 
                                                "<td>" + e.description + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                            "</tr>")};
                            }).join("")}
                        
                        
                            ${electrical.map((e, i, arr) => {
                                if (i === 0) {
                                    return ("<tr><th rowspan=" + (arr.length) + ">Electrical</th>" +
                                            "" +
                                                "<td>" +
                                                    "<a href='/breakdown/"+ e._id + "'>"+ e.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.section.name + "</td>" + 
                                                "<td>" + e.description + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                            "");
                                } else if (i === arr.length - 1){
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/breakdown/"+ e._id + "'>"+ e.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.section.name + "</td>" + 
                                                "<td>" + e.description + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                            "</tr></tr>");
                                } else {
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/breakdown/"+ e._id + "'>"+ e.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.section.name + "</td>" + 
                                                "<td>" + e.description + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                            "</tr>")};
                            }).join("")}
                        
                        
                            ${mechanical.map((e, i, arr) => {
                                if (i === 0) {
                                    return ("<tr><th rowspan=" + (arr.length) + ">Mechanical</th>" +
                                            "" +
                                                "<td>" +
                                                    "<a href='/breakdown/"+ e._id + "'>"+ e.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.section.name + "</td>" + 
                                                "<td>" + e.description + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                            "");
                                } else if (i === arr.length - 1){
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/breakdown/"+ e._id + "'>"+ e.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.section.name + "</td>" + 
                                                "<td>" + e.description + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                            "</tr></tr>");
                                } else {
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/breakdown/"+ e._id + "'>"+ e.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.section.name + "</td>" + 
                                                "<td>" + e.description + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                            "</tr>")};
                            }).join("")}

                            ${other.map((e, i, arr) => {
                                if (i === 0) {
                                    return ("<tr><th rowspan=" + (arr.length) + ">Other</th>" +
                                            "" +
                                                "<td>" +
                                                    "<a href='/breakdown/"+ e._id + "'>"+ e.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.section.name + "</td>" + 
                                                "<td>" + e.description + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                            "");
                                } else if (i === arr.length - 1){
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/breakdown/"+ e._id + "'>"+ e.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.section.name + "</td>" + 
                                                "<td>" + e.description + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                            "</tr></tr>");
                                } else {
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/breakdown/"+ e._id + "'>"+ e.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.section.name + "</td>" + 
                                                "<td>" + e.description + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                            "</tr>")};
                            }).join("")}
                        
                    </tbody>
                </table>
    `;

    const table2 = `<table>
                    <thead>
                        <tr>
                            <th colspan="8">Closed Breakdowns (${closedBdownsLength})</th>
                        </tr>
                        <tr>
                            <th>CAT</th>
                            <th>ID</th>
                            <th>Section</th>
                            <th>Description</th>
                            <th>Artisan Desc</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Downtime</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                            ${closedLHDs.map((e, i, arr) => {
                                if (i === 0) {
                                    return ("<tr><th rowspan=" + (arr.length) + ">LHDs</th>" +
                                            "" +
                                                "<td>" +
                                                    "<a href='/closedBreakdowns/"+ e._id + "'>"+ e.breakdown.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.breakdown.section.name + "</td>" + 
                                                "<td>" + e.breakdown.description + "</td>" + 
                                                "<td>" + e.comments + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                                "<td>" + e.end + "</td>" + 
                                                "<td>" + e.downtime + "</td>" + 
                                            "");
                                } else if (i === arr.length - 1){
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/closedBreakdowns/"+ e._id + "'>"+ e.breakdown.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.breakdown.section.name + "</td>" + 
                                                "<td>" + e.breakdown.description + "</td>" + 
                                                "<td>" + e.comments + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                                "<td>" + e.end + "</td>" + 
                                                "<td>" + e.downtime + "</td>" + 
                                            "</tr></tr>");
                                } else {
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/closedBreakdowns/"+ e._id + "'>"+ e.breakdown.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.breakdown.section.name + "</td>" + 
                                                "<td>" + e.breakdown.description + "</td>" + 
                                                "<td>" + e.comments + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                                "<td>" + e.end + "</td>" + 
                                                "<td>" + e.downtime + "</td>" + 
                                            "</tr>")};
                            }).join("")}
                        
                            
                        
                            ${closedDrillRigs.map((e, i, arr) => {
                                if (i === 0) {
                                    return ("<tr><th rowspan=" + (arr.length) + ">Drill Rigs</th>" +
                                            "" +
                                                "<td>" +
                                                    "<a href='/closedBreakdowns/"+ e._id + "'>"+ e.breakdown.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.breakdown.section.name + "</td>" + 
                                                "<td>" + e.breakdown.description + "</td>" + 
                                                "<td>" + e.comments + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                                "<td>" + e.end + "</td>" + 
                                                "<td>" + e.downtime + "</td>" + 
                                            "");
                                } else if (i === arr.length - 1){
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/closedBreakdowns/"+ e._id + "'>"+ e.breakdown.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.breakdown.section.name + "</td>" + 
                                                "<td>" + e.breakdown.description + "</td>" + 
                                                "<td>" + e.comments + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                                "<td>" + e.end + "</td>" + 
                                                "<td>" + e.downtime + "</td>" + 
                                            "</tr></tr>");
                                } else {
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/closedBreakdowns/"+ e._id + "'>"+ e.breakdown.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.breakdown.section.name + "</td>" + 
                                                "<td>" + e.breakdown.description + "</td>" + 
                                                "<td>" + e.comments + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                                "<td>" + e.end + "</td>" + 
                                                "<td>" + e.downtime + "</td>" + 
                                            "</tr>")};
                            }).join("")}
                        

                        
                            ${closedBolters.map((e, i, arr) => {
                                if (i === 0) {
                                    return ("<tr><th rowspan=" + (arr.length) + ">Roof Bolters</th>" +
                                            "" +
                                                "<td>" +
                                                    "<a href='/closedBreakdowns/"+ e._id + "'>"+ e.breakdown.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.breakdown.section.name + "</td>" + 
                                                "<td>" + e.breakdown.description + "</td>" + 
                                                "<td>" + e.comments + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                                "<td>" + e.end + "</td>" + 
                                                "<td>" + e.downtime + "</td>" + 
                                            "");
                                } else if (i === arr.length - 1){
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/closedBreakdowns/"+ e._id + "'>"+ e.breakdown.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.breakdown.section.name + "</td>" + 
                                                "<td>" + e.breakdown.description + "</td>" + 
                                                "<td>" + e.comments + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                                "<td>" + e.end + "</td>" + 
                                                "<td>" + e.downtime + "</td>" + 
                                            "</tr></tr>");
                                } else {
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/closedBreakdowns/"+ e._id + "'>"+ e.breakdown.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.breakdown.section.name + "</td>" + 
                                                "<td>" + e.breakdown.description + "</td>" + 
                                                "<td>" + e.comments + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                                "<td>" + e.end + "</td>" + 
                                                "<td>" + e.downtime + "</td>" + 
                                            "</tr>")};
                            }).join("")}
                        

                        
                            ${closedLDVs.map((e, i, arr) => {
                                if (i === 0) {
                                    return ("<tr><th rowspan=" + (arr.length) + ">LDVs</th>" +
                                            "" +
                                                "<td>" +
                                                    "<a href='/closedBreakdowns/"+ e._id + "'>"+ e.breakdown.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.breakdown.section.name + "</td>" + 
                                                "<td>" + e.breakdown.description + "</td>" + 
                                                "<td>" + e.comments + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                                "<td>" + e.end + "</td>" + 
                                                "<td>" + e.downtime + "</td>" + 
                                            "");
                                } else if (i === arr.length - 1){
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/closedBreakdowns/"+ e._id + "'>"+ e.breakdown.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.breakdown.section.name + "</td>" + 
                                                "<td>" + e.breakdown.description + "</td>" + 
                                                "<td>" + e.comments + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                                "<td>" + e.end + "</td>" + 
                                                "<td>" + e.downtime + "</td>" + 
                                            "</tr></tr>");
                                } else {
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/closedBreakdowns/"+ e._id + "'>"+ e.breakdown.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.breakdown.section.name + "</td>" + 
                                                "<td>" + e.breakdown.description + "</td>" + 
                                                "<td>" + e.comments + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                                "<td>" + e.end + "</td>" + 
                                                "<td>" + e.downtime + "</td>" + 
                                            "</tr>")};
                            }).join("")}
                        

                        
                            ${closedUVs.map((e, i, arr) => {
                                if (i === 0) {
                                    return ("<tr><th rowspan=" + (arr.length) + ">UVs</th>" +
                                            "" +
                                                "<td>" +
                                                    "<a href='/closedBreakdowns/"+ e._id + "'>"+ e.breakdown.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.breakdown.section.name + "</td>" + 
                                                "<td>" + e.breakdown.description + "</td>" + 
                                                "<td>" + e.comments + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                                "<td>" + e.end + "</td>" + 
                                                "<td>" + e.downtime + "</td>" + 
                                            "");
                                } else if (i === arr.length - 1){
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/closedBreakdowns/"+ e._id + "'>"+ e.breakdown.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.breakdown.section.name + "</td>" + 
                                                "<td>" + e.breakdown.description + "</td>" + 
                                                "<td>" + e.comments + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                                "<td>" + e.end + "</td>" + 
                                                "<td>" + e.downtime + "</td>" + 
                                            "</tr></tr>");
                                } else {
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/closedBreakdowns/"+ e._id + "'>"+ e.breakdown.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.breakdown.section.name + "</td>" + 
                                                "<td>" + e.breakdown.description + "</td>" + 
                                                "<td>" + e.comments + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                                "<td>" + e.end + "</td>" + 
                                                "<td>" + e.downtime + "</td>" + 
                                            "</tr>")};
                            }).join("")}
                        
                        
                            ${closedBelts.map((e, i, arr) => {
                                if (i === 0) {
                                    return ("<tr><th rowspan=" + (arr.length) + ">UG Belts</th>" +
                                            "" +
                                                "<td>" +
                                                    "<a href='/closedBreakdowns/"+ e._id + "'>"+ e.breakdown.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.breakdown.section.name + "</td>" + 
                                                "<td>" + e.breakdown.description + "</td>" + 
                                                "<td>" + e.comments + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                                "<td>" + e.end + "</td>" + 
                                                "<td>" + e.downtime + "</td>" + 
                                            "");
                                } else if (i === arr.length - 1){
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/closedBreakdowns/"+ e._id + "'>"+ e.breakdown.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.breakdown.section.name + "</td>" + 
                                                "<td>" + e.breakdown.description + "</td>" + 
                                                "<td>" + e.comments + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                                "<td>" + e.end + "</td>" + 
                                                "<td>" + e.downtime + "</td>" + 
                                            "</tr></tr>");
                                } else {
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/closedBreakdowns/"+ e._id + "'>"+ e.breakdown.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.breakdown.section.name + "</td>" + 
                                                "<td>" + e.breakdown.description + "</td>" + 
                                                "<td>" + e.comments + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                                "<td>" + e.end + "</td>" + 
                                                "<td>" + e.downtime + "</td>" + 
                                            "</tr>")};
                            }).join("")}
                        
                        
                            ${closedElectrical.map((e, i, arr) => {
                                if (i === 0) {
                                    return ("<tr><th rowspan=" + (arr.length) + ">Electrical</th>" +
                                            "" +
                                                "<td>" +
                                                    "<a href='/closedBreakdowns/"+ e._id + "'>"+ e.breakdown.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.breakdown.section.name + "</td>" + 
                                                "<td>" + e.breakdown.description + "</td>" + 
                                                "<td>" + e.comments + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                                "<td>" + e.end + "</td>" + 
                                                "<td>" + e.downtime + "</td>" + 
                                            "");
                                } else if (i === arr.length - 1){
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/closedBreakdowns/"+ e._id + "'>"+ e.breakdown.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.breakdown.section.name + "</td>" + 
                                                "<td>" + e.breakdown.description + "</td>" + 
                                                "<td>" + e.comments + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                                "<td>" + e.end + "</td>" + 
                                                "<td>" + e.downtime + "</td>" + 
                                            "</tr></tr>");
                                } else {
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/closedBreakdowns/"+ e._id + "'>"+ e.breakdown.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.breakdown.section.name + "</td>" + 
                                                "<td>" + e.breakdown.description + "</td>" + 
                                                "<td>" + e.comments + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                                "<td>" + e.end + "</td>" + 
                                                "<td>" + e.downtime + "</td>" + 
                                            "</tr>")};
                            }).join("")}
                        
                        
                            ${closedMechanical.map((e, i, arr) => {
                                if (i === 0) {
                                    return ("<tr><th rowspan=" + (arr.length) + ">Mechanical</th>" +
                                            "" +
                                                "<td>" +
                                                    "<a href='/closedBreakdowns/"+ e._id + "'>"+ e.breakdown.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.breakdown.section.name + "</td>" + 
                                                "<td>" + e.breakdown.description + "</td>" + 
                                                "<td>" + e.comments + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                                "<td>" + e.end + "</td>" + 
                                                "<td>" + e.downtime + "</td>" + 
                                            "");
                                } else if (i === arr.length - 1){
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/closedBreakdowns/"+ e._id + "'>"+ e.breakdown.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.breakdown.section.name + "</td>" + 
                                                "<td>" + e.breakdown.description + "</td>" + 
                                                "<td>" + e.comments + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                                "<td>" + e.end + "</td>" + 
                                                "<td>" + e.downtime + "</td>" + 
                                            "</tr></tr>");
                                } else {
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/closedBreakdowns/"+ e._id + "'>"+ e.breakdown.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.breakdown.section.name + "</td>" + 
                                                "<td>" + e.breakdown.description + "</td>" + 
                                                "<td>" + e.comments + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                                "<td>" + e.end + "</td>" + 
                                                "<td>" + e.downtime + "</td>" + 
                                            "</tr>")};
                            }).join("")}

                            ${closedOther.map((e, i, arr) => {
                                if (i === 0) {
                                    return ("<tr><th rowspan=" + (arr.length) + ">Other</th>" +
                                            "" +
                                                "<td>" +
                                                    "<a href='/closedBreakdowns/"+ e._id + "'>"+ e.breakdown.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.breakdown.section.name + "</td>" + 
                                                "<td>" + e.breakdown.description + "</td>" + 
                                                "<td>" + e.comments + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                                "<td>" + e.end + "</td>" + 
                                                "<td>" + e.downtime + "</td>" + 
                                            "");
                                } else if (i === arr.length - 1){
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/closedBreakdowns/"+ e._id + "'>"+ e.breakdown.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.breakdown.section.name + "</td>" + 
                                                "<td>" + e.breakdown.description + "</td>" + 
                                                "<td>" + e.comments + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                                "<td>" + e.end + "</td>" + 
                                                "<td>" + e.downtime + "</td>" + 
                                            "</tr></tr>");
                                } else {
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/closedBreakdowns/"+ e._id + "'>"+ e.breakdown.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.breakdown.section.name + "</td>" + 
                                                "<td>" + e.breakdown.description + "</td>" + 
                                                "<td>" + e.comments + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                                "<td>" + e.end + "</td>" + 
                                                "<td>" + e.downtime + "</td>" + 
                                            "</tr>")};
                            }).join("")}
                        
                    </tbody>
                </table>`


    section.innerHTML = table + "<hr>" + table2
}

if (document.getElementById("breakdown-date")) {
  document.getElementById("breakdown-date").oninput();
}

//Filters Item/TMMID based on what catergory is selected
function filterItem(el, tmms){ //triggered by onchange listener
    //el is the select tag category
    const allTMMs = JSON.parse(tmms);
    const itemsSelect = document.getElementById("equipment"); //This is a select tag for items
    const itemsInput = document.getElementById("equipment2"); //This is an input tag for other items
    const selectedCatItems = allTMMs.filter(e => e.category === el.value);
    if(el.value !== "other"){
        itemsSelect.disabled = false;
        itemsSelect.hidden = false;
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < selectedCatItems.length; i++) {
            const option = document.createElement("option");
            option.value = selectedCatItems[i].name;
            option.innerText = selectedCatItems[i].name;
            fragment.append(option);
        }
        const optionOther = document.createElement("option");
        optionOther.value = "other";
        optionOther.innerText = "other";
        fragment.append(optionOther);
        itemsSelect.innerHTML = "";
        itemsSelect.setAttribute("name", "breakdown[equipment]");
        itemsSelect.append(fragment);
		itemsInput.hidden = true;
		itemsInput.required = false;
        itemsInput.name = "";
        itemsInput.disabled = true;
        itemsSelect.onchange();
        return;
    }
    
    itemsSelect.setAttribute("name", "")
    itemsSelect.hidden = true;
    itemsSelect.required = true;
    itemsInput.disabled = false;    //Look at this line
    itemsInput.hidden = false;
    itemsSelect.onchange();
}


//Creating text input for other
function filterItemID(e) {
	if (e.value === "other") {
        e.hidden = true; // e is the select tag for items
        e.required = false;
        e.setAttribute("name", ""); // removing name attribute from the name tag
        e.disabled = true;

        const itemsInput = document.getElementById("equipment2"); //This is an input tag for other items
        itemsInput.disabled = false;
        itemsInput.hidden = false;
        itemsInput.setAttribute("name", "breakdown[equipment]");
        itemsInput.required = true;
        return;
	}

	if (e.value !== "other") {
		console.log("Inside filter itemID. Item is not  other");
	}
}

// Now dealing with breakdown availabilities, utilisation and reliability
if (document.getElementById("foundBreakdowns")) {
	document.getElementById("startdate").value = htmlStartDate;
	document.getElementById("enddate").value = htmlDate;
    filterBreakdowns()
}

function filterBreakdowns(){
    const foundBreakdowns = document.getElementById("foundBreakdowns").innerText;
    const parsedFoundBreakdowns = JSON.parse(foundBreakdowns);
    const start = document.getElementById("startdate").value
    const end = document.getElementById("enddate").value
    console.log(start)
    console.log(end)
    const data = parsedFoundBreakdowns.filter((e) => moment(e.created).format("YYYY-MM-DD") >= start && moment(e.created).format("YYYY-MM-DD") <= end);
    // console.log(data)
    // console.log(parsedFoundBreakdowns)

    const MORNING = data.filter((e) => e.breakdown.shift === "morning");
	const AFTERNOON = data.filter((e) => e.breakdown.shift === "afternoon");
	const NIGHT = data.filter((e) => e.breakdown.shift === "night");
    
    // Getting availabilty
    const availFinalMorning = getAvailabilityForMorning(MORNING)
    const availFinalANoon = getAvailabilityForANoon(AFTERNOON)
    const availFinalNight = getAvailabilityForNight(NIGHT)

    // Getting utilisation
    const utilMorning = getUtilisationForMorning(MORNING)
    const utilANoon = getUtilisationForANoon(AFTERNOON)
    const utilNight = getUtilisationForNight(NIGHT)

    // Getting reliability
    const reliabilityMorning = getReliabilityForMorning(MORNING)
    const reliabilityANoon = getReliabilityForANoon(AFTERNOON)
    const reliabilityNight = getReliabilityForNight(NIGHT)

    document.getElementById("morning-availability").innerText = availFinalMorning;
    document.getElementById("afternoon-availability").innerText = availFinalANoon;
    document.getElementById("night-availability").innerText = availFinalNight;

    document.getElementById("morning-utilisation").innerText = utilMorning;
    document.getElementById("afternoon-utilisation").innerText = utilANoon;
    document.getElementById("night-utilisation").innerText = utilNight;

    document.getElementById("morning-reliability").innerText = reliabilityMorning;
    document.getElementById("afternoon-reliability").innerText = reliabilityANoon;
    document.getElementById("night-reliability").innerText = reliabilityNight;
}

function convertTimesToSeconds(str){
    const DT = str.split(":");
	const hours = Number(DT[0]) * 60 * 60;
	const minutes = Number(DT[1]) * 60;
    const DTinSeconds = hours + minutes;
    return DTinSeconds;
}

// Availabilty Functions
// 1. Getting availability for morning shift
function getAvailabilityForMorning(arr){
    const DTs = arr.map((e) => e.downtime);
	const DTs2 = DTs.map((e) => convertTimesToSeconds(e));
	const DTs3 = DTs2.reduce((i, j) => i + j, 0);
	const avail = ((8.5 * 60 * 60 - DTs3) / (8.5 * 60 * 60)) * 100;
	let availFinal = Math.round(avail);
	if (avail < 10) {
		availFinal = (Math.round(avail * 100) / 100).toFixed(2);
	}
    return availFinal;
}

// 2.Getting availability for afternoon shift
function getAvailabilityForANoon(arr){
    const DTs = arr.map((e) => e.downtime);
	const DTs2 = DTs.map((e) => convertTimesToSeconds(e));
	const DTs3 = DTs2.reduce((i, j) => i + j, 0);
	const avail = ((8.5 * 60 * 60 - DTs3) / (8.5 * 60 * 60)) * 100;
	let availFinal = Math.round(avail);
	if (avail < 10) {
		availFinal = (Math.round(avail * 100) / 100).toFixed(2);
	}
    return availFinal;
}

// 3. Getting availability for night shift
function getAvailabilityForNight(arr){
    const DTs = arr.map((e) => e.downtime);
	const DTs2 = DTs.map((e) => convertTimesToSeconds(e));
	const DTs3 = DTs2.reduce((i, j) => i + j, 0);
	const avail = ((8.5 * 60 * 60 - DTs3) / (8.5 * 60 * 60)) * 100;
	let availFinal = Math.round(avail);
	if (avail < 10) {
		availFinal = (Math.round(avail * 100) / 100).toFixed(2);
	}
    return availFinal;
}

// Utilisation Functions
// 1. Getting utlisation for morning shift
function getUtilisationForMorning(arr){
    const DTs = arr.map((e) => e.downtime);
	const DTs2 = DTs.map((e) => convertTimesToSeconds(e));
	const DTs3 = DTs2.reduce((i, j) => i + j, 0);
    const standbyHours = 0
    const totalHours = 8.5 * 60 * 60;
	const util = ((totalHours - DTs3 - standbyHours) / (totalHours - DTs3)) * 100;
	let utilFinal = Math.round(util);
	if (totalHours === DTs3) {
		utilFinal = 0;
	}
    return utilFinal;
}

// 2. Getting utlisation for afternoon shift
function getUtilisationForANoon(arr){
    const DTs = arr.map((e) => e.downtime);
	const DTs2 = DTs.map((e) => convertTimesToSeconds(e));
	const DTs3 = DTs2.reduce((i, j) => i + j, 0);
	const standbyHours = 0;
	const totalHours = 8.5 * 60 * 60;
	const util = ((totalHours - DTs3 - standbyHours) / (totalHours - DTs3)) * 100;
	let utilFinal = Math.round(util);
	if (totalHours === DTs3) {
		utilFinal = 0;
	}
	return utilFinal;
}

// 3. Getting utlisation for night shift
function getUtilisationForNight(arr){
    const DTs = arr.map((e) => e.downtime);
	const DTs2 = DTs.map((e) => convertTimesToSeconds(e));
	const DTs3 = DTs2.reduce((i, j) => i + j, 0);
	const standbyHours = 0;
	const totalHours = 8.5 * 60 * 60;
	const util = ((totalHours - DTs3 - standbyHours) / (totalHours - DTs3)) * 100;
	let utilFinal = Math.round(util);
	if (totalHours === DTs3) {
		utilFinal = 0;
	}
	return utilFinal;
}

// Reliability Functions
// 1. Getting reliability for morning shift
function getReliabilityForMorning(arr){
    const failures = arr.length
    const DTs = arr.map((e) => e.downtime);
	const DTs2 = DTs.map((e) => convertTimesToSeconds(e));
	const DTs3 = DTs2.reduce((i, j) => i + j, 0);
    const totalHours = 8.5 * 60 * 60;
    const standbyHours = 0 * 60 * 60
    let reliability;
    if(failures > 0){
        reliability = ((((totalHours - DTs3 - standbyHours) / (failures))) / 3600).toFixed(2);
    }
    console.log(reliability)
	
    return reliability;
}

// 2. Getting reliability for afternoon shift
function getReliabilityForANoon(arr){
    const failures = arr.length
    const DTs = arr.map((e) => e.downtime);
	const DTs2 = DTs.map((e) => convertTimesToSeconds(e));
	const DTs3 = DTs2.reduce((i, j) => i + j, 0);
    const totalHours = 8.5 * 60 * 60;
    const standbyHours = 60 * 60
    let reliability;
    if(failures > 0){
        reliability = ((totalHours - DTs3 - standbyHours) / (failures)).toFixed(2);
    }
    console.log(reliability)
	
    return reliability;
}

// 2. Getting reliability for night shift
function getReliabilityForNight(arr){
    const failures = arr.length
    const DTs = arr.map((e) => e.downtime);
	const DTs2 = DTs.map((e) => convertTimesToSeconds(e));
	const DTs3 = DTs2.reduce((i, j) => i + j, 0);
    const totalHours = 8.5 * 60 * 60;
    const standbyHours = 60 * 60
    let reliability;
    if(failures > 0){
        reliability = ((totalHours - DTs3 - standbyHours) / (failures)).toFixed(2);
    }
    console.log(reliability)
	
    return reliability;
}