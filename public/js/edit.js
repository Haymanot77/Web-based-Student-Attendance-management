var server = 'http://localhost:3000';
// Function to create a table row for a student
// Function to create a table row for a student with attendance data
// Function to create a table row for a student with attendance data
// Function to create a table row for a student with attendance data

// Function to fetch student data from JSON file
// Function to fetch student data from JSON file
async function fetchStudentData() {
    try {
        const url = `${server}/students`;
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-store'
            }
        };
        const response = await fetch(url, options);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching student data:', error);
        return [];
    }
}

// Function to fetch attendance data for a specific date
async function fetchAttendanceData(date) {
    try {
        const url = `${server}/attendance?date=${date}`;
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-store'
            }
        };
        const response = await fetch(url, options);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching attendance data for ${date}:`, error);
        return {};
    }
}

// Function to create a table row for a student with attendance data
function createStudentRow(student, attendanceData, date) {
    const row = document.createElement('tr');
    const idCell = document.createElement('td');
    const nameCell = document.createElement('td');
   // const scoreCell = document.createElement('td');
    const presentCell = document.createElement('td');
    const absentCell = document.createElement('td');
    const excusedCell = document.createElement('td');

    idCell.textContent = student.id;
    nameCell.textContent = student.name;
    //scoreCell.textContent = ''; // Initial value for score cell

    const studentAttendance = attendanceData[date] && attendanceData[date][student.id]; // Check if attendance data is available for the date
    const status = studentAttendance ? studentAttendance.status : '-';

    switch (status) {
        case 'present':
            presentCell.textContent = '✔️';
            presentCell.classList.add('status', 'present');
            break;
        case 'absent':
            absentCell.textContent = '❌';
            absentCell.classList.add('status', 'absent');
            break;
        case 'excused':
            excusedCell.textContent = '⚠️';
            excusedCell.classList.add('status', 'excused');
            break;
        case 'late':
        
            presentCell.textContent= 'late registration';
            absentCell.textContent = '';
            excusedCell.textContent= ''; // Set status to absent if it was late
            presentCell.disabled = true; // Disable the cell
            absentCell.disabled=true;
            excusedCell.disabled=true;
            presentCell.classList.add('status', 'late');
            break;
        default:
            presentCell.textContent = '-';
            absentCell.textContent = '-';
            excusedCell.textContent = '-';
    }

    // Add click event listeners to status cells for editing
    if (status !== 'late'){
    presentCell.addEventListener('click', () => handleStatusChange(presentCell, 'present'));
    absentCell.addEventListener('click', () => handleStatusChange(absentCell, 'absent'));
    excusedCell.addEventListener('click', () => handleStatusChange(excusedCell, 'excused'));
    }
    row.appendChild(idCell);
    row.appendChild(nameCell);
    //row.appendChild(scoreCell);
    row.appendChild(presentCell);
    row.appendChild(absentCell);
    row.appendChild(excusedCell);

    return row;
}

// Function to handle status change
// Function to handle status change
function handleStatusChange(cell, newStatus) {
    // Clear other statuses in the same row
    const siblings = cell.parentNode.children;
    Array.from(siblings).forEach(sibling => {
        if (sibling.classList.contains('status') && sibling !== cell) {
            sibling.classList.remove('selected');
            sibling.textContent = '-';
        }
    });

    // Set the new status
    cell.textContent = getStatusSymbol(newStatus);
    cell.className = `status ${newStatus}`;
}


// Function to get symbol for status
function getStatusSymbol(status) {
    switch (status) {
        case 'present':
            return '✔️';
        case 'absent':
            return '❌';
        case 'excused':
            return '⚠️';
        case 'late':
            return 'lateregistration'
        default:
            return '-';
    }
}

// Function to populate the table with student data and attendance for a specific date
async function populateStudentTable(date) {
    const studentData = await fetchStudentData();
    const attendanceData = await fetchAttendanceData(date);
    const tbody = document.getElementById('studentDataBody');

    // Clear existing rows
    tbody.innerHTML = '';

    // Populate table with student data
    studentData.forEach(student => {
        const row = createStudentRow(student, attendanceData, date);
        tbody.appendChild(row);
    });
}

// Function to submit attendance data to the server (similar to the one in attendance.js)
// ...

// Extract the date from the URL query parameter
const urlParams = new URLSearchParams(window.location.search);
const date = urlParams.get('date');
if (date) {
    // Set the date in the header
    document.getElementById('date').textContent = date;
    // Populate the student table with attendance data for the given date
    populateStudentTable(date);
} else {
    console.error('Date parameter is missing in the URL.');
}

// Add event listener to the form submit button
document.getElementById('editAttendanceForm').addEventListener('submit', submitAttendance);

// Function to submit attendance data to the server


// Function to submit attendance data to the server
// Function to submit attendance data to the server
async function submitAttendance(event, date) {
    event.preventDefault();

    // Collect attendance data
    const attendanceData = {};
    // Iterate through each row in the table
    document.querySelectorAll('#studentDataBody tr').forEach(row => {
        // Extract student ID from the first cell in the row
        const studentId = row.children[0].textContent;

        // Extract status from the 'Present', 'Absent', and 'Excused' cells
        const presentCell = row.querySelector('.present');
        const absentCell = row.querySelector('.absent');
        const excusedCell = row.querySelector('.excused');

        // Determine the status based on the content of the cells
        let status;
        if (presentCell && presentCell.textContent === '✔️') {
            status = 'present';
        } else if (absentCell && absentCell.textContent === '❌') {
            status = 'absent';
        } else if (excusedCell && excusedCell.textContent === '⚠️') {
            status = 'excused';
        } 
        else {
            status = 'late';
        }
        // Add status to attendance data
        attendanceData[studentId] = { status };
    });

    // Send attendance data to the server
    const attendancePayload = { [date]: attendanceData };

    // Send attendance data to the server
    const url = `${server}/attendance`;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(attendancePayload)
    };

    try {
        const response = await fetch(url, options);
        if (response.ok) {
            alert('Attendance data submitted successfully!');
        } else {
            throw new Error('Failed to submit attendance data');
        }
    } catch (error) {
        console.error('Error submitting attendance data:', error);
        alert('Failed to submit attendance data. Please try again.');
    }
}

// Add event listener to the submit button
document.getElementById('submit').addEventListener('click', function(event) {
    // Extract the date from the URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const date = urlParams.get('date');
    if (date) {
        // Submit the attendance data for the current date
        submitAttendance(event, date);
        window.location.href='/overall';
    } else {
        console.error('Date parameter is missing in the URL.');
    }
});
























