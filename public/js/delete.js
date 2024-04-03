const server = 'http://localhost:3000';
async function fetchStudentData() {
    try {
      const response = await fetch(`${server}/students`);
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
    const studentList = document.getElementById('studentList');

    // Clear existing rows
    studentList.innerHTML = '';

    // Populate table with student data
    studentData.forEach(student => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${student.id}</td>
        <td>${student.name}</td>
        <td><button class="delete-btn" data-id="${student.id}">❌</button></td>
      `;
      studentList.appendChild(row);
    });
  }

  // Call the function to populate the table on page load
  populateStudentTable();

  // Function to delete student entry
  async function deleteStudent(id) {
    try {
        // Ask user for confirmation before deleting the student
        const confirmed = confirm("Are you sure you want to delete this student?");
        if (!confirmed) {
            return; // Exit function if user cancels deletion
        }

        // Make DELETE request to server to delete the student
        const response = await fetch(`/students/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            // Student deleted successfully
            const jsonData = await response.json();
            if (Object.keys(jsonData).length === 0) {
                // JSON file is empty, update HTML to show "No students available"
                document.getElementById('studentTable').innerHTML = '<tr><td colspan="3">No students available</td></tr>';
            } else {
                // Remove the deleted student record from the HTML table
                const studentRow = document.getElementById(`student-row-${id}`);
                if (studentRow) {
                    studentRow.remove();
                }
            }
        } else {
            throw new Error('Failed to delete student');
        }
    } catch (error) {
        console.error('Error deleting student:', error);
    }
}

// Event listener for delete buttons
document.addEventListener('click', async function(event) {
    if (event.target.classList.contains('delete-btn')) {
        const id = event.target.getAttribute('data-id');
        await deleteStudent(id);
        updateStudentTable();
    }
});

// Example usage to update HTML after deletion (inside deleteStudent function)
const studentTable = document.getElementById('studentTable'); // Assuming 'studentTable' is the ID of the HTML table

// Check if the data array is empty
if (data.length === 0) {
    // If the array is empty, update HTML to show "No students available"
    studentTable.innerHTML = '<tr><td colspan="3">No students available</td></tr>';
} else {
    updateStudentTable();
}

// Function to update the display of student data
async function updateStudentTable() {
    try {
        // Fetch student data from the server
        const response = await fetch(`${server}/students`);
        const studentData = await response.json();

        // Clear existing student table
        const studentList = document.getElementById('studentList');
        studentList.innerHTML = '';

        // Populate student table with updated data
        studentData.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td><button class="delete-btn" data-id="${student.id}">❌</button></td>
            `;
            studentList.appendChild(row);
        });
    } catch (error) {
        console.error('Error updating student table:', error);
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

