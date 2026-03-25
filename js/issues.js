const API_BASE = "https://phi-lab-server.vercel.app/api/v1/lab";

let allIssues = [];
let currentTab = "all";

// Fetch all issues when page loads
async function loadIssues() {
  showLoading(true);
  try {
    const res = await fetch(API_BASE + "/issues");
    const data = await res.json();
    allIssues = data.data;
    renderCards(allIssues);
  } catch (err) {
    console.error("Failed to load issues:", err);
  } finally {
    showLoading(false);
  }
}


function renderCards(issues) {
  const grid = document.getElementById("cards-grid");
  const noResults = document.getElementById("no-results");
  const countEl = document.getElementById("issue-count");

  grid.innerHTML = "";

  if (!issues || issues.length === 0) {
    grid.classList.add("hidden");
    noResults.classList.remove("hidden");
    countEl.textContent = "0 Issues";
    return;
  }

  noResults.classList.add("hidden");
  grid.classList.remove("hidden");
  countEl.textContent = issues.length + " Issues";

  for (let i = 0; i < issues.length; i++) {
    const card = createCard(issues[i]);
    grid.appendChild(card);
  }
}


function createCard(issue) {
  const isOpen = issue.status === "open";
  const borderClass = isOpen ? "card-open" : "card-closed";
  const priorityClass = getPriorityClass(issue.priority);

  const statusIcon = isOpen
    ? '<img src="./assets/Open-Status.png" class="w-4 h-4" alt="open"/>'
    : '<img src="./assets/Closed- Status .png" class="w-4 h-4" alt="closed"/>';

  const labelsHTML = buildLabels(issue.labels);
  const createdAt = formatDate(issue.createdAt);

  const div = document.createElement("div");
  div.className = "bg-white rounded-xl shadow-sm cursor-pointer hover:shadow-md transition " + borderClass;
  div.onclick = function() {
    openModal(issue);
  };

  div.innerHTML =
    '<div class="p-4">' +
      '<div class="flex items-center justify-between mb-3">' +
        statusIcon +
        '<span class="text-xs font-bold px-2 py-0.5 rounded-full ' + priorityClass + '">' +
          (issue.priority ? issue.priority.toUpperCase() : "") +
        "</span>" +
      "</div>" +
      '<h3 class="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">' + issue.title + "</h3>" +
      '<p class="text-xs text-gray-500 mb-3 line-clamp-2">' + (issue.description || "") + "</p>" +
      '<div class="flex flex-wrap gap-1 mb-3">' + labelsHTML + "</div>" +
      '<div class="text-xs text-gray-400 border-t border-gray-100 pt-2">' +
        "<p>#" + issue.id + ' by <span class="font-medium text-gray-600">' + (issue.author || "unknown") + "</span></p>" +
        "<p>" + createdAt + "</p>" +
      "</div>" +
    "</div>";

  return div;
}

// Switch between All, Open, Closed tabs
function switchTab(tab) {
  currentTab = tab;

  var tabs = ["all", "open", "closed"];
  for (var i = 0; i < tabs.length; i++) {
    var btn = document.getElementById("tab-" + tabs[i]);
    if (tabs[i] === tab) {
      btn.className = "tab-btn px-5 py-1.5 rounded-md text-sm font-semibold bg-indigo-600 text-white transition";
    } else {
      btn.className = "tab-btn px-5 py-1.5 rounded-md text-sm font-semibold border border-gray-300 text-gray-600 hover:bg-gray-50 transition";
    }
  }

  var filtered = allIssues;
  if (tab === "open") {
    filtered = allIssues.filter(function(i) { return i.status === "open"; });
  }
  if (tab === "closed") {
    filtered = allIssues.filter(function(i) { return i.status === "closed"; });
  }

  var query = document.getElementById("search-input").value.trim();
  if (query) {
    filtered = filtered.filter(function(i) {
      return i.title.toLowerCase().includes(query.toLowerCase()) ||
             (i.description && i.description.toLowerCase().includes(query.toLowerCase()));
    });
  }

  renderCards(filtered);
}

// Search
async function handleSearch() {
  const query = document.getElementById("search-input").value.trim();

  if (!query) {
    switchTab(currentTab);
    return;
  }

  showLoading(true);
  try {
    const res = await fetch(API_BASE + "/issues/search?q=" + encodeURIComponent(query));
    const data = await res.json();
    var results = data.data;

    if (currentTab === "open") {
      results = results.filter(function(i) { return i.status === "open"; });
    }
    if (currentTab === "closed") {
      results = results.filter(function(i) { return i.status === "closed"; });
    }

    renderCards(results);
  } catch (err) {
    console.error("Search failed:", err);
  } finally {
    showLoading(false);
  }
}

//loading spinner
function showLoading(show) {
  var loading = document.getElementById("loading");
  var grid = document.getElementById("cards-grid");

  if (show) {
    loading.classList.remove("hidden");
    grid.classList.add("hidden");
  } else {
    loading.classList.add("hidden");
  }
}

//priority badge class
function getPriorityClass(priority) {
  if (!priority) return "badge-low";
  if (priority.toLowerCase() === "high") return "badge-high";
  if (priority.toLowerCase() === "medium") return "badge-medium";
  return "badge-low";
}


function buildLabels(labels) {
  if (!labels) {
    return "";
  }

  var html = "";

  for (var i = 0; i < labels.length; i++) {
    var label = labels[i];

    var className = "";
    var iconPath = "";

    if (label.toLowerCase() === "bug") {
      className = "label-bug";
      iconPath = "./assets/BugDroid.png";
    } 
    else if (label.toLowerCase() === "help wanted") {
      className = "label-helpwanted";
      iconPath = "./assets/Lifebuoy.png";
    } 
    else if (label.toLowerCase() === "enhancement") {
      className = "label-enhancement";
      iconPath = "./assets/Sparkle.png";
    } 
    else {
      className = "label-default";
    }

    html += '<span class="' + className + ' text-xs px-2 py-1 rounded-full" style="display:inline-flex; align-items:center; gap:4px;">';

    if (iconPath !== "") {
      html += '<img src="' + iconPath + '" style="width:12px; height:12px;" />';
    }

    html += label.toUpperCase();

    html += "</span> ";
  }

  return html;
}


function formatDate(dateStr) {
  if (!dateStr) return "";
  var d = new Date(dateStr);
  var month = d.getMonth() + 1;
  var day = d.getDate();
  var year = d.getFullYear();
  return month + "/" + day + "/" + year;
}


document.addEventListener("DOMContentLoaded", function() {
  if (!localStorage.getItem("isLoggedIn")) {
    window.location.href = "index.html";
    return;
  }
  loadIssues();
});