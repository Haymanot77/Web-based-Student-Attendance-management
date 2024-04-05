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
     if(typeof request.body["id"]!='number')
     {
     
     }
    
else{
 
    data.push(request.body);
    datatype=typeof request.body["id"]
    fs.writeFileSync(fileName, JSON.stringify(data, null, 2));

   
    response.end();
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
      // Delete the student and their attendance records
      deleteStudentAndAttendance(studentId);
      res.send('Student deleted successfully');
  } catch (error) {
      console.error('Error deleting student:', error);
      res.status(500).send('Failed to delete student');
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