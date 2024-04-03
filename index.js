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


// This is a RESTful POST web service for adding students
app.post('/students', jsonParser, (request, response) => {
  try {
    if (!Array.isArray(data)) {
      data = []; // Initialize 'data' as an empty array if it's not already an array
    }

    // Assuming 'data' is an array containing student records
    const dataLength = data.length; // Get the current length of the 'data' array
    console.log(dataLength); // Log the current length to the console

    // Check if 'id' field is a number
    if (typeof request.body["id"] !== 'number') {
      throw new Error("Invalid 'id' field. Please provide a numeric ID.");
    }

    // Add the new student data to the 'data' array
    data.push(request.body);

    // Determine the data type of the 'id' field
    const dataType = typeof request.body["id"];

    // Write updated data to the JSON file synchronously
    fs.writeFileSync(fileName, JSON.stringify(data, null, 2));

    // End the response
    response.end();
  } catch (error) {
    console.error('Error adding student:', error.message);
    response.status(400).json({ error: error.message });
  }
});

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


// Endpoint to handle DELETE request for deleting a student by ID
app.delete('/students/:id', (req, res) => {
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

app.get('/', (request, response) => {
  response.render('attendance');
});
  app.get('/delete', (req, res) => {
    res.render('delete'); 
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