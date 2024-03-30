var server='http://localhost:3000';

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
function createStudentRow(student) {
    const row = document.createElement('tr');
    const idCell = document.createElement('td');
    const nameCell = document.createElement('td');
    const markCell = document.createElement('td');
    const presentCell = document.createElement('td');
    const absentCell = document.createElement('td');
    const excusedCell = document.createElement('td');

    idCell.textContent = student.id;
    nameCell.textContent = student.name;
    markCell.textContent = ''; // Initial value for mark cell
    presentCell.textContent = '-';
    presentCell.classList.add('status', 'present');
    absentCell.textContent = '-';
    absentCell.classList.add('status', 'absent');
    excusedCell.textContent = '-';
    excusedCell.classList.add('status', 'excused');

    row.appendChild(idCell);
    row.appendChild(nameCell);
    row.appendChild(markCell); // Add mark cell to the row
    row.appendChild(presentCell);
    row.appendChild(absentCell);
    row.appendChild(excusedCell);

    return row;
}





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
        const row = createStudentRow(student);
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
    const newStatus = statuses.find(status => status === currentStatus);

    // Set symbol and mark based on status
    let symbol, mark;
    switch (newStatus) {
        case 'present':
            symbol = '✔️';
            mark = '100%';
            break;
        case 'absent':
            symbol = '❌';
            mark = '0';
            break;
        case 'excused':
            symbol = '⚠️';
            mark = '';
            break;
        default:
            symbol = '-';
            mark = '';
    }

    // Update cell content and class
    cell.textContent = symbol;
    cell.className = `status ${newStatus}`;

    // Update mark cell content
    const row = cell.parentNode;
    const markCell = row.querySelector('td:nth-child(3)'); // Assuming mark cell is the third cell
    markCell.textContent = mark;

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
document.getElementById('studentDataBody').addEventListener('click', function(event) {
    const target = event.target;
    if (target.classList.contains('status')) {
        markAttendance(target);
    }
});


//To add the data in to the server 
// Function to submit attendance data to the server
async function submitAttendance(event) {
    event.preventDefault();
    // Collect attendance data
    const presentIds = [];
    const absentIds = [];
    const excusedIds = [];

    document.querySelectorAll('.status').forEach(cell => {
        //const status = cell.classList[1];
        const studentId = cell.parentNode.children[0].textContent; // Assuming student ID is in the first column
        console.log(cell.classList); // Check the class list to find the index of the status class
   
        console.log(cell.classList); // Check the class list to find the index of the status class
        const status = cell.classList.contains('present') ? 'present' :
                       cell.classList.contains('absent') ? 'absent' :
                       cell.classList.contains('excused') ? 'excused' : 'unknown';
        console.log(status);
    console.log(status);
        switch (status) {
            case 'present':
                presentIds.push(studentId);
                break;
            case 'absent':
                absentIds.push(studentId);
                break;
            case 'excused':
                excusedIds.push(studentId);
                break;
            default:
                break;
        }
    });

    // Create attendance data object
    const date = formatDate(new Date());
    const attendanceData = {
        [date]: {
            present: presentIds,
            absent: absentIds,
            excused: excusedIds
        }
    };

    // Send attendance data to the server
    const url = server + '/attendance';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(attendanceData)
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
document.querySelectorAll('#submit').forEach(button => {
    button.addEventListener('click', submitAttendance);
   
});
