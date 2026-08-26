let currentUser = JSON.parse(localStorage.getItem("jobsphereUser") || "null");

function headers() {
    const result = {"Content-Type": "application/json"};
    if (currentUser && currentUser.token) {
        result.Authorization = "Bearer " + currentUser.token;
    }
    return result;
}

function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = value ?? "";
    return div.innerHTML;
}

async function loadJobs() {
    const keyword = document.getElementById("searchBox").value;
    const response = await fetch("/api/jobs?keyword=" + encodeURIComponent(keyword));
    const jobs = await response.json();

    const list = document.getElementById("jobList");

    if (!jobs.length) {
        list.innerHTML = "<p>No jobs found.</p>";
        return;
    }

    list.innerHTML = jobs.map(job => `
        <article class="card">
            <h3>${escapeHtml(job.title)}</h3>
            <div class="company">${escapeHtml(job.company)}</div>
            <span class="tag">${escapeHtml(job.location)}</span>
            <span class="tag">${escapeHtml(job.employmentType || "Full-time")}</span>
            <span class="tag">${escapeHtml(job.salaryRange || "Not disclosed")}</span>
            <p>${escapeHtml(job.description)}</p>
            <small><b>Skills:</b> ${escapeHtml(job.skills || "Not specified")}</small>
            <br><br>
            <button onclick="applyToJob(${job.id})">Apply Now</button>
        </article>
    `).join("");
}

async function applyToJob(jobId) {
    if (!currentUser) {
        showLogin();
        return;
    }

    if (currentUser.role !== "CANDIDATE") {
        alert("Only candidate accounts can apply.");
        return;
    }

    const coverLetter = prompt("Enter a short cover letter:");
    if (coverLetter === null) return;

    const response = await fetch("/api/jobs/" + jobId + "/apply", {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({
            resumeUrl: "",
            coverLetter: coverLetter
        })
    });

    const data = await response.json();

    if (!response.ok) {
        alert(data.message || "Application failed");
        return;
    }

    alert("Application submitted successfully.");
    loadApplications();
}

async function loadApplications() {
    const area = document.getElementById("applications");

    if (!currentUser) {
        area.textContent = "Login as a candidate to see your applications.";
        return;
    }

    if (currentUser.role !== "CANDIDATE") {
        area.textContent = "Recruiter accounts manage applications from their recruiter APIs.";
        return;
    }

    const response = await fetch("/api/applications/my", {
        headers: headers()
    });

    if (!response.ok) {
        area.textContent = "Unable to load applications.";
        return;
    }

    const applications = await response.json();

    area.innerHTML = applications.length
        ? applications.map(item => `
            <div class="application">
                <div>
                    <b>${escapeHtml(item.job.title)}</b><br>
                    ${escapeHtml(item.job.company)}
                </div>
                <div class="status">${escapeHtml(item.status)}</div>
            </div>
        `).join("")
        : "<p>No applications yet.</p>";
}

function showLogin() {
    openModal(`
        <h2>Login</h2>
        <form class="form" onsubmit="login(event)">
            <input id="loginEmail" type="email" placeholder="Email" required>
            <input id="loginPassword" type="password" placeholder="Password" required>
            <button type="submit">Login</button>
        </form>
        <div class="switch" onclick="showRegister()">Create account</div>
    `);
}

function showRegister() {
    openModal(`
        <h2>Create Account</h2>
        <form class="form" onsubmit="register(event)">
            <input id="registerName" placeholder="Full name" required>
            <input id="registerEmail" type="email" placeholder="Email" required>
            <input id="registerPassword" type="password" placeholder="Password" required>
            <input id="registerSkills" placeholder="Skills">
            <select id="registerRole">
                <option value="CANDIDATE">Candidate</option>
                <option value="RECRUITER">Recruiter</option>
            </select>
            <button type="submit">Create Account</button>
        </form>
        <div class="switch" onclick="showLogin()">Already registered? Login</div>
    `);
}

async function register(event) {
    event.preventDefault();

    const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            name: document.getElementById("registerName").value,
            email: document.getElementById("registerEmail").value,
            password: document.getElementById("registerPassword").value,
            skills: document.getElementById("registerSkills").value,
            role: document.getElementById("registerRole").value
        })
    });

    const data = await response.json();

    if (!response.ok) {
        alert(data.message || "Registration failed");
        return;
    }

    alert("Registration successful. Now login.");
    showLogin();
}

async function login(event) {
    event.preventDefault();

    const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            email: document.getElementById("loginEmail").value,
            password: document.getElementById("loginPassword").value
        })
    });

    const data = await response.json();

    if (!response.ok) {
        alert(data.message || "Login failed");
        return;
    }

    currentUser = data;
    localStorage.setItem("jobsphereUser", JSON.stringify(data));

    closeModal();
    updateNavigation();
    loadApplications();
}

function logout() {
    localStorage.removeItem("jobsphereUser");
    currentUser = null;
    updateNavigation();
    loadApplications();
}

function updateNavigation() {
    const loginButton = document.getElementById("loginButton");
    const logoutButton = document.getElementById("logoutButton");

    if (currentUser) {
        loginButton.textContent = currentUser.name.split(" ")[0];
        loginButton.onclick = () =>
            document.getElementById("applications").scrollIntoView();
        logoutButton.classList.remove("hidden");
    } else {
        loginButton.textContent = "Login";
        loginButton.onclick = showLogin;
        logoutButton.classList.add("hidden");
    }
}

function openModal(content) {
    document.getElementById("modalContent").innerHTML = content;
    document.getElementById("modal").classList.remove("hidden");
}

function closeModal() {
    document.getElementById("modal").classList.add("hidden");
}

updateNavigation();
loadJobs();
loadApplications();
