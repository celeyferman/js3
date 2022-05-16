class Note {
    constructor(title, entry) {
        this.title = title;
        this.entry = entry;
        this.creationDate = this.setCreationDate();
        this.modificationDate = this.setCreationDate();
    }
    setCreationDate() {
        const today = new Date();
        const date = today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate();
        const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        return date+" "+time;
    }
}

let displayNote = document.getElementById("displayNote").querySelector("table").querySelector("tbody");
const displayTemplate = document.getElementById("displayNoteTemplate");
const regressHTML = document.importNode(displayTemplate, true);
if (!localStorage.getItem("savedNotes")) {
    localStorage.setItem("savedNotes", JSON.stringify(new Array()));
} else {
    updateDisplay();
}

document.getElementById("entryNote").addEventListener("keydown", function(e) {
    if (e.key == "Tab") {
      e.preventDefault();
      const start = this.selectionStart;
      const end = this.selectionEnd;

      this.value = this.value.substring(0, start) + "\t" + this.value.substring(end);
      this.selectionStart = this.selectionEnd = start + 1;
    }
  });

function sendForm() {
    const tNote = document.getElementById("titleNote").value;
    const eNote = document.getElementById("entryNote").value;

    const aNote = new Note(tNote, eNote);
    savedNotes = JSON.parse(localStorage.getItem("savedNotes"));
    savedNotes.push(aNote);
    localStorage.setItem("savedNotes", JSON.stringify(savedNotes));
    updateDisplay();
}

function updateDisplay() {
    displayNote.innerHTML = "";
    let fragment = document.createDocumentFragment();
    const t = document.querySelector("#displayNotesTable");
    let tr = t.content.querySelector("tr");
    let td = tr.querySelectorAll("td");

    savedNotes = localStorage.getItem("savedNotes");
    savedNotes = JSON.parse(savedNotes);

    for (let i = 0; i < savedNotes.length; i++){
        if (savedNotes[i].title!=""){
            td[0].textContent = savedNotes[i].title;
        } else {
            td[0].textContent = savedNotes[i].entry;
        }
        td[1].textContent = savedNotes[i].creationDate;
        td[2].textContent = savedNotes[i].modificationDate;

        let editButton = td[3].querySelector("button");
        editButton.setAttribute("onclick", "editEntry("+i+")");

        let deleteButton = td[4].querySelector("button");
        deleteButton.setAttribute("onclick", "deleteEntry("+i+")");
        const clone = document.importNode(t.content, true);
        fragment.appendChild(clone);
    }
    
    //const clone = document.importNode(t.content, true);
    displayNote.appendChild(fragment, true);
    //displayNote.appendChild(clone);
}

function editEntry(note) {
    savedNotes = localStorage.getItem("savedNotes");
    savedNotes = JSON.parse(savedNotes);

    let aNote = savedNotes[note];

    document.getElementById("titleNote").value = aNote.title;
    document.getElementById("entryNote").value = aNote.entry;

    document.getElementById("submitEntry").setAttribute("onclick", "updateEntry("+note+")");
}

function updateEntry(note) {
    const tNote = document.getElementById("titleNote").value;
    const eNote = document.getElementById("entryNote").value;

    const today = new Date();
    const date = today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate();
    const time = today.getHours()+":" + today.getMinutes() + ":" + today.getSeconds();

    savedNotes = localStorage.getItem("savedNotes");
    savedNotes = JSON.parse(savedNotes);

    savedNotes[note].title = tNote;
    savedNotes[note].entry = eNote;
    savedNotes[note].modificationDate = date+" "+time;
    document.getElementById("submitEntry").setAttribute("onclick", "sendForm()");

    localStorage.setItem("savedNotes", JSON.stringify(savedNotes));
    
    updateDisplay();
}

function deleteEntry(note){
    savedNotes = localStorage.getItem("savedNotes");
    savedNotes = JSON.parse(savedNotes);
    savedNotes.splice(note,1)

    localStorage.setItem("savedNotes", JSON.stringify(savedNotes));
    
    updateDisplay();
}