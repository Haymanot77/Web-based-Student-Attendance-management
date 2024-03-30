// Function to format date as YYYY-MM-DD
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Set the current date in the Date column
const currentDate = new Date();
document.getElementById('date').textContent = formatDate(currentDate);

// Function to fetch student data from JSON file
async function fetchStudentData() {
    try {
      var  server='http://localhost:3000';
        const url = server + '/students';
        const options = {
            method: 'GET',
            headers: {
                'Accept' : 'application/json',
                'Cache-Control' : 'no-store'
            }
        }
        const response = await fetch(url, options);
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching student data:', error);
        return [];
    }
}



// Function to populate the table with student data
async function populateStudentTable() {
    const studentData = await fetchStudentData();
    const tbody = document.getElementById('studentDataBody');

    // Clear existing rows
    tbody.innerHTML = '';

    // Populate table with student data
    studentData.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td class="status present">-</td>
            <td class="status absent">-</td>
            <td class="status excused">-</td>
        `;
        tbody.appendChild(row);
    });
}

// Call the function to populate the table on page load
populateStudentTable();

// Function to handle marking attendance
// Function to handle marking attendance
function markAttendance(cell) {
    const statuses = ['present', 'absent', 'excused'];
    const currentStatus = cell.className.split(' ')[1];
    const newStatus = statuses.find(status => status == currentStatus);

    // Set symbol based on status
    let symbol;
    switch (newStatus) {
        case 'present':
            symbol = '✔️';
            break;
        case 'absent':
            symbol = '❌';
            break;
        case 'excused':
            symbol = '⚠️';
            break;
        default:
            symbol = '-';
    }

    // Update cell content and class
    cell.textContent = symbol;
    cell.className = `status ${newStatus}`;

    // Clear other statuses in the same row
    const siblings = cell.parentNode.children;
    Array.from(siblings).forEach(sibling => {
        if (sibling.classList.contains('status') && sibling !== cell) {
            sibling.classList.remove('selected');
            sibling.textContent = '-';
        }
    });
}

// Add event listeners to the cells for marking attendance
document.querySelectorAll('.status').forEach(cell => {
    cell.addEventListener('click', function () {
        markAttendance(this);
    });
});


// Add event listeners to the cells for marking attendance
document.querySelectorAll('td .status').forEach(cell => {
    cell.addEventListener('click', function () {
        markAttendance(this);
    });
});

/*
// Server interaction
/*const server = 'http://localhost:3000';

document.getElementById('attendanceForm').addEventListener('submit', async (e) => {
    const studentId = document.getElementById('studentId').value;
    const studentName = document.getElementById('studentName').value;

    if (studentId && studentName) {
        const attendanceData = {};
        const date = document.getElementById('date').textContent;

        document.querySelectorAll('.status.selected').forEach(cell => {
            const row = cell.parentNode;
            const studentID = row.querySelector('
*/