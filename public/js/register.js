const server = 'http://localhost:3000';
var studentId;
var studentName;

/*async function fetchStudents() {
    const url = server + '/students';
    const options = {
        method: 'GET',
        headers: {
            'Accept' : 'application/json',
            'Cache-Control' : 'no-store'
        }
    }
    const response = await fetch(url, options);
    const students = await response.json();
    populateContent(students);
}
*/

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
/*
function populateContent(students) {
    var table = document.getElementById('content');
    table.innerHTML = "<tr><th>Student Id</th><th>Full Name</th><th>Score</th></tr>";
    students.forEach(student => {
        var row = document.createElement('tr');
        var dataId = document.createElement('td');
        var textId = document.createTextNode(student.id);
        dataId.appendChild(textId);
        var dataName = document.createElement('td');
        var textName = document.createTextNode(student.name);
        dataName.appendChild(textName);
        row.appendChild(dataId);
        row.appendChild(dataName);
        table.appendChild(row);
    });
    
}
*/
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

