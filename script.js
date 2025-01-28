
const studentForm = document.getElementById("student-form")
const studentsList = document.getElementById("students-list")

const students = JSON.parse(localStorage.getItem("students")) || []


function saveStudents() {
  localStorage.setItem("students", JSON.stringify(students))
}

function renderStudents() {
  studentsList.innerHTML = ""
  students.forEach((student, index) => {
    const row = document.createElement("tr")
    row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.id}</td>
            <td>${student.email}</td>
            <td>${student.contact}</td>
            <td>
                <button class="edit-btn" data-index="${index}">Edit</button>
                <button class="delete-btn" data-index="${index}">Delete</button>
            </td>
        `
    studentsList.appendChild(row)
  })
}


function validateInput(name, id, email, contact) {
  const nameRegex = /^[a-zA-Z\s]+$/
  const idRegex = /^\d+$/
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const contactRegex = /^\d{10}$/

  if (!nameRegex.test(name)) {
    alert("Please enter a valid name (only characters)")
    return false
  }
  if (!idRegex.test(id)) {
    alert("Please enter a valid student ID (only numbers)")
    return false
  }
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address")
    return false
  }
  if (!contactRegex.test(contact)) {
    alert("Please enter a valid contact number (exactly 10 digits)")
    return false
  }
  return true
}


studentForm.addEventListener("submit", (e) => {
  e.preventDefault()
  const name = document.getElementById("student-name").value.trim()
  const id = document.getElementById("student-id").value.trim()
  const email = document.getElementById("email").value.trim()
  const contact = document.getElementById("contact").value.trim()

  if (!name || !id || !email || !contact) {
    alert("Please fill in all fields")
    return
  }

  if (!validateInput(name, id, email, contact)) {
    return
  }


  const isDuplicate = students.some(student => 
    student.id === id || student.email === email || student.contact === contact
  )

  if (isDuplicate) {
    alert("A student with the same ID, email, or contact number already exists")
    return
  }

  const newStudent = { name, id, email, contact }
  students.push(newStudent)
  saveStudents()
  renderStudents()
  studentForm.reset()
})


studentsList.addEventListener("click", (e) => {
  if (e.target.classList.contains("edit-btn")) {
    const index = e.target.dataset.index
    const student = students[index]
    document.getElementById("student-name").value = student.name
    document.getElementById("student-id").value = student.id
    document.getElementById("email").value = student.email
    document.getElementById("contact").value = student.contact
    students.splice(index, 1)
    saveStudents()
    renderStudents()
  } else if (e.target.classList.contains("delete-btn")) {
    const index = e.target.dataset.index
    students.splice(index, 1)
    saveStudents()
    renderStudents()
  }
})


renderStudents()


const recordsContainer = document.getElementById("records-container")
function updateScrollbar() {
  if (recordsContainer.scrollHeight > recordsContainer.clientHeight) {
    recordsContainer.style.overflowY = "scroll"
  } else {
    recordsContainer.style.overflowY = "auto"
  }
}


window.addEventListener("resize", updateScrollbar)
const observer = new MutationObserver(updateScrollbar)
observer.observe(studentsList, { childList: true, subtree: true })
