let todosArr = [];
let editingMode = false;


// Form variables
const form = document.querySelector("#todoForm");
const addButton = document.querySelector(".addButton");
const todoInputName = document.querySelector("#todoName");
const todoInputDate = document.querySelector("#todoDate");
const selectDate = document.querySelector("#selectDate")




// Add ToDo
form.addEventListener("submit", e => {
    e.preventDefault();
    if(editingMode) {
      todoCard.todoName = todoInputName.value;
      todoCard.todoDate = todoInputDate.value;
      editingMode = false;
      addButton.innerText = "Add ToDo";
    } else {
        const todoName = todoInputName.value;
        const todoDate = todoInputDate.value;
        // const date = new Date().toISOString();
        const id = new Date().valueOf()
        todo = {
            id,
            todoName,
            isCompleted: false,
            todoDate
        }
        todosArr = [todo, ...todosArr];
    }
    
    localStorage.setItem("storageTodos", JSON.stringify(todosArr));
    printTodo(todosArr);
    todoInputName.value = "";
    todoInputDate.value = "";
    printSelectDate(todosArr, selectDate)
}) 


const todoList = document.querySelector(".todoList");

function printTodo(array) {
    todoList.innerHTML = ""
    if(todosArr.length) {
        array.forEach(({ id, todoName, todoDate, isCompleted }) => {
         let li = document.createElement("li");
         let actionsWrapper = document.createElement("div");
         let deleteBtn = document.createElement("button")
         let editBtn = document.createElement("button")
         actionsWrapper.append(editBtn, deleteBtn);
         actionsWrapper.classList.add("actionWrapper");
         todoList.append(li);
         li.setAttribute("id", id);
         li.classList.add("liTodo")
         let todoText = document.createElement("p");
         todoText.classList.add("todoText");
         let todoDateVal = document.createElement("p");
         todoDateVal.innerText = todoDate;
         todoDateVal.classList.add("todoText");
         li.append(todoText, todoDateVal, actionsWrapper);
         todoText.innerText = todoName;
        //  deleteBtn.innerHTML = `<box-icon name='trash' class="deleteBtn"></box-icon>`;
        //  editBtn.innerHTML = `<box-icon name='edit' class="editIcon"></box-icon>`;
         deleteBtn.textContent = "Delete";
         deleteBtn.classList.add('btn', 'deleteBtn');
         editBtn.textContent = "Edit";
         editBtn.classList.add('btn', 'editBtn')
       
         if(isCompleted) {
             li.classList.add("line-through");
            }
            
            li.addEventListener("click", todoComplete);
            deleteBtn.addEventListener("click", deleteTodo);
            editBtn.addEventListener("click", editTodo);
        })
    } else {
        noText()
    }
    printSelectDate(array, selectDate)
 
}


// Delete todo
function deleteTodo(e) {
    e.stopPropagation()
    const id = e.currentTarget.parentNode.parentNode.id
    const finalCheck = confirm("Are you sure you want to delete todo?")
    if(finalCheck) {
        const todo = findTodo(id, todosArr);
        const filteredArr = todosArr.filter(el => el.id !== todo.id);
        todosArr = [...filteredArr];
        printTodo(todosArr);
        localStorage.setItem("storageTodos", JSON.stringify(todosArr));
        // printSelectDate(todosArr, selectDate)
    }
}

// todo complete toggle
function todoComplete(e) {
 const id = e.currentTarget.id;
 let todoCard = findTodo(id, todosArr);
 todoCard.isCompleted = !todoCard.isCompleted;
 printTodo(todosArr);
 localStorage.setItem("storageTodos", JSON.stringify(todosArr));
}

// Edit todo
function editTodo(e) {
  e.stopPropagation()
  editingMode = true;
  const id = e.currentTarget.parentNode.parentNode.id;
  addButton.innerText = "Update Todo";
  todoCard = findTodo(id, todosArr)
  todoInputName.value = todoCard.todoName;
  todoInputDate.value = todoCard.todoDate;
//   printSelectDate(todosArr, selectDate);
}


// Separate function to find todo
function findTodo(id, arr) {
   const todo = arr.find(todo => todo.id === +id)
   console.log(todo);
   return todo;
}


// Getting Todos from storage on load
window.addEventListener("load", (e) => { 
    
    const todosFromStorage = localStorage.getItem("storageTodos")
    if(todosFromStorage) {
        const newTodosFromStorage = JSON.parse(todosFromStorage)
        if(newTodosFromStorage.length > 0) {
            todosArr = [...newTodosFromStorage];
            printTodo(todosArr)
        } else {
            localStorage.removeItem("storageTodos");
        }
    }  else { 
        noText()
    }
    printSelectDate(todosArr, selectDate)
    

})

// Getting date to select tag
function printSelectDate(arr, select){
    select.innerHTML = "";
    if(arr.length) {
        arr.forEach(({todoDate}) => {
            select.innerHTML += `
            <option value=${todoDate}>${todoDate}</option>`
        })
    } 
}
// Filter by dates
function filterByDate(arr, date){
    const filteredArrByDate = arr.filter(el => el.todoDate === date)
    console.log(filteredArrByDate);
    printTodo(filteredArrByDate)
}
selectDate.addEventListener("change",function() {
    filterByDate(todosArr, this.value)
})

// printing text if the list is empty
function noText() {
    const noItemsText = document.createElement("p")
    todoList.append(noItemsText)
    noItemsText.innerText = "There is no todos!";
    noItemsText.classList.add("no-todos");
}

// Search by name

let searchInput = document.querySelector("#searchTodo");

searchInput.addEventListener("keyup", (e) => {
    let query = e.currentTarget.value.toLowerCase();
    let filteredSearchArr = todosArr.filter(el => el.todoName.toLowerCase().includes(query))
    printTodo(filteredSearchArr);
})
