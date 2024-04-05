const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;
const jsonParser = bodyParser.json();
const fileName = 'students.json';
const attendanceFileName = 'attendance.json';
const path = require('path');

// Load data from file
let rawData = fs.readFileSync(fileName);

let data = JSON.parse(rawData);
let attendanceData = JSON.parse(fs.readFileSync(attendanceFileName));
app.set('views', 'views');
app.set('view engine', 'hbs');
app.use(express.static('public'));

// This is a RESTful GET web service
app.get('/students', (request, response) => {
    data.sort((a, b) => (a.name > b.name) ? 1 : -1 );
    response.send(data);
});
app.get('/attendance', (request, response) => {
  
  response.send(attendanceData);
});


// This is a RESTful POST web service
app.post('/students', jsonParser, (request, response) => {
  datalengh=data.length
  console.log(datalengh)
  if(typeof request.body["id"]!='number') {
      // Handle invalid data
      response.status(400).send("Invalid data format: ID must be a number.");
  } else {
      // Extract student data from request body
      const { id, name, attendanceStatus } = request.body;

      // Add the student to the data array
      data.push({ id, name });

      // Write updated student data back to students.json
      writeStudentsData(data);

      // If attendance status is provided, update attendance data
      if (attendanceStatus) {
          updateAttendanceStatus(id, attendanceStatus);
      }

      // Send response
      response.status(201).send("Student added successfully!");
  }
});

// Function to update attendance status for a student
function updateAttendanceStatus(studentId, status) {
  for (let date in attendanceData) {
      attendanceData[date][studentId] = { status };
  }
  writeAttendanceData(attendanceData);
}



// Define the file path
const studentsFilePath = './students.json';
const attendanceFilePath = path.join(__dirname, 'attendance.json');

function readStudentsData() {
  const rawData = fs.readFileSync(fileName);
  return JSON.parse(rawData);
}

// Function to write data to students.json
function writeStudentsData(data) {
  fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
}

// Function to read data from attendance.json
function readAttendanceData() {
  const rawData = fs.readFileSync(attendanceFileName);
  return JSON.parse(rawData);
}

// Function to write attendance data to the file
function writeAttendanceData(attendanceData) {
    fs.writeFile(attendanceFilePath, JSON.stringify(attendanceData, null, 2), (err) => {
        if (err) {
            console.error('Error writing attendance data:', err);
        } else {
            console.log('Attendance data written successfully.');
        }
    });
}

// Express route handler for submitting attendance data
app.post('/attendance', jsonParser, (req, res) => {
    const newAttendanceData = req.body;

    // Iterate over each date in the newAttendanceData object
    Object.keys(newAttendanceData).forEach(date => {
        // If attendance data for the date already exists, update it
        if (attendanceData[date]) {
            // Merge new attendance data with existing data
            Object.assign(attendanceData[date], newAttendanceData[date]);
        } else {
            // If not, create new attendance data for the date
            attendanceData[date] = newAttendanceData[date];
        }
    });

    // Write the updated attendance data to the file
    writeAttendanceData(attendanceData);

    // Respond to the request
    res.end();
});


//for deleting student record


// Function to read students data from JSON file
// This is a RESTful DELETE web service to delete a student by ID
// Function to delete a student and their attendance records
function deleteStudentAndAttendance(studentId) {
  try {
    let studentsData = readStudentsData();
    let attendanceData = readAttendanceData();

    // Filter out the student from the students data
    studentsData = studentsData.filter(student => student.id !== studentId);

    // Remove the attendance records associated with the deleted student
    for (let date in attendanceData) {
        delete attendanceData[date][studentId];
    }

    // Write updated student data back to students.json
    writeStudentsData(studentsData);

    // Write updated attendance data back to attendance.json
    writeAttendanceData(attendanceData);
  } catch (error) {
    console.error('Error deleting student and attendance:', error);
    throw error; // Rethrow the error to propagate it to the caller
  }
}


// Express route handler for deleting a student
app.delete('/students/:id', (req, res) => {
  const studentId = parseInt(req.params.id);

  try {
    const studentIdToDelete = req.params.id; // Extract student ID from the URL params

    // Find the index of the student with the specified ID in the 'data' array
    const index = data.findIndex(student => student.id === parseInt(studentIdToDelete));

    if (index === -1) {
        throw new Error('Student not found.');
    }

    // Remove the student from the 'data' array
    const deletedStudent = data.splice(index, 1)[0];

    // Write updated data to a JSON file
    fs.writeFileSync('students.json', JSON.stringify(data, null, 2));

    res.status(200).json({ message: 'Student deleted successfully', student: deletedStudent });
} catch (error) {
    console.error('Error deleting student:', error.message);
    res.status(404).json({ error: error.message });
}
});


// Endpoint to handle PUT request to update student name
app.put('/students/:id', async (req, res) => {
  const id = req.params.id;
  const newName = req.body.name;

  try {
      // Read the student data from the file
      let studentsData = await fs.readFile('students.json', 'utf8');
      studentsData = JSON.parse(studentsData);

      // Find the student with the given ID
      const student = studentsData.find(student => student.id === id);
      if (!student) {
          return res.status(404).json({ error: 'Student not found' });
      }

      // Update the student's name
      student.name = newName;

      // Write the updated student data back to the file
      await fs.writeFile('students.json', JSON.stringify(studentsData, null, 2));

      // Send a success response
      res.status(200).json({ message: 'Student name updated successfully', student });
  } catch (error) {
      console.error('Error updating student name:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});





app.get('/', (request, response) => {
  response.render('attendance');
});
  app.get('/delete', (req, res) => {
    res.render('delete'); 
  });
  app.get('/managestudents', (req, res) => {
    res.render('managestudents'); 
  });
  app.get('/overall', (req, res) => {
    res.render("overall");
  });
  app.get('/edit',(req,res)=>{
    const date = req.query.date;

    res.render('edit', { date: date });
  })
app.listen(port);
console.log('server listening on port 3000');