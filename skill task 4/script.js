let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let filter = "all";

displayTasks();

// Add Task
function addTask() {

    const taskInput = document.getElementById("task");
    const dateInput = document.getElementById("date");

    const text = taskInput.value.trim();
    const date = dateInput.value;

    if(text === ""){
        alert("Please enter a task!");
        return;
    }

    tasks.push({
        id: Date.now(),
        text,
        date,
        completed:false
    });

    taskInput.value="";
    dateInput.value="";

    saveTasks();
    displayTasks();
}

// Save
function saveTasks(){
    localStorage.setItem("tasks",JSON.stringify(tasks));
}

// Display
function displayTasks(){

    const list=document.getElementById("taskList");
    const search=document.getElementById("search").value.toLowerCase();

    list.innerHTML="";

    let filteredTasks=tasks.filter(task=>{

        let matchesSearch=task.text.toLowerCase().includes(search);

        let matchesFilter=
            filter==="all" ||
            (filter==="completed" && task.completed) ||
            (filter==="pending" && !task.completed);

        return matchesSearch && matchesFilter;
    });

    filteredTasks.forEach(task=>{

        const li=document.createElement("li");

        if(task.completed){
            li.classList.add("completed");
        }

        li.innerHTML=`

        <div class="taskInfo">

            <h3>${task.text}</h3>

            <p>
            ${task.date ? "📅 "+formatDate(task.date) : "No Date"}
            </p>

        </div>

        <div class="actions">

        <button class="completeBtn"
        onclick="toggleComplete(${task.id})">

        ${task.completed ? "Undo":"Done"}

        </button>

        <button class="editBtn"
        onclick="editTask(${task.id})">

        Edit

        </button>

        <button class="deleteBtn"
        onclick="deleteTask(${task.id})">

        Delete

        </button>

        </div>

        `;

        list.appendChild(li);

    });

    updateProgress();
}

// Delete
function deleteTask(id){

    tasks=tasks.filter(task=>task.id!==id);

    saveTasks();
    displayTasks();

}

// Complete
function toggleComplete(id){

    tasks=tasks.map(task=>{

        if(task.id===id){

            task.completed=!task.completed;

        }

        return task;

    });

    saveTasks();
    displayTasks();

}

// Edit
function editTask(id){

    const task=tasks.find(task=>task.id===id);

    const newTask=prompt("Edit Task",task.text);

    if(newTask!==null && newTask.trim()!==""){

        task.text=newTask;

        saveTasks();
        displayTasks();

    }

}

// Search
document.getElementById("search").addEventListener("input",displayTasks);

// Filters
document.querySelectorAll(".filters button").forEach(btn=>{

    btn.addEventListener("click",()=>{

        document.querySelectorAll(".filters button")
        .forEach(b=>b.classList.remove("active"));

        btn.classList.add("active");

        filter=btn.dataset.filter;

        displayTasks();

    });

});

// Progress Bar
function updateProgress(){

    const total=tasks.length;

    const completed=tasks.filter(task=>task.completed).length;

    document.getElementById("count").innerText=
    `${completed} / ${total} Completed`;

    let percent=0;

    if(total>0){

        percent=(completed/total)*100;

    }

    document.getElementById("progressBar").style.width=
    percent+"%";

}

// Format Date
function formatDate(date){

    const d=new Date(date);

    return d.toLocaleString();

}