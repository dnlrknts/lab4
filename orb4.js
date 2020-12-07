let students;
let requestURL = 'Massive.json';
let request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'json';
request.send();
request.onload = function() {
    students = request.response;
    students = request.response.map((student) => new Student(student.name, student.surname, student.age, student.mark));
    console.log(request.response);
    renderStudentsTable();
}

const f1 = document.forms['f1'];
const tbody = document.getElementById('tbody');
const nameInput = document.getElementById('name');
const surnameInput = document.getElementById('surname');
const ageInput = document.getElementById('age');
const markInput = document.getElementById('mark');
const createStudentButton = document.getElementById('create-student-button');

function Student(name, surname, age, mark) {
    this.name = name;
    this.surname = surname;
    this.age = age;
    this.mark = mark;
}

Student.prototype.getDataForTable = function() {
    return {
        name: this.name,
        surname: this.surname,
        age: this.age,
        mark: this.mark,
    }
}

Student.prototype.update = function(data) {
    this.name = data.name;
    this.surname = data.surname;
    this.age = +data.age;
    this.mark = +data.mark;
}

createStudentButton.addEventListener('click', () => {
    const name = nameInput.value;
    const surname = surnameInput.value;
    const age = +ageInput.value;
    const mark = +markInput.value;
    const newStudent = new Student(name, surname, age, mark);
    students.push(newStudent);
    f1.reset();
    renderStudentsTable();
});

function renderStudentsTable() {
    // костыль для удаления всеъ строк
    tbody.innerHTML = '';
    students.forEach((student, idx) => {
        const data = student.getDataForTable();
        const row = createTableRow(data, idx);
        tbody.appendChild(row);
    });
}

function createIdRow(idx) {
    const td = document.createElement('td');
    td.textContent = idx;
    return td;
}

function createTableRow(student, idx) {
    const tr = document.createElement('tr');

    const idRow = createIdRow(idx);
    tr.appendChild(idRow);

    Object.values(student).forEach(value => {
        const td = document.createElement('td');
        td.textContent = value;
        tr.appendChild(td);
    });

    addControls(tr, idx);

    return tr;
}

function addControls(tr, idx) {
    const editButtonWrapper = document.createElement('td');
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => editUser(idx));
    editButtonWrapper.appendChild(editButton);
    tr.appendChild(editButtonWrapper);

    const deleteButtonWrapper = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deleteStudent(idx));
    deleteButtonWrapper.appendChild(deleteButton);
    tr.appendChild(deleteButtonWrapper);
}

function deleteStudent(idx) {
    students.splice(idx, 1);
    renderStudentsTable();
}

function editUser(idx) {
    const student = students[idx];
    const data = student.getDataForTable();
    const dataKeys = Object.keys(data);
    const dataValues = Object.values(data);
    const row = tbody.rows[idx];
    // 1 потому что скипаем филд с айди
    const startIndex = 1;
    const lastIndex = startIndex + dataKeys.length;
    const editButtonCell = row.cells[lastIndex];
    const editableCells = Array.prototype.slice.call(row.cells, startIndex, lastIndex);



    editableCells.forEach((cell, cellIdx) => {
        const input = document.createElement('input');
        input.type = dataTypeToInputType[typeof dataValues[cellIdx]];
        input.value = cell.innerText;
        cell.innerHTML = '';
        cell.appendChild(input);
    });

    editButtonCell.innerHTML = '';
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.addEventListener('click', () => {
        const userNewData = {};
        editableCells.forEach((cell, id) => {
            const input = cell.querySelector('input');
            userNewData[dataKeys[id]] = input.value;
        });

        student.update(userNewData);

        renderStudentsTable();
    });
    editButtonCell.appendChild(saveButton);
}

const dataTypeToInputType = {
    'string': 'text',
    'number': 'number'
}