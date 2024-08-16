const tasksLocalStorage = 'todo.tasks';
const deletedTasksLocalStorage = 'todo.deleted';
let listID = 0;
let todoList = JSON.parse(localStorage.getItem(tasksLocalStorage)) || [];
let deletedTasks = JSON.parse(localStorage.getItem(deletedTasksLocalStorage)) || [];
let filterImportance = "all";


const bgColors = [
	{ primary: "#8e0e00", left: "#8e0e00", right: "#1f1c18" },
	{ primary: "#e36b35", left: "#c02425", right: "#f0cb35" },
	{ primary: "#799f0c", left: "#ffe000", right: "#799f0c" },
	{ primary: "#45a247", left: "#283c86", right: "#45a247" },
	{ primary: "#145294", left: "#000046", right: "#1cb5e0" },
	{ primary: "#654ea3", left: "#654ea3", right: "#eaafc8" },
	{ primary: "#b73063", left: "#c0392b", right: "#8e44ad" },
];

let bgButtons = document.querySelectorAll(".color-select");
let btns = document.querySelectorAll("button");
let customSelect = document.querySelector(".select-selected");
let selectOptions = document.querySelector(".select-items");
let deleteBtns = document.getElementsByClassName("delete");

//initialize values
document.body.style.background = "linear-gradient(to right, #283c86, #45a247)";
customSelect.style.backgroundColor = "#45a247";
customSelect.style.border = "#45a247";
customSelect.style.borderRadius = "5px";
selectOptions.style.backgroundColor = "#45a247";
for (const btn of btns) {
	btn.style.backgroundColor = "#45a247";
}


let btnColor = "#45a247";

for (const elem of bgButtons) {
	let id = elem.getAttribute("data-bg-id") - 1;
	elem.onclick = () => {
		btnColor = bgColors[id].primary;
		document.body.style.background = `linear-gradient(to right, ${bgColors[id].left}, ${bgColors[id].right})`;
		for (const btn of btns) {
			btn.style.background = bgColors[id].primary;
		}
		customSelect.style.backgroundColor = bgColors[id].primary;
		customSelect.style.border = `1px solid ${bgColors[id].primary}`;
		customSelect.style.borderRadius = "5px";
		selectOptions.style.backgroundColor = bgColors[id].primary;
		for(const btn of deleteBtns) {
			btn.style.background = bgColors[id].primary;
		}
	}
}

document.getElementById("searchButton").onclick = function searchTask() {
	let searchItem = document.getElementById("searchTerm").value;
	let selectiveTasks = [];

	if (filterImportance == "all") {
		for (let i = 0; i < todoList.length; i++) {
			if (todoList[i][1].indexOf(searchItem) > -1) {
				selectiveTasks.push(todoList[i]);
			}
		}
	} else if (filterImportance == "urgent") {
		for (let j = 0; j < todoList.length; j++) {
			if ((todoList[j][0] == 0) && (todoList[j][1].indexOf(searchItem) > -1)) {
				selectiveTasks.push(todoList[j]);
			}
		}
	} else if (filterImportance == "important") {
		for (let k = 0; k < todoList.length; k++) {
			if ((todoList[k][0] == 1) && (todoList[k][1].indexOf(searchItem) > -1)) {
				selectiveTasks.push(todoList[k]);
			}
		}
	} else if (filterImportance == "normal") {
		for (let l = 0; l < todoList.length; l++) {
			if ((todoList[l][0] == 2) && (todoList[l][1].indexOf(searchItem) > -1)) {
				selectiveTasks.push(todoList[l]);
			}
		}
	}

	if (selectiveTasks.length == 0) {
		alert("Task not found");
	} else {
	render(selectiveTasks);
	}

	selectiveTasks = [];
}


document.getElementById("all").onclick = function all() {
	todoList.sort(function (a, b) {
		return a[0] - b[0];
	});
	render(todoList);
}

document.getElementById("urgent").onclick = function urgent() {
	filterImportance = "urgent";
	let urgentTasks = [];
	for (let i = 0; i < todoList.length; i++) {
		if (todoList[i][0] == 0) {
			urgentTasks.push(todoList[i]);
		}
	}
	render(urgentTasks);
}

document.getElementById("important").onclick = function important() {
	filterImportance = "important";
	let importantTasks = [];
	for (let i = 0; i < todoList.length; i++) {
		if (todoList[i][0] == 1) {
			importantTasks.push(todoList[i]);
		}
	}
	render(importantTasks);
}

document.getElementById("normal").onclick = function normal() {
	filterImportance = "normal";
	let normalTasks = [];
	for (let i = 0; i < todoList.length; i++) {
		if (todoList[i][0] == 2) {
			normalTasks.push(todoList[i]);
		}
	}
	render(normalTasks);
}

document.getElementById("deleted").onclick = function showDeleted() {
	render(deletedTasks);
}

function save() {
	localStorage.setItem(tasksLocalStorage, JSON.stringify(todoList));
	localStorage.setItem(deletedTasksLocalStorage, JSON.stringify(deletedTasks));
}

render(todoList);

document.getElementById("push").onclick = function amitFunction() {
	save();
	let item = document.getElementById('task').value;
	let importance = document.getElementById('importance').value;
	listID = listID + 1;

	if (item == "") {
		alert("Please enter a task");
		return;
	}

	if (importance == "null") {
		alert("Please select importance level");
		return;
	}

	todoList.push([importance, item, listID]);

	todoList.sort(function (a, b) {
		return a[0] - b[0];
	});

	document.getElementById("task").value = "";

	render(todoList);
	save();
}

function render(list) {
	let resultNode = document.getElementById("tasks");
	resultNode.innerHTML = "";

	let color = "";

	for (let i = 0; i < list.length; i++) {
		if (list[i][0] == 0) {
			color = "red";
		} else if (list[i][0] == 1) {
			color = "orange";
		} else {
			color = "green";
		}

		if (list !== deletedTasks) {
			resultNode.innerHTML +=
				`
					<div class="task">
						<span>
							<p style="color:${color}">${list[i][1]}</p>
						</span>
						<button class="delete" data-id=${list[i][2]} style="background:${btnColor};">
							<span class="material-icons-outlined">delete</span>
						</button>
					</div>
				`;
		} else {
			resultNode.innerHTML +=
				`
					<div class="task">
						<span>
							<p style="color:${color}">${list[i][1]}</p>
						</span>
						<button class="restore" data-id=${i} style="background:${btnColor};">
							<span class="material-icons-outlined">restore</span>
						</button>
					</div>
				`;
		}
	}

	let current_tasks = document.querySelectorAll(".delete");

	for (let g = 0; g < current_tasks.length; g++) {
		current_tasks[g].onclick = function (e) {
			let deletedTask = e.currentTarget.dataset.id;
			for (let i = 0; i < todoList.length; i++) {
				if (todoList[i][2] == deletedTask) {
					deletedTasks.push(todoList[i]);
					todoList.splice(i, 1);
				}
			}
			render(todoList);
			save();
		}
	}

	let restoreTasks = document.querySelectorAll(".restore");

	for (let f = 0; f < restoreTasks.length; f++) {
		restoreTasks[f].onclick = function (e) {
			let restoreTask = e.currentTarget.dataset.id;
			todoList.push(deletedTasks[restoreTask]);
			deletedTasks.splice(restoreTask, 1);
			render(deletedTasks);
			save();
		}
	}
}