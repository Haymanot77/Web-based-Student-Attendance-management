const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;
const jsonParser = bodyParser.json();
const fileName = 'students.json';
const attendanceFileName = 'attendance.json';
// Load data from file
let rawData = fs.readFileSync(fileName);

let data = JSON.parse(rawData);
let attendanceData = JSON.parse(fs.readFileSync(attendanceFileName));
app.set('views', 'views');
app.set('view engine', 'hbs');
app.use(express.static('public'));


app.get('/', (request, response) => {
    response.render('home');
});

// This is a RESTful GET web service
app.get('/students', (request, response) => {
    data.sort((a, b) => (a.name > b.name) ? 1 : -1 );
    response.send(data);
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

app.post('/attendance', jsonParser, (req, res) => {
  const newAttendanceData = req.body;

  // Iterate over each date in the newAttendanceData object
  Object.keys(newAttendanceData).forEach(date => {
    // Check if attendance data for the current date already exists
    if (!attendanceData[date]) {
      // If not, create new attendance data for the date
      attendanceData[date] = newAttendanceData[date];
    } else {
      // If attendance data for the date already exists, update it
      // Update present, absent, and excused arrays
      Object.keys(newAttendanceData[date]).forEach(status => {
        if (Array.isArray(newAttendanceData[date][status])) {
          attendanceData[date][status] = newAttendanceData[date][status];
        }
      });
    }
  });

  // Write the updated attendance data to the file
  fs.writeFileSync(attendanceFileName, JSON.stringify(attendanceData, null, 2));
 console.log("Hello world");
  // Respond to the request
  res.end();
});



app.get('/edit', (req, res) => {
    res.render('edit'); 
  });
  app.get('/delete', (req, res) => {
    res.render('delete'); 
  });
  app.get('/attendance', (req, res) => {
    res.render("attendance");
  });

// const dataPath = 'attendance.json';

// app.get('/attendance', (req, res) => {
//     // Read JSON file for attendance data
//     const rawData = fs.readFileSync(dataPath);
//     const attendanceData = JSON.parse(rawData);
//     res.render('attendance', attendanceData);
// });

// app.post('/attendance', (req, res) => {
//     const formData = req.body;
//     // Update attendance data in JSON file
//     updateAttendance(formData);
//     res.redirect('/');
// });

// function updateAttendance(formData) {
//     // Read current attendance data
//     const rawData = fs.readFileSync(dataPath);
//     const attendanceData = JSON.parse(rawData);
    
//     // Update attendance status for each student
//     attendanceData.students.forEach(student => {
//         student.status = formData[`status-${student.id}`];
//     });
    
//     // Write updated attendance data back to JSON file
//     fs.writeFileSync(dataPath, JSON.stringify(attendanceData, null, 2));
// }
app.listen(port);
console.log('server listening on port 3000');