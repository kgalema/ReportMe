/*
 * Rendering a production calendar
 * 
 */
// Second version
const date2 = new Date();
const renderCalender2 = function () {
	date2.setDate(1);

	const month2 = date2.getMonth();

    const year2 = date2.getFullYear()

	const monthDays2 = document.querySelector(".days2");

	const lastDay2 = new Date(date2.getFullYear(), date2.getMonth() + 1, 0).getDate();

	const prevLastDay2 = new Date(date2.getFullYear(), date2.getMonth(), 0).getDate();

	const lastDayIndex2 = new Date(date2.getFullYear(), date2.getMonth() + 1, 0).getDay();

	const nextDays2 = 7 - lastDayIndex2 - 1;

	const firstDayIndex2 = date2.getDay();


	const months2 = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	document.querySelector(".date2 th").innerHTML = months2[month2] + " " + year2;

	document.querySelector(".date3 #today").innerHTML = new Date().toDateString();

	let days2 = "";

    let countCellsCreated = 1;
	for (let i = firstDayIndex2; i > 0; i--) {
        if( i === firstDayIndex2){
            days2 += `<tr><td></td>`;
            countCellsCreated++
        } else if (countCellsCreated === 7){
            days2 += `<td></td></tr>`;
			countCellsCreated++;
        } else {
            days2 += `<td></td>`;
			countCellsCreated++;
        }
	}

	for (let i = 1; i <= lastDay2; i++) {
        if(countCellsCreated % 7 === 0){
            if (i === new Date().getDate() && date2.getMonth() === new Date().getMonth()) {
                console.log(new Date().getDate())
                console.log("***************1111111******************")
				days2 += `<td class="today">${i}</td></tr>`;
				countCellsCreated++;
			} else {
				days2 += `<td>${i}</td></tr>`;
				countCellsCreated++;
			}

        } else {
            if (i === new Date().getDate() && date2.getMonth() === new Date().getMonth()) {
                days2 += `<td class="today">${i}</td>`;
                countCellsCreated++;
            } else {
                days2 += `<td>${i}</td>`;
                countCellsCreated++;
            }
        }
        // monthDays2.innerHTML = days2;
	}
	for (let i = 1; i <= nextDays2; i++) {
        if(countCellsCreated % 7 === 0){
            days2 += `<td></td></tr>`;
			countCellsCreated++;
        } else {
            days2 += `<td></td>`;
            countCellsCreated++;
        }
        // monthDays2.innerHTML = days2;
	}

    monthDays2.innerHTML = days2;
    // Use index of something
    const foundDates = document.querySelector("#foundDates").innerText;
    const parsedDates = JSON.parse(foundDates);
    const parsedDates1 = parsedDates.filter(e => new Date(e.date).getFullYear() === year2)
    const parsedDates2 = parsedDates1.filter(e => new Date(e.date).getMonth() === month2)
    const mappedFoundDates = parsedDates2.map((e) => new Date(e.date).getDate());
    const cells = document.querySelectorAll("td");
    cells.forEach((e, i) => {
        if(mappedFoundDates.indexOf(Number(e.innerText)) > -1){
            const index = mappedFoundDates.indexOf(Number(e.innerText));
            const obj = parsedDates2[index];
            e.setAttribute("class", "production-shift");
            e.innerHTML = `<a class="production-day" href="/productionCalendar/${obj._id}">${e.innerText}</a>`;
        }
    })
};


if (document.querySelector(".prev2")) {
    document.querySelector(".prev2").addEventListener("click", () => {
        date2.setMonth(date2.getMonth() - 1);
        renderCalender2();
    });
}

if (document.querySelector(".next2")){
	document.querySelector(".next2").addEventListener("click", () => {
		date2.setMonth(date2.getMonth() + 1);
		renderCalender2();
	});
}

if (window.location.pathname === "/productionCalendar" && document.querySelector(".date2")) {
	renderCalender2();
}

console.timeEnd();
