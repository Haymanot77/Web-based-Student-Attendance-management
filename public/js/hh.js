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
        attendanceData[date][studentId] = status;
    }
    writeAttendanceData(attendanceData);
}
