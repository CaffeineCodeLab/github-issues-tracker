async function openModal(issue) {
  try {
    var res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issue/" + issue.id);
    var data = await res.json();
    var fullIssue = data.data || data;
    populateModal(fullIssue);
  } catch (err) {
    populateModal(issue);
  }

  document.getElementById("modal-overlay").classList.remove("hidden");
  document.body.style.overflow = "hidden";
}


function populateModal(issue) {
  var isOpen = issue.status && issue.status.toLowerCase() === "open";

  // Title
  document.getElementById("modal-title").textContent = issue.title || "";

  var statusEl = document.getElementById("modal-status");
  statusEl.textContent = isOpen ? "Opened" : "Closed";
  if (isOpen) {
    statusEl.className = "text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700";
  } else {
    statusEl.className = "text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700";
  }

  var createdAt = "";
  if (issue.createdAt) {
    var d = new Date(issue.createdAt);
    var day = String(d.getDate()).padStart(2, "0");
    var month = String(d.getMonth() + 1).padStart(2, "0");
    var year = d.getFullYear();
    createdAt = day + "/" + month + "/" + year;
  }
  document.getElementById("modal-meta").textContent =
    "Opened by " + (issue.author || "unknown") + " • " + createdAt;

  // Labels
  var labelsEl = document.getElementById("modal-labels");
  if (issue.labels && issue.labels.length > 0) {
    var labelsHTML = "";
    for (var i = 0; i < issue.labels.length; i++) {
      var label = issue.labels[i];
      var key = label.toLowerCase().replace(/\s+/g, "");
      var cls = "label-default";
      if (key === "bug") cls = "label-bug";
      else if (key === "helpwanted") cls = "label-helpwanted";
      else if (key === "enhancement") cls = "label-enhancement";
      labelsHTML += '<span class="text-xs px-2.5 py-1 rounded-full font-medium ' + cls + '">' + label.toLowerCase() + "</span>";
    }
    labelsEl.innerHTML = labelsHTML;
  } else {
    labelsEl.innerHTML = "";
  }

  document.getElementById("modal-description").textContent = issue.description || "No description provided.";


  document.getElementById("modal-assignee").textContent = issue.assignee || issue.author || "";

  var priorityEl = document.getElementById("modal-priority");
  priorityEl.textContent = issue.priority ? issue.priority.toUpperCase() : "";
  priorityEl.className = "text-xs font-bold px-2.5 py-1 rounded-full " + getPriorityClass(issue.priority);
}

// Close modal function
function closeModal() {
  document.getElementById("modal-overlay").classList.add("hidden");
  document.body.style.overflow = "";
}

document.addEventListener("DOMContentLoaded", function() {
  var overlay = document.getElementById("modal-overlay");
  if (overlay) {
    overlay.addEventListener("click", function(e) {
      if (e.target === overlay) {
        closeModal();
      }
    });
  }
});

// Close on Escape key
document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") {
    closeModal();
  }
});