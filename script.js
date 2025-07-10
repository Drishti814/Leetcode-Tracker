let questions = JSON.parse(localStorage.getItem("questions") || "[]");
let currentIndex = -1;

const listEl = document.getElementById("question-list");
const progressEl = document.getElementById("progress");

function render() {
  const statusFilter = document.getElementById("filter-status").value;
  const sortMode = document.getElementById("sort-topic").value;

  let data = [...questions];

  // Filter
  if (statusFilter === "solved") data = data.filter(q => q.solved);
  if (statusFilter === "unsolved") data = data.filter(q => !q.solved);

  // Sort
  if (sortMode === "asc") data.sort((a, b) => a.topic.localeCompare(b.topic));
  if (sortMode === "desc") data.sort((a, b) => b.topic.localeCompare(a.topic));

  // Render
  listEl.innerHTML = "";
  let solvedCount = 0;

  data.forEach((q, i) => {
    if (q.solved) solvedCount++;

    const li = document.createElement("li");
    li.innerHTML = `
      <div>
        <strong>${q.title}</strong>
        <span class="badge">${q.topic}</span>
        ${q.solved ? "✅" : "❌"}
      </div>
      <div class="actions">
        <button class="notes" onclick="openNote(${questions.indexOf(q)})">Notes</button>
        <button class="mark" onclick="toggleSolved(${questions.indexOf(q)})">
          Mark ${q.solved ? "Unsolved" : "Solved"}
        </button>
        <button class="delete" onclick="deleteQ(${questions.indexOf(q)})">Delete</button>
      </div>
    `;
    listEl.appendChild(li);
  });

  const total = questions.length;
  const percent = total ? Math.round((solvedCount / total) * 100) : 0;
  progressEl.querySelector(".bar div").style.width = percent + "%";
  progressEl.querySelector("p").textContent = `Progress: ${solvedCount}/${total} solved (${percent}%)`;
}

function save() {
  localStorage.setItem("questions", JSON.stringify(questions));
}

// Add new question
document.getElementById("tracker-form").addEventListener("submit", e => {
  e.preventDefault();
  const title = document.getElementById("question").value.trim();
  const topic = document.getElementById("topic").value;
  if (!title) return;

  questions.push({ title, topic, solved: false, notes: "" });
  save();
  e.target.reset();
  render();
});

function toggleSolved(idx) {
  questions[idx].solved = !questions[idx].solved;
  save();
  render();
}

function deleteQ(idx) {
  questions.splice(idx, 1);
  save();
  render();
}

// Notes Modal
const modal = document.getElementById("notes-modal");
const noteText = document.getElementById("note-text");

function openNote(idx) {
  currentIndex = idx;
  noteText.value = questions[idx].notes || "";
  modal.classList.add("show");
}

function closeModal() {
  modal.classList.remove("show");
  currentIndex = -1;
}

function saveNote() {
  if (currentIndex > -1) {
    questions[currentIndex].notes = noteText.value;
    save();
    render();
  }
  closeModal();
}

// Dark Mode
const toggle = document.getElementById("dark-toggle");
function applyDark(dark) {
  document.body.classList.toggle("dark", dark);
  toggle.checked = dark;
  localStorage.setItem("darkMode", dark);
}

toggle.addEventListener("change", () => applyDark(toggle.checked));
applyDark(localStorage.getItem("darkMode") === "true");

// Initial render
render();
