const server = 'http://localhost:3000';
var studentId;
var studentName;

async function fetchStudents() {
    try {
        const url = server + '/students';
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-store'
            }
        }
        const response = await fetch(url, options);
        const students = await response.json();
        console.log("Fetched students:", students); // Debugging
        // Call fetchAttendance and pass it to populateContent
        const attendanceData = await fetchAttendance();
        populateContent(students, attendanceData); // Call populateContent with students and attendanceData
    } catch (error) {
        console.error('Error fetching students:', error);
    }
}

async function fetchAttendance() {
    const url = server + '/attendance';
    const options = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-store'
        }
    }
    const response = await fetch(url, options);
    const attendanceData = await response.json();
    return attendanceData;
}



function calculateScore(studentId, attendanceData) {
    const dates = Object.keys(attendanceData);
    let totalScore = 0;
    let totalDaysPresent = 0;
    let totalDaysExcused = 0;

    dates.forEach(date => {
        const status = attendanceData[date][studentId]?.status || '-';
        if (status === 'present') {
            totalScore += 100;
            totalDaysPresent++;
        } else if (status === 'absent') {
            totalScore += 0;
        } else if (status === 'excused') {
            totalDaysExcused++;
        }
    });

    // Exclude excused days from the total number of days
    const totalDays = dates.length - totalDaysExcused;
    const score = totalDays === 0 ? 0 : totalScore / totalDays;
    return score.toFixed(2); // Return the score rounded to 2 decimal places
}
async function populateContent(students, attendanceData) {
    var studentTable = document.getElementById('student-info-table').getElementsByTagName('tbody')[0];
    var datesTable = document.getElementById('dates-table').getElementsByTagName('thead')[0];
    var attendanceTable = document.getElementById('dates-table').getElementsByTagName('tbody')[0];
    studentTable.innerHTML = '';
    datesTable.innerHTML = '';
    attendanceTable.innerHTML = '';
    

    // Populate student info table
    students.forEach(student => {
        var row = studentTable.insertRow();
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        cell1.textContent = student.id;
        cell2.textContent = student.name;
        cell3.textContent = calculateScore(student.id, attendanceData);
    });

    // Populate dates as headers with clickable links
    const dates = Object.keys(attendanceData);
    var datesRow = datesTable.insertRow();
    dates.forEach(date => {
        var headerCell = document.createElement('th');
        var dateLink = document.createElement('a');
        dateLink.textContent = date;
        dateLink.href = '/edit?date=' + encodeURIComponent(date); ; // Edit link
        headerCell.appendChild(dateLink);
        datesRow.appendChild(headerCell);
    });

    // Populate student attendance data
    students.forEach(student => {
        var row = attendanceTable.insertRow();
        dates.forEach(date => {
            var cell = row.insertCell();
            var status = attendanceData[date][student.id]?.status || '-';
            switch (status) {
                case 'present':
                    cell.textContent = '✔️'; // Tick symbol
                    break;
                case 'absent':
                    cell.textContent = '❌'; // Cross symbol
                    break;
                case 'excused':
                    cell.textContent = '⚠️'; // Caution symbol for excused
                    break;
                default:
                    cell.textContent = '-';
            }
        });
    });
}






// Function to calculate the score based on attendance data for a student
function calculateScore(studentId, attendanceData) {
    const dates = Object.keys(attendanceData);
    let score = 0;
    let excusedCount = 0;
    dates.forEach(date => {
        if (attendanceData[date][studentId]) {
            switch (attendanceData[date][studentId].status) {
                case 'present':
                    score += 100;
                    break;
                case 'absent':
                    score += 0;
                    break;
                case 'excused':
                    excusedCount++;
                    break;
            }
        }
    });
    const totalDates = dates.length - excusedCount;
    if (totalDates === 0) {
        return '-';
    } else {
        return Math.round(score / totalDates) + '%';
    }
}




//Registering a student

var studentId;
var studentName;



async function addStudent() {
    const url = server + '/students';
    const student = {id: studentId, name: studentName};
    const options = {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(student)
    }
    const response = await fetch(url, options);
    alert("Student added successfully!");
    closeAdd(); 
}

document.querySelector('form').addEventListener('submit',async (e) => {
    studentId = document.getElementById('studentId').value;
    studentName = document.getElementById('studentName').value;
    if (studentId && studentName) {
        studentId = parseInt(studentId);
        //if(typeof studentId==='Number'){
            await addStudent();
          //  await fetchStudents();
           
       // }
      
           
       
    }
    e.preventDefault();
});


function openAdd() {
    var modal = document.getElementById("myModal");
    modal.style.display = "block";
}

function closeAdd() {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
}

