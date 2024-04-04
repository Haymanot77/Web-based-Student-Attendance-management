

//Registering a student

var studentId;
var studentName;




async function hasAttendanceData() {
    try {
        const response = await fetch(`${server}/attendance`);
        if (!response.ok) {
            throw new Error('Failed to fetch attendance data');
        }
        const data = await response.json();
        return Object.keys(data).length > 0; // Check if there is any attendance data
    } catch (error) {
        console.error('Error fetching attendance data:', error);
        return false; // Return false if an error occurs
    }
}
// Function to toggle attendance selection based on whether attendance data exists
async function toggleAttendanceSelection() {
    const attendanceSelection = document.getElementById('attendanceSelection');
    if (await hasAttendanceData()) {
        attendanceSelection.style.display = 'block'; // Show attendance selection
    } else {
        attendanceSelection.style.display = 'none'; // Hide attendance selection
    }
}

// Call toggleAttendanceSelection on page load
toggleAttendanceSelection();




async function addStudent() {
    const url = server + '/students';
    const student = {
        id: studentId,
        name: studentName,
        attendanceStatus: document.getElementById('attendanceStatus') ? document.getElementById('attendanceStatus').value : null // Get the attendance status if available
    };

//   // Check if student with the same ID already exists
//    const existingStudents = await fetchStudentData();
//    const studentExists = existingStudents.some(existingStudent => existingStudent.id === studentId);
//   if (studentExists) {
//     const confirmed = confirm("A student with this ID already exists. try again?");
//     if (!confirmed) {
//         return; // Exit function if user cancels deletion
//     }
//     else{
//     openAdd();
//     return;
//     }
    
//    }


    
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(student)
    };
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error('Failed to add student');
    }
    // Update attendance status for all dates that have been marked for other students
    const attendanceResponse = await fetch(`${server}/attendance`);
    const attendanceData = await attendanceResponse.json();
    const dates = Object.keys(attendanceData);
    const updatedAttendanceData = {};
    dates.forEach(date => {
        if (!attendanceData[date][student.id]) {
            // Update attendance status for the student if not already marked
            attendanceData[date][student.id] = student.attendanceStatus || 'late'; // Use the attendance status if available, otherwise default to 'late'
        }
        updatedAttendanceData[date] = attendanceData[date];
    });
    const attendanceOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedAttendanceData)
    };
    await fetch(`${server}/attendance`, attendanceOptions);
    alert("Student added successfully!");
    closeAdd();
}


document.querySelector('#addStudent').addEventListener('click', async (e) => {
    e.preventDefault();
    studentId = document.getElementById('studentId').value;
    studentName = document.getElementById('studentName').value;
    if (studentId && studentName) {
        studentId = parseInt(studentId);
// Check if student with the same ID already exists
   const existingStudents = await fetchStudentData();
   const studentExists = existingStudents.some(existingStudent => existingStudent.id === studentId);
  if (studentExists) {
    const confirmed = confirm("A student with this ID already exists. try again?");
    if (!confirmed) {
        return; // Exit function if user cancels deletion
    }
    else{
    openAdd();
    document.getElementById('studentId').value = '';
    document.getElementById('studentName').value = '';
    return;
    }
    
   }
        //if(typeof studentId==='Number'){
        await addStudent();
        //  await fetchStudents();
        // }
    }
   
});




function openAdd() {
    var modal = document.getElementById("myModal");
    modal.style.display = "block";
}

function closeAdd() {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
}

