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
        const response = await fetch('student.json');
        let data = await response.json();

        // Filter out the student with the specified ID
        data = data.filter(student => student.id !== id);

        // Write updated data back to the JSON file
        await fetch('student.json', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        // Repopulate the table
        populateStudentTable();
    } catch (error) {
        console.error('Error deleting student:', error);
    }
}

// Event listener for delete buttons
document.addEventListener('click', async function(event) {
    if (event.target.classList.contains('delete-btn')) {
        const id = event.target.getAttribute('data-id');
        await deleteStudent(id);
    }
});
