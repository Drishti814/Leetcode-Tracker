const form = document.getElementById("tracker-form");
const list = document.getElementById("question-list");
const progress = document.getElementById("progress");
const modal = document.getElementById("notes-modal");
const noteText = document.getElementById("note-text");

let questions = JSON.parse(localStorage.getItem("questions")) || [];
let editingIndex = -1;

function save() {
  localStorage.setItem("questions", JSON.stringify(questions));
}

function render() {
  list.innerHTML = "";
  let solved = 0;

  let filtered = [...questions];

const status = document.getElementById("filter-status")?.value || "all";
const sort = document.getElementById("sort-topic")?.value || "none";

// Filter
if (status === "solved") filtered = filtered.filter(q => q.solved);
else if (status === "unsolved") filtered = filtered.filter(q => !q.solved);

// Sort
if (sort === "asc") filtered.sort((a, b) => a.topic.localeCompare(b.topic));
else if (sort === "desc") filtered.sort((a, b) => b.topic.localeCompare(a.topic));

  filtered.forEach((q, i) => {
    if (q.solved) solved++;

    const li = document.createElement("li");
    li.innerHTML = `
      <div>
        <strong>${q.title}</strong> <span class="badge">${q.topic}</span>
        ${q.solved ? "✅" : "❌"}
      </div>
      <div class="actions">
        <button class="notes" onclick="openNote(${i})">Notes</button>
        <button class="mark" onclick="toggleSolved(${i})">
          Mark ${q.solved ? "Unsolved" : "Solved"}
        </button>
        <button class="delete" onclick="deleteQ(${i})">Delete</button>
      </div>`;
    list.appendChild(li);
  });

  const percent = questions.length ? Math.round((solved / questions.length) * 100) : 0;
  progress.innerHTML = `
    <div class="bar"><div style="width:${percent}%"></div></div>
    <p>Progress: ${solved}/${questions.length} solved (${percent}%)</p>`;
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const title = document.getElementById("question").value.trim();
  const topic = document.getElementById("topic").value;

  if (!title) return;

  questions.push({ title, topic, solved: false, notes: "" });
  save();
  form.reset();
  render();
});

function toggleSolved(i) {
  questions[i].solved = !questions[i].solved;
  save();
  render();
}

function deleteQ(i) {
  questions.splice(i, 1);
  save();
  render();
}

function openNote(i) {
  editingIndex = i;
  noteText.value = questions[i].notes || "";
  modal.classList.remove("hidden");
}

function closeModal() {
  editingIndex = -1;
  modal.classList.add("hidden");
}

function saveNote() {
  if (editingIndex !== -1) {
    questions[editingIndex].notes = noteText.value;
    save();
    render();
    closeModal();
  }
}
render();
