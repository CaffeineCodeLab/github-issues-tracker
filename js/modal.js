//Open Modal

async function openModal(issue) {
    try{
        const res = await fetch('https://phi-lab-server.vercel.app/api/v1/lab/issue/${issue.id}');
        const data = await res.json();
        const fullIssue = data.data|| data;
        populateMOdal(fullIssue);
    } catch(err){
        populateModal(issue);
    }

    document.getElementById("modal-overlay").classList.remove("hidden");
    document.body.style.overflow ="hidden";
}

function populateModal(issue) {
  const isOpen = issue.status?.toLowerCase() === "open";
 
  document.getElementById("modal-title").textContent = issue.title || "—";

//status badge
const statusEl = document.getElementById("modal-status");
  statusEl.textContent = isOpen ? "Opened" : "Closed";
  statusEl.className = isOpen
    ? "text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700"
    : "text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700";

 const createdAt = issue.createdAt
    ? new Date(issue.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, "/")
    : "";
  document.getElementById("modal-meta").textContent =
    `• Opened by ${issue.author || "unknown"} • ${createdAt}`;


// Labels
  const labelsEl = document.getElementById("modal-labels");
  if (issue.labels && issue.labels.length) {
    labelsEl.innerHTML = issue.labels.map(label => {
      const key = label.toLowerCase().replace(/\s+/g, "");
      let cls = "label-default";
      if (key === "bug") cls = "label-bug";
      else if (key === "helpwanted") cls = "label-helpwanted";
      else if (key === "enhancement") cls = "label-enhancement";
      return `<span class="text-xs px-2.5 py-1 rounded-full font-medium ${cls}">${label}</span>`;
    }).join("");
  } else {
    labelsEl.innerHTML = "";
  }

//Description
document.getElementById("modal-description").textContent = issue.description || "No description provided.";
 
  // Assignee
  document.getElementById("modal-assignee").textContent = issue.assignee || issue.author || "—";
 
  // Priority
  const priorityEl = document.getElementById("modal-priority");
  priorityEl.textContent = issue.priority?.toUpperCase() || "—";
  priorityEl.className = `text-xs font-bold px-2.5 py-1 rounded-full ${getPriorityClass(issue.priority)}`;
}

//Close Modal
function classModal() {
    document.getElementById("modal-overlay").classList.add("hidden");
  document.body.style.overflow = "";
}

document.getElementById("modal-overlay").addEventListener("click", function(e){
        if(e.target===this) closeModal()
    });

    document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") closeModal();
});
