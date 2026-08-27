import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const API =
    window.location.hostname === 'localhost'
        ? 'http://localhost:10000'
        : '';

const loadUser = () =>
    JSON.parse(localStorage.getItem('jobsphereUser') || 'null');

const saveUser = (u) => {
    if (u) localStorage.setItem('jobsphereUser', JSON.stringify(u));
    else localStorage.removeItem('jobsphereUser');
};

async function api(path, options = {}) {
    const user = loadUser();

    const headers = {
        ...(options.headers || {})
    };

    if (user?.token) {
        headers.Authorization = `Bearer ${user.token}`;
    }

    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(API + path, {
        ...options,
        headers
    });

    const text = await res.text();

    let data = {};

    try {
        data = text ? JSON.parse(text) : {};
    } catch {
        data = { message: text };
    }

    if (!res.ok) {
        throw new Error(
            data.message || 'Something went wrong'
        );
    }

    return data;
}
const cls = (...x) => x.filter(Boolean).join(' ');

function App() {
    const [user, setUser] = useState(loadUser());
    const [page, setPage] = useState('home');
    const [toast, setToast] = useState('');

    useEffect(() => {
        const onHash = () =>
            setPage(location.hash.replace('#/', '') || 'home');

        onHash();
        addEventListener('hashchange', onHash);

        return () => removeEventListener('hashchange', onHash);
    }, []);

    useEffect(() => {
        if (toast) {
            const t = setTimeout(() => setToast(''), 2800);
            return () => clearTimeout(t);
        }
    }, [toast]);

    const go = (p) => {
        location.hash = '/' + p;
    };

    const login = (u) => {
        saveUser(u);
        setUser(u);
        go('dashboard');
        setToast('Welcome back, ' + u.name.split(' ')[0] + '!');
    };

    const logout = () => {
        saveUser(null);
        setUser(null);
        go('home');
        setToast('Logged out successfully');
    };

    return (
        <div className="app">
            <Header user={user} go={go} logout={logout} />

            <main>
                {page === 'home' && <Home user={user} go={go} />}
                {page === 'jobs' && (
                    <Jobs user={user} go={go} toast={setToast} />
                )}
                {page === 'dashboard' && (
                    <Dashboard user={user} go={go} toast={setToast} />
                )}
                {page==='profile'&&<Profile user={user} setUser={setUser} toast={setToast}/>}
                {page === 'login' && (
                    <Auth
                        mode="login"
                        onSuccess={login}
                        switchMode={() => go('register')}
                    />
                )}
                {page === 'register' && (
                    <Auth
                        mode="register"
                        onSuccess={() => {
                            go('login');
                            setToast('Registration successful. Please log in.');
                        }}
                        switchMode={() => go('login')}
                    />
                )}
            </main>

            {toast && <div className="toast">✓ {toast}</div>}
        </div>
    );
}

function Header({ user, go, logout }) {
    return (
        <header className="nav">
            <div className="nav-inner">
                <button className="brand" onClick={() => go('home')}>
                    <span className="brand-mark">J</span>
                    Job<span>Sphere</span>
                </button>

                <nav>
                    <button onClick={() => go('jobs')}>Find Jobs</button>
                    {user && (
                        <button onClick={() => go('dashboard')}>
                            Dashboard
                        </button>
                    )}
                    {user&&<button onClick={()=>go('profile')}>Profile</button>}
                </nav>

                <div className="nav-actions">
                    {user ? (
                        <>
              <span className="user-pill">
                {user.name.split(' ')[0]} · {user.role}
              </span>
                            <button className="btn ghost" onClick={logout}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                className="btn ghost"
                                onClick={() => go('login')}
                            >
                                Login
                            </button>

                            <button
                                className="btn primary"
                                onClick={() => go('register')}
                            >
                                Get Started
                            </button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

function Home({ user, go }) {
    return (
        <>
            <section className="hero">
                <div className="hero-copy">
                    <div className="eyebrow">
                        JAVA · SPRING BOOT · REACT · MYSQL
                    </div>

                    <h1>
                        Find the right job.
                        <br />
                        <span>Build your career.</span>
                    </h1>

                    <p>
                        Discover opportunities, apply online and track your
                        application journey with JobSphere.
                    </p>

                    <div className="hero-actions">
                        <button
                            className="btn primary big"
                            onClick={() => go('jobs')}
                        >
                            Explore Jobs <span>→</span>
                        </button>

                        {!user && (
                            <button
                                className="btn ghost big"
                                onClick={() => go('register')}
                            >
                                Create account
                            </button>
                        )}
                    </div>

                    <div className="trust">
                        <span>✓ Secure JWT authentication</span>
                        <span>✓ Role-based access</span>
                        <span>✓ Application tracking</span>
                    </div>
                </div>

                <div className="hero-card">
                    <div className="floating-card">
                        <div className="mini-icon">⌕</div>
                        <div>
                            <b>Search smarter</b>
                            <small>Jobs matched to your skills</small>
                        </div>
                    </div>

                    <div className="job-preview">
                        <div className="company-logo">T</div>
                        <div>
                            <b>Java Backend Developer</b>
                            <small>TechNova · Bengaluru</small>
                            <div className="tags">
                                <span>Java</span>
                                <span>Spring Boot</span>
                                <span>SQL</span>
                            </div>
                        </div>
                        <span className="save">♡</span>
                    </div>

                    <div className="job-preview">
                        <div className="company-logo alt">A</div>
                        <div>
                            <b>Full Stack Engineer</b>
                            <small>Acme Systems · Remote</small>
                            <div className="tags">
                                <span>React</span>
                                <span>REST API</span>
                            </div>
                        </div>
                        <span className="save">♡</span>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="section-head">
                    <div>
                        <div className="eyebrow">OPPORTUNITIES</div>
                        <h2>Find your next job</h2>
                        <p>
                            Search active roles by title, company or location.
                        </p>
                    </div>

                    <button className="text-btn" onClick={() => go('jobs')}>
                        View all jobs →
                    </button>
                </div>

                <Jobs user={user} go={go} compact />
            </section>

            <section className="feature-grid section">
                <Feature
                    icon="⚡"
                    title="Fast job search"
                    text="Search active opportunities with a clean, responsive interface."
                />

                <Feature
                    icon="🔐"
                    title="Secure access"
                    text="JWT authentication, BCrypt passwords and role-based authorization."
                />

                <Feature
                    icon="📈"
                    title="Track applications"
                    text="Follow your application status from applied to selected."
                />
            </section>
        </>
    );
}

function Feature({ icon, title, text }) {
    return (
        <article className="feature">
            <div className="feature-icon">{icon}</div>
            <h3>{title}</h3>
            <p>{text}</p>
        </article>
    );
}

function Jobs({ user, go, toast, compact = false }) {
    const [jobs, setJobs] = useState([]);
    const [q, setQ] = useState('');
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);

    const fetchJobs = async (keyword = q) => {
        setLoading(true);

        try {
            const result = await api(
                '/api/jobs?keyword=' +
                encodeURIComponent(keyword.trim())
            );

            setJobs(
                Array.isArray(result)
                    ? result
                    : Array.isArray(result?.content)
                        ? result.content
                        : Array.isArray(result?.jobs)
                            ? result.jobs
                            : []
            );

        } catch (e) {
            toast?.(e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs('');
    }, []);

    const clearSearch = () => {
        setQ('');
        fetchJobs('');
    };

    const jobList = Array.isArray(jobs) ? jobs : [];

    const shown = compact
        ? jobList.slice(0, 3)
        : jobList;

    return (
        <section
            className={cls(
                'jobs-section',
                compact ? 'compact' : 'section'
            )}
        >

            {/* SEARCH HEADER */}

            <div className="search-panel">

                <div>
                    <div className="eyebrow">
                        JOB SEARCH
                    </div>

                    <h2>
                        {compact
                            ? 'Latest opportunities'
                            : 'Find your next opportunity'}
                    </h2>

                    <p className="muted">
                        Search by job title, company or skills.
                    </p>
                </div>

                <div className="search-row">

                    <input
                        value={q}
                        onChange={(e) =>
                            setQ(e.target.value)
                        }
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                fetchJobs();
                            }
                        }}
                        placeholder="Java, Spring Boot, Developer..."
                    />

                    <button
                        className="btn primary"
                        onClick={() => fetchJobs()}
                    >
                        Search
                    </button>

                    {q && (
                        <button
                            className="btn outline"
                            onClick={clearSearch}
                        >
                            Clear
                        </button>
                    )}

                </div>

            </div>

            {/* RESULTS */}

            {!loading && !compact && (
                <div className="section-head">

                    <div>
                        <strong>
                            {jobList.length}
                        </strong>{' '}
                        {jobList.length === 1
                            ? 'job found'
                            : 'jobs found'}
                    </div>

                    {q && (
                        <span className="muted">
                            Search results for "{q}"
                        </span>
                    )}

                </div>
            )}

            {loading ? (

                <div className="loading">
                    Finding opportunities...
                </div>

            ) : shown.length ? (

                <div className="job-grid">

                    {shown.map((j) => (
                        <JobCard
                            key={j.id}
                            job={j}
                            onApply={() =>
                                setSelected(j)
                            }
                        />
                    ))}

                </div>

            ) : (

                <div className="empty">

                    <b>
                        No jobs found
                    </b>

                    <p>
                        Try searching for another job title,
                        company or skill.
                    </p>

                    {q && (
                        <button
                            className="btn outline"
                            onClick={clearSearch}
                        >
                            Show all jobs
                        </button>
                    )}

                </div>

            )}

            {/* COMPACT HOME SECTION */}

            {compact && jobs.length > 3 && (

                <button
                    className="btn outline center"
                    onClick={() => go('jobs')}
                >
                    See all {jobs.length} jobs
                </button>

            )}

            {/* APPLY MODAL */}

            {selected && (

                <ApplyModal
                    job={selected}
                    user={user}
                    close={() => setSelected(null)}
                    toast={toast}
                    go={go}
                />

            )}

        </section>
    );
}
function JobCard({ job, onApply }) {
    const postedDate = job.postedAt
        ? new Date(job.postedAt).toLocaleDateString()
        : null;

    const skills = (job.skills || 'Skills not specified')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 5);

    return (
        <article className="job-card">

            <div className="card-top">

                <div className="company-logo">
                    {(job.company || 'J')[0].toUpperCase()}
                </div>

                <button
                    className="save"
                    type="button"
                    title="Save job"
                    onClick={() => {}}
                >
                    ♡
                </button>

            </div>

            <h3>{job.title}</h3>

            <div className="company">
                {job.company || 'Company'}
            </div>

            <div className="meta">

                <span>
                    📍 {job.location || 'Location not specified'}
                </span>

                <span>
                    💼 {job.employmentType || 'Full-time'}
                </span>

            </div>

            {job.description && (
                <p>{job.description}</p>
            )}

            <div className="tags">

                {skills.map((skill) => (
                    <span key={skill}>
                        {skill}
                    </span>
                ))}

            </div>

            <div className="card-bottom">

                <div>

                    <b>
                        {job.salaryRange ||
                            'Salary not disclosed'}
                    </b>

                    {postedDate && (
                        <small>
                            Posted {postedDate}
                        </small>
                    )}

                </div>

                <button
                    className="btn small primary"
                    type="button"
                    onClick={onApply}
                >
                    Apply now
                </button>

            </div>

        </article>
    );
}
function ApplyModal({ job, user, close, toast, go }) {
    const [resumeUrl, setResumeUrl] = useState('');
    const [cover, setCover] = useState('');
    const [busy, setBusy] = useState(false);

    const submit = async (e) => {
        e.preventDefault();

        if (!user) {
            close();
            go('login');
            return;
        }

        if (user.role !== 'CANDIDATE') {
            toast('Only candidate accounts can apply.');
            return;
        }

        if (!resumeUrl.trim()) {
            toast('Please provide your resume link.');
            return;
        }

        if (!cover.trim()) {
            toast('Please write a short cover letter.');
            return;
        }

        setBusy(true);

        try {
            await api('/api/jobs/' + job.id + '/apply', {
                method: 'POST',
                body: JSON.stringify({
                    resumeUrl: resumeUrl.trim(),
                    coverLetter: cover.trim()
                })
            });

            toast('Application submitted successfully.');
            close();

        } catch (err) {
            toast(err.message);

        } finally {
            setBusy(false);
        }
    };

    return (
        <div
            className="modal-backdrop"
            onClick={close}
        >
            <div
                className="modal apply-modal"
                onClick={(e) => e.stopPropagation()}
            >

                <button
                    className="modal-x"
                    onClick={close}
                    type="button"
                >
                    ×
                </button>

                <div className="eyebrow">
                    APPLY NOW
                </div>

                <h2>{job.title}</h2>

                <p>
                    {job.company} · {job.location}
                </p>

                {!user ? (

                    <>
                        <div className="notice">
                            Please log in as a candidate to
                            apply for this position.
                        </div>

                        <button
                            className="btn primary wide"
                            type="button"
                            onClick={() => {
                                close();
                                go('login');
                            }}
                        >
                            Login to apply
                        </button>
                    </>

                ) : user.role !== 'CANDIDATE' ? (

                    <div className="notice">
                        Only candidate accounts can apply
                        for jobs.
                    </div>

                ) : (

                    <form onSubmit={submit}>

                        <div className="panel">

                            <strong>
                                Applying as
                            </strong>

                            <p className="muted">
                                {user.name} · {user.email}
                            </p>

                        </div>

                        <label>
                            Resume URL

                            <input
                                type="url"
                                required
                                value={resumeUrl}
                                onChange={(e) =>
                                    setResumeUrl(
                                        e.target.value
                                    )
                                }
                                placeholder="https://drive.google.com/..."
                            />

                            <span className="muted">
                                Add a public Google Drive,
                                portfolio or resume link.
                            </span>
                        </label>

                        <label>
                            Cover letter

                            <textarea
                                required
                                value={cover}
                                onChange={(e) =>
                                    setCover(
                                        e.target.value
                                    )
                                }
                                placeholder="Tell the recruiter why you're a good fit for this role..."
                                rows="6"
                            />
                        </label>

                        <button
                            className="btn primary wide"
                            type="submit"
                            disabled={busy}
                        >
                            {busy
                                ? 'Submitting...'
                                : 'Submit application'}
                        </button>

                    </form>
                )}

            </div>
        </div>
    );
}

function Auth({ mode, onSuccess, switchMode }) {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        role: 'CANDIDATE',
        skills: '',
        phone: ''
    });

    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);

    const login = mode === 'login';

    const submit = async (e) => {
        e.preventDefault();
        setError('');
        setBusy(true);

        try {
            const data = await api(
                '/api/auth/' + (login ? 'login' : 'register'),
                {
                    method: 'POST',
                    body: JSON.stringify(form)
                }
            );

            onSuccess(data);
        } catch (e) {
            setError(e.message);
        } finally {
            setBusy(false);
        }
    };

    return (
        <section className="auth section">
            <div className="auth-card">
                <div className="auth-side">
                    <div className="eyebrow">JOBSPHERE</div>

                    <h1>
                        {login
                            ? 'Welcome back.'
                            : 'Start your career journey.'}
                    </h1>

                    <p>
                        {login
                            ? 'Sign in to discover jobs and manage your applications.'
                            : 'Create a candidate or recruiter account and get started.'}
                    </p>

                    <div className="auth-points">
                        <span>✓ Secure authentication</span>
                        <span>✓ Personalized dashboard</span>
                        <span>✓ Application tracking</span>
                    </div>
                </div>

                <form className="auth-form" onSubmit={submit}>
                    <h2>
                        {login ? 'Sign in' : 'Create account'}
                    </h2>

                    <p className="muted">
                        {login
                            ? 'Use your JobSphere credentials.'
                            : 'It only takes a minute.'}
                    </p>

                    {!login && (
                        <>
                            <label>
                                Full name
                                <input
                                    required
                                    value={form.name}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            name: e.target.value
                                        })
                                    }
                                />
                            </label>

                            <label>
                                Phone
                                <input
                                    value={form.phone}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            phone: e.target.value
                                        })
                                    }
                                />
                            </label>

                            <label>
                                Account type
                                <select
                                    value={form.role}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            role: e.target.value
                                        })
                                    }
                                >
                                    <option value="CANDIDATE">
                                        Candidate
                                    </option>
                                    <option value="RECRUITER">
                                        Recruiter
                                    </option>
                                </select>
                            </label>

                            <label>
                                Skills
                                <input
                                    value={form.skills}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            skills: e.target.value
                                        })
                                    }
                                    placeholder="Java, Spring Boot, React"
                                />
                            </label>
                        </>
                    )}

                    <label>
                        Email
                        <input
                            required
                            type="email"
                            value={form.email}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    email: e.target.value
                                })
                            }
                        />
                    </label>

                    <label>
                        Password
                        <input
                            required
                            type="password"
                            value={form.password}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    password: e.target.value
                                })
                            }
                        />
                    </label>

                    {error && <div className="error">{error}</div>}

                    <button
                        className="btn primary wide"
                        disabled={busy}
                    >
                        {busy
                            ? login
                                ? 'Signing in…'
                                : 'Creating…'
                            : login
                                ? 'Sign in'
                                : 'Create account'}
                    </button>

                    <button
                        type="button"
                        className="switch-btn"
                        onClick={switchMode}
                    >
                        {login
                            ? 'Need an account? Create one'
                            : 'Already have an account? Sign in'}
                    </button>
                </form>
            </div>
        </section>
    );
}

function Dashboard({ user, go, toast }) {
    if (!user) {
        go('login');
        return null;
    }

    if (user.role === 'RECRUITER') {
        return <RecruiterDashboard user={user} toast={toast} />;
    }

    if (user.role === 'ADMIN') {
        return <AdminDashboard />;
    }

    return <CandidateDashboard user={user} toast={toast} />;
}
function CandidateDashboard({ user, toast }) {
    const [apps, setApps] = useState([]);
    const [interviews, setInterviews] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api('/api/applications/my')
            .then(async (data) => {
                const applications = Array.isArray(data)
                    ? data
                    : [];

                setApps(applications);

                const interviewApps = applications.filter(
                    (a) => a.status === 'INTERVIEW'
                );

                const interviewResults = await Promise.all(
                    interviewApps.map(async (a) => {
                        try {
                            const interview = await api(
                                `/api/applications/${a.id}/interview`
                            );

                            return {
                                id: a.id,
                                interview
                            };
                        } catch {
                            return {
                                id: a.id,
                                interview: null
                            };
                        }
                    })
                );

                const interviewMap = {};

                interviewResults.forEach((item) => {
                    interviewMap[item.id] = item.interview;
                });

                setInterviews(interviewMap);
            })
            .catch((e) => toast(e.message))
            .finally(() => setLoading(false));
    }, []);

    const counts = useMemo(() => {
        return {
            total: apps.length,

            active: apps.filter(
                (a) =>
                    !['REJECTED', 'SELECTED'].includes(
                        a.status
                    )
            ).length,

            applied: apps.filter(
                (a) => a.status === 'APPLIED'
            ).length,

            shortlisted: apps.filter(
                (a) => a.status === 'SHORTLISTED'
            ).length,

            interview: apps.filter(
                (a) => a.status === 'INTERVIEW'
            ).length,

            selected: apps.filter(
                (a) => a.status === 'SELECTED'
            ).length,

            rejected: apps.filter(
                (a) => a.status === 'REJECTED'
            ).length
        };
    }, [apps]);

    return (
        <section className="section dashboard">

            {/* HEADER */}

            <div className="dash-head">

                <div>

                    <div className="eyebrow">
                        CANDIDATE DASHBOARD
                    </div>

                    <h1>
                        Hello, {user.name.split(' ')[0]} 👋
                    </h1>

                    <p>
                        Track your applications and stay updated
                        throughout your job search.
                    </p>

                </div>

                <a
                    className="btn primary"
                    href="#/jobs"
                >
                    Find jobs
                </a>

            </div>


            {/* STATS */}

            <div className="stats">

                <Stat
                    label="Applications"
                    value={counts.total}
                    icon="📄"
                />

                <Stat
                    label="In progress"
                    value={counts.active}
                    icon="⏳"
                />

                <Stat
                    label="Shortlisted"
                    value={counts.shortlisted}
                    icon="⭐"
                />

                <Stat
                    label="Interviews"
                    value={counts.interview}
                    icon="🗓️"
                />

                <Stat
                    label="Selected"
                    value={counts.selected}
                    icon="🎯"
                />

                <Stat
                    label="Rejected"
                    value={counts.rejected}
                    icon="❌"
                />

            </div>


            {/* APPLICATION PIPELINE */}

            <div className="admin-grid">

                <div className="panel">

                    <div className="panel-head">
                        <h2>
                            Application progress
                        </h2>
                    </div>

                    <div className="admin-list">

                        <div>
                            <span>Applied</span>
                            <strong>{counts.applied}</strong>
                        </div>

                        <div>
                            <span>Shortlisted</span>
                            <strong>{counts.shortlisted}</strong>
                        </div>

                        <div>
                            <span>Interview</span>
                            <strong>{counts.interview}</strong>
                        </div>

                        <div>
                            <span>Selected</span>
                            <strong>{counts.selected}</strong>
                        </div>

                    </div>

                </div>


                <div className="panel">

                    <div className="panel-head">
                        <h2>
                            Next opportunity
                        </h2>
                    </div>

                    <p className="muted">
                        Keep exploring new roles and apply to
                        positions that match your skills.
                    </p>

                    <a
                        href="#/jobs"
                        className="btn primary"
                    >
                        Browse jobs
                    </a>

                </div>

            </div>


            {/* INTERVIEW DETAILS */}

            {apps
                .filter(
                    (a) => a.status === 'INTERVIEW'
                )
                .map((a) => {

                    const interview =
                        interviews[a.id];

                    return (
                        <div
                            className="panel"
                            key={'interview-' + a.id}
                        >

                            <div className="panel-head">

                                <div>
                                    <div className="eyebrow">
                                        INTERVIEW
                                    </div>

                                    <h2>
                                        Interview scheduled
                                    </h2>

                                    <p className="muted">
                                        {a.job?.title ||
                                            'Job'}
                                        {' · '}
                                        {a.job?.company ||
                                            'Company'}
                                    </p>
                                </div>

                                <span className="badge success">
                                    INTERVIEW
                                </span>

                            </div>


                            {!interview ? (

                                <div className="loading">
                                    Loading interview details...
                                </div>

                            ) : (

                                <div className="admin-grid">

                                    <div className="admin-list">

                                        <div>
                                            <span>
                                                Date & time
                                            </span>

                                            <strong>
                                                {interview.interviewDate
                                                    ? new Date(
                                                        interview.interviewDate
                                                    ).toLocaleString()
                                                    : 'Not provided'}
                                            </strong>
                                        </div>


                                        <div>
                                            <span>
                                                Meeting
                                            </span>

                                            {interview.meetingLink ? (

                                                <a
                                                    href={
                                                        interview.meetingLink
                                                    }
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="btn primary small"
                                                >
                                                    Join Interview
                                                </a>

                                            ) : (

                                                <strong>
                                                    Link not provided
                                                </strong>

                                            )}
                                        </div>

                                    </div>


                                    <div className="panel">

                                        <div className="panel-head">
                                            <h3>
                                                Interview notes
                                            </h3>
                                        </div>

                                        <p className="muted">
                                            {interview.notes ||
                                                'No additional notes provided.'}
                                        </p>

                                    </div>

                                </div>

                            )}

                        </div>
                    );
                })}


            {/* MY APPLICATIONS */}

            <div className="panel">

                <div className="panel-head">

                    <div>

                        <h2>
                            My applications
                        </h2>

                        <p className="muted">
                            Track every job application in one place.
                        </p>

                    </div>

                    <a
                        href="#/jobs"
                        className="btn outline small"
                    >
                        + Apply to jobs
                    </a>

                </div>


                {loading ? (

                    <div className="loading">
                        Loading your applications...
                    </div>

                ) : apps.length ? (

                    <div className="table-wrap">

                        <table>

                            <thead>

                            <tr>
                                <th>Job</th>
                                <th>Company</th>
                                <th>Applied</th>
                                <th>Status</th>
                            </tr>

                            </thead>


                            <tbody>

                            {apps.map((a) => (

                                <tr key={a.id}>

                                    <td>
                                        <b>
                                            {a.job?.title ||
                                                'Job'}
                                        </b>
                                    </td>

                                    <td>
                                        {a.job?.company ||
                                            '—'}
                                    </td>

                                    <td>
                                        {a.appliedAt
                                            ? new Date(
                                                a.appliedAt
                                            ).toLocaleDateString()
                                            : '—'}
                                    </td>

                                    <td>
                                        <Status
                                            status={a.status}
                                        />
                                    </td>

                                </tr>

                            ))}

                            </tbody>

                        </table>

                    </div>

                ) : (

                    <div className="empty">

                        <b>
                            No applications yet
                        </b>

                        <p>
                            Start your job search and apply
                            to your first opportunity.
                        </p>

                        <a
                            href="#/jobs"
                            className="btn primary"
                        >
                            Explore jobs
                        </a>

                    </div>

                )}

            </div>

        </section>
    );
}
function RecruiterDashboard({ user, toast }) {
    const emptyForm = {
        title: '',
        company: '',
        location: '',
        description: '',
        skills: '',
        employmentType: 'Full-time',
        salaryRange: ''
    };

    const [jobs, setJobs] = useState([]);
    const [apps, setApps] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [show, setShow] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [viewingResume, setViewingResume] = useState(null);

    const [interviewApp, setInterviewApp] = useState(null);
    const [interviewForm, setInterviewForm] = useState({
        interviewDate: '',
        meetingLink: '',
        notes: ''
    });
    const [schedulingInterview, setSchedulingInterview] =
        useState(false);

    const reload = async () => {
        setLoading(true);

        try {
            const [j, a] = await Promise.all([
                api('/api/recruiter/jobs'),
                api('/api/recruiter/applications')
            ]);

            setJobs(Array.isArray(j) ? j : []);
            setApps(Array.isArray(a) ? a : []);

        } catch (e) {
            toast(e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        reload();
    }, []);

    const changeForm = (field, value) => {
        setForm((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const openCreate = () => {
        setEditingId(null);
        setForm(emptyForm);
        setShow(true);
    };

    const openEdit = (job) => {
        setEditingId(job.id);

        setForm({
            title: job.title || '',
            company: job.company || '',
            location: job.location || '',
            description: job.description || '',
            skills: job.skills || '',
            employmentType: job.employmentType || 'Full-time',
            salaryRange: job.salaryRange || ''
        });

        setShow(true);

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const cancelForm = () => {
        setEditingId(null);
        setForm(emptyForm);
        setShow(false);
    };

    const saveJob = async (e) => {
        e.preventDefault();

        try {
            if (editingId) {
                await api(
                    '/api/recruiter/jobs/' + editingId,
                    {
                        method: 'PUT',
                        body: JSON.stringify(form)
                    }
                );

                toast('Job updated successfully.');
            } else {
                await api('/api/recruiter/jobs', {
                    method: 'POST',
                    body: JSON.stringify(form)
                });

                toast('Job published successfully.');
            }

            cancelForm();
            await reload();

        } catch (e) {
            toast(e.message);
        }
    };

    const closeJob = async (id) => {
        if (!window.confirm(
            'Are you sure you want to close this job?'
        )) {
            return;
        }

        try {
            await api('/api/recruiter/jobs/' + id, {
                method: 'DELETE'
            });

            toast('Job closed successfully.');
            await reload();

        } catch (e) {
            toast(e.message);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await api(
                '/api/recruiter/applications/' +
                id +
                '/status?status=' +
                status,
                {
                    method: 'PATCH'
                }
            );

            toast('Application status updated.');
            await reload();

        } catch (e) {
            toast(e.message);
        }
    };

    const viewCandidateResume = async (candidateId) => {
        if (!candidateId) {
            toast('Candidate information not found.');
            return;
        }

        try {
            setViewingResume(candidateId);

            const currentUser = loadUser();

            if (!currentUser?.token) {
                toast('Please login again.');
                return;
            }

            const response = await fetch(
                API +
                '/api/profile/resume/' +
                candidateId,
                {
                    method: 'GET',
                    headers: {
                        Authorization:
                            `Bearer ${currentUser.token}`
                    }
                }
            );

            if (!response.ok) {
                const text = await response.text();

                let message =
                    'Unable to open candidate resume.';

                try {
                    const data = text
                        ? JSON.parse(text)
                        : {};

                    message =
                        data.message || message;
                } catch {
                    if (text) {
                        message = text;
                    }
                }

                throw new Error(message);
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            window.open(url, '_blank');

            setTimeout(() => {
                URL.revokeObjectURL(url);
            }, 60000);

        } catch (e) {
            toast(e.message);
        } finally {
            setViewingResume(null);
        }
    };

    const openInterview = (application) => {
        setInterviewApp(application);

        setInterviewForm({
            interviewDate: '',
            meetingLink: '',
            notes: ''
        });
    };

    const closeInterview = () => {
        if (schedulingInterview) return;

        setInterviewApp(null);

        setInterviewForm({
            interviewDate: '',
            meetingLink: '',
            notes: ''
        });
    };

    const scheduleInterview = async (e) => {
        e.preventDefault();

        if (!interviewApp) return;

        if (!interviewForm.interviewDate) {
            toast('Please select interview date and time.');
            return;
        }

        setSchedulingInterview(true);

        try {
            const params = new URLSearchParams();

            params.append(
                'interviewDate',
                interviewForm.interviewDate
            );

            if (interviewForm.meetingLink.trim()) {
                params.append(
                    'meetingLink',
                    interviewForm.meetingLink.trim()
                );
            }

            if (interviewForm.notes.trim()) {
                params.append(
                    'notes',
                    interviewForm.notes.trim()
                );
            }

            await api(
                '/api/recruiter/applications/' +
                interviewApp.id +
                '/interview?' +
                params.toString(),
                {
                    method: 'POST'
                }
            );

            toast(
                'Interview scheduled successfully.'
            );

            closeInterview();
            await reload();

        } catch (e) {
            toast(e.message);
        } finally {
            setSchedulingInterview(false);
        }
    };

    const activeJobs =
        jobs.filter((j) => j.active).length;

    const closedJobs =
        jobs.filter((j) => !j.active).length;

    const applied =
        apps.filter(
            (a) => a.status === 'APPLIED'
        ).length;

    const shortlisted =
        apps.filter(
            (a) => a.status === 'SHORTLISTED'
        ).length;

    const interviews =
        apps.filter(
            (a) => a.status === 'INTERVIEW'
        ).length;

    const selected =
        apps.filter(
            (a) => a.status === 'SELECTED'
        ).length;

    const rejected =
        apps.filter(
            (a) => a.status === 'REJECTED'
        ).length;

    return (
        <section className="section dashboard">

            {/* HEADER */}

            <div className="dash-head">

                <div>
                    <div className="eyebrow">
                        RECRUITER DASHBOARD
                    </div>

                    <h1>
                        Manage your hiring.
                    </h1>

                    <p>
                        Publish jobs, manage listings and move
                        candidates through your hiring pipeline.
                    </p>
                </div>

                <button
                    className="btn primary"
                    onClick={openCreate}
                >
                    + Post a job
                </button>

            </div>


            {/* JOB FORM */}

            {show && (
                <form
                    className="panel job-form"
                    onSubmit={saveJob}
                >

                    <div className="panel-head">

                        <h2>
                            {editingId
                                ? 'Edit job'
                                : 'Create a new job'}
                        </h2>

                        <button
                            type="button"
                            className="btn ghost small"
                            onClick={cancelForm}
                        >
                            Cancel
                        </button>

                    </div>

                    <div className="form-grid">

                        <label>
                            Job title

                            <input
                                required
                                value={form.title}
                                onChange={(e) =>
                                    changeForm(
                                        'title',
                                        e.target.value
                                    )
                                }
                                placeholder="Java Developer"
                            />
                        </label>

                        <label>
                            Company

                            <input
                                required
                                value={form.company}
                                onChange={(e) =>
                                    changeForm(
                                        'company',
                                        e.target.value
                                    )
                                }
                                placeholder="Your company"
                            />
                        </label>

                        <label>
                            Location

                            <input
                                required
                                value={form.location}
                                onChange={(e) =>
                                    changeForm(
                                        'location',
                                        e.target.value
                                    )
                                }
                                placeholder="Bangalore / Remote"
                            />
                        </label>

                        <label>
                            Employment

                            <select
                                value={form.employmentType}
                                onChange={(e) =>
                                    changeForm(
                                        'employmentType',
                                        e.target.value
                                    )
                                }
                            >
                                <option>Full-time</option>
                                <option>Part-time</option>
                                <option>Contract</option>
                                <option>Internship</option>
                            </select>
                        </label>

                        <label>
                            Skills

                            <input
                                value={form.skills}
                                onChange={(e) =>
                                    changeForm(
                                        'skills',
                                        e.target.value
                                    )
                                }
                                placeholder="Java, Spring Boot, MySQL"
                            />
                        </label>

                        <label>
                            Salary range

                            <input
                                value={form.salaryRange}
                                onChange={(e) =>
                                    changeForm(
                                        'salaryRange',
                                        e.target.value
                                    )
                                }
                                placeholder="₹6 - ₹10 LPA"
                            />
                        </label>

                    </div>

                    <label>
                        Description

                        <textarea
                            required
                            rows="6"
                            value={form.description}
                            onChange={(e) =>
                                changeForm(
                                    'description',
                                    e.target.value
                                )
                            }
                            placeholder="Describe the role, responsibilities and requirements..."
                        />
                    </label>

                    <button
                        className="btn primary"
                        type="submit"
                    >
                        {editingId
                            ? 'Save changes'
                            : 'Publish job'}
                    </button>

                </form>
            )}


            {/* STATS */}

            <div className="stats">

                <Stat
                    label="Active jobs"
                    value={activeJobs}
                    icon="💼"
                />

                <Stat
                    label="Total jobs"
                    value={jobs.length}
                    icon="📌"
                />

                <Stat
                    label="Closed jobs"
                    value={closedJobs}
                    icon="🔒"
                />

                <Stat
                    label="Applications"
                    value={apps.length}
                    icon="👥"
                />

                <Stat
                    label="Shortlisted"
                    value={shortlisted}
                    icon="⭐"
                />

                <Stat
                    label="Interviews"
                    value={interviews}
                    icon="🗓️"
                />

                <Stat
                    label="Selected"
                    value={selected}
                    icon="🎯"
                />

                <Stat
                    label="Rejected"
                    value={rejected}
                    icon="❌"
                />

            </div>


            {/* JOB MANAGEMENT */}

            <div className="panel">

                <div className="panel-head">

                    <div>
                        <h2>Your jobs</h2>

                        <p className="muted">
                            Create, edit and manage your job listings.
                        </p>
                    </div>

                    <button
                        className="btn outline small"
                        onClick={openCreate}
                    >
                        + New job
                    </button>

                </div>

                {loading ? (

                    <div className="loading">
                        Loading jobs...
                    </div>

                ) : jobs.length ? (

                    <div className="job-list-mini">

                        {jobs.map((j) => (

                            <div
                                className="mini-row recruiter-job-row"
                                key={j.id}
                            >

                                <div className="recruiter-job-info">

                                    <b>{j.title}</b>

                                    <small>
                                        {j.company} · {j.location}
                                    </small>

                                    <small>
                                        {j.employmentType}
                                        {j.salaryRange
                                            ? ' · ' +
                                            j.salaryRange
                                            : ''}
                                    </small>

                                </div>

                                <div className="recruiter-job-actions">

                                    <span
                                        className={cls(
                                            'badge',
                                            j.active
                                                ? 'success'
                                                : 'muted'
                                        )}
                                    >
                                        {j.active
                                            ? 'Active'
                                            : 'Closed'}
                                    </span>

                                    <button
                                        className="btn outline small"
                                        onClick={() =>
                                            openEdit(j)
                                        }
                                        disabled={!j.active}
                                    >
                                        Edit
                                    </button>

                                    {j.active && (
                                        <button
                                            className="btn ghost small"
                                            onClick={() =>
                                                closeJob(j.id)
                                            }
                                        >
                                            Close
                                        </button>
                                    )}

                                </div>

                            </div>

                        ))}

                    </div>

                ) : (

                    <div className="empty">

                        <b>
                            No jobs posted yet.
                        </b>

                        <p>
                            Create your first job opening
                            to start receiving applications.
                        </p>

                        <button
                            className="btn primary"
                            onClick={openCreate}
                        >
                            + Post your first job
                        </button>

                    </div>

                )}

            </div>


            {/* APPLICANT PIPELINE */}

            <div className="panel">

                <div className="panel-head">

                    <div>
                        <h2>
                            Applicant pipeline
                        </h2>

                        <p className="muted">
                            Review candidates, view resumes and
                            schedule interviews.
                        </p>
                    </div>

                </div>

                {apps.length ? (

                    <div className="table-wrap">

                        <table>

                            <thead>

                            <tr>
                                <th>Candidate</th>
                                <th>Job</th>
                                <th>Email</th>
                                <th>Resume</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>

                            </thead>

                            <tbody>

                            {apps.map((a) => (

                                <tr key={a.id}>

                                    <td>
                                        <b>
                                            {a.candidate?.name ||
                                                'Candidate'}
                                        </b>
                                    </td>

                                    <td>
                                        {a.job?.title ||
                                            'Job'}
                                    </td>

                                    <td>
                                        {a.candidate?.email ||
                                            '—'}
                                    </td>

                                    <td>

                                        {a.candidate?.id ? (

                                            <button
                                                type="button"
                                                className="btn outline small"
                                                onClick={() =>
                                                    viewCandidateResume(
                                                        a.candidate.id
                                                    )
                                                }
                                                disabled={
                                                    viewingResume ===
                                                    a.candidate.id
                                                }
                                            >
                                                {viewingResume ===
                                                a.candidate.id
                                                    ? 'Opening...'
                                                    : 'View Resume'}
                                            </button>

                                        ) : (

                                            <span className="muted">
                                                Not available
                                            </span>

                                        )}

                                    </td>

                                    <td>

                                        <select
                                            className="status-select"
                                            value={a.status}
                                            onChange={(e) =>
                                                updateStatus(
                                                    a.id,
                                                    e.target.value
                                                )
                                            }
                                        >

                                            <option value="APPLIED">
                                                Applied
                                            </option>

                                            <option value="SHORTLISTED">
                                                Shortlisted
                                            </option>

                                            <option value="INTERVIEW">
                                                Interview
                                            </option>

                                            <option value="SELECTED">
                                                Selected
                                            </option>

                                            <option value="REJECTED">
                                                Rejected
                                            </option>

                                        </select>

                                    </td>

                                    <td>

                                        {a.status ===
                                        'INTERVIEW' ? (

                                            <button
                                                type="button"
                                                className="btn primary small"
                                                onClick={() =>
                                                    openInterview(a)
                                                }
                                            >
                                                Schedule Interview
                                            </button>

                                        ) : (

                                            <span className="muted">
                                                —
                                            </span>

                                        )}

                                    </td>

                                </tr>

                            ))}

                            </tbody>

                        </table>

                    </div>

                ) : (

                    <div className="empty">

                        <b>
                            No applications yet.
                        </b>

                        <p>
                            Applications from candidates will
                            appear here.
                        </p>

                    </div>

                )}

            </div>


            {/* HIRING PIPELINE */}

            <div className="panel">

                <div className="panel-head">
                    <h2>
                        Hiring pipeline
                    </h2>
                </div>

                <div className="admin-grid">

                    <div className="admin-list">

                        <div>
                            <span>Applied</span>
                            <strong>{applied}</strong>
                        </div>

                        <div>
                            <span>Shortlisted</span>
                            <strong>{shortlisted}</strong>
                        </div>

                        <div>
                            <span>Interview</span>
                            <strong>{interviews}</strong>
                        </div>

                    </div>

                    <div className="admin-list">

                        <div>
                            <span>Selected</span>
                            <strong>{selected}</strong>
                        </div>

                        <div>
                            <span>Rejected</span>
                            <strong>{rejected}</strong>
                        </div>

                        <div>
                            <span>Total applications</span>
                            <strong>{apps.length}</strong>
                        </div>

                    </div>

                </div>

            </div>


            {/* SCHEDULE INTERVIEW MODAL */}

            {interviewApp && (

                <div
                    className="modal-backdrop"
                    onClick={closeInterview}
                >

                    <div
                        className="modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <button
                            className="modal-x"
                            onClick={closeInterview}
                            type="button"
                        >
                            ×
                        </button>

                        <div className="eyebrow">
                            INTERVIEW
                        </div>

                        <h2>
                            Schedule interview
                        </h2>

                        <p>
                            <b>
                                {interviewApp.candidate?.name ||
                                    'Candidate'}
                            </b>
                            {' · '}
                            {interviewApp.job?.title ||
                                'Job'}
                        </p>


                        <form
                            onSubmit={scheduleInterview}
                        >

                            <label>
                                Interview date & time

                                <input
                                    type="datetime-local"
                                    required
                                    value={
                                        interviewForm.interviewDate
                                    }
                                    onChange={(e) =>
                                        setInterviewForm(
                                            (prev) => ({
                                                ...prev,
                                                interviewDate:
                                                e.target.value
                                            })
                                        )
                                    }
                                />
                            </label>


                            <label>
                                Meeting link

                                <input
                                    type="url"
                                    value={
                                        interviewForm.meetingLink
                                    }
                                    onChange={(e) =>
                                        setInterviewForm(
                                            (prev) => ({
                                                ...prev,
                                                meetingLink:
                                                e.target.value
                                            })
                                        )
                                    }
                                    placeholder="https://meet.google.com/..."
                                />
                            </label>


                            <label>
                                Interview notes

                                <textarea
                                    rows="4"
                                    value={
                                        interviewForm.notes
                                    }
                                    onChange={(e) =>
                                        setInterviewForm(
                                            (prev) => ({
                                                ...prev,
                                                notes:
                                                e.target.value
                                            })
                                        )
                                    }
                                    placeholder="Interview instructions or additional information..."
                                />
                            </label>


                            <button
                                className="btn primary wide"
                                type="submit"
                                disabled={
                                    schedulingInterview
                                }
                            >
                                {schedulingInterview
                                    ? 'Scheduling...'
                                    : 'Schedule interview'}
                            </button>

                        </form>

                    </div>

                </div>

            )}

        </section>
    );
}
function AdminDashboard() {
    const [s, setS] = useState(null);

    useEffect(() => {
        api('/api/admin/stats')
            .then(setS)
            .catch(() => {});
    }, []);

    const stats = [
        ['Total Users', s?.users, '👥'],
        ['Candidates', s?.candidates, '👤'],
        ['Recruiters', s?.recruiters, '🏢'],
        ['Admins', s?.admins, '🛡️'],
        ['Total Jobs', s?.jobs, '💼'],
        ['Applications', s?.applications, '📄'],
        ['Applied', s?.applied, '📨'],
        ['Shortlisted', s?.shortlisted, '⭐'],
        ['Interviews', s?.interview, '🗓️'],
        ['Selected', s?.selected, '🎯'],
        ['Rejected', s?.rejected, '❌']
    ];

    return (
        <section className="section dashboard">

            <div className="eyebrow">ADMIN CONSOLE</div>

            <h1>Platform overview</h1>

            <p>
                Monitor users, jobs and applications across JobSphere.
            </p>

            <div className="stats admin-stats">
                {stats.map(([label, value, icon]) => (
                    <Stat
                        key={label}
                        label={label}
                        value={value ?? '—'}
                        icon={icon}
                    />
                ))}
            </div>

            <div className="admin-grid">

                <div className="panel">
                    <h2>Platform activity</h2>

                    <div className="admin-list">
                        <div>
                            <span>Job listings</span>
                            <strong>{s?.jobs ?? '—'}</strong>
                        </div>

                        <div>
                            <span>Total applications</span>
                            <strong>{s?.applications ?? '—'}</strong>
                        </div>

                        <div>
                            <span>Shortlisted candidates</span>
                            <strong>{s?.shortlisted ?? '—'}</strong>
                        </div>

                        <div>
                            <span>Selected candidates</span>
                            <strong>{s?.selected ?? '—'}</strong>
                        </div>
                    </div>
                </div>

                <div className="panel">
                    <h2>Application pipeline</h2>

                    <div className="admin-list">
                        <div>
                            <span>Applied</span>
                            <strong>{s?.applied ?? '—'}</strong>
                        </div>

                        <div>
                            <span>Shortlisted</span>
                            <strong>{s?.shortlisted ?? '—'}</strong>
                        </div>

                        <div>
                            <span>Interview</span>
                            <strong>{s?.interview ?? '—'}</strong>
                        </div>

                        <div>
                            <span>Rejected</span>
                            <strong>{s?.rejected ?? '—'}</strong>
                        </div>
                    </div>
                </div>

            </div>

            <div className="panel">
                <h2>System health</h2>

                <p className="muted">
                    Authentication, job management, applications,
                    recruiter services and admin APIs are connected
                    to the Spring Boot backend.
                </p>

                <div className="health">
                    <span className="health-dot"></span>
                    All core services connected
                </div>
            </div>

        </section>
    );
}
function Profile({ user, setUser, toast }) {
    const [form, setForm] = useState({
        name: '',
        phone: '',
        skills: ''
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [resumeFile, setResumeFile] = useState(null);
    const [uploadingResume, setUploadingResume] = useState(false);

    useEffect(() => {
        api('/api/profile')
            .then((data) => {
                setForm({
                    name: data.name || '',
                    phone: data.phone || '',
                    skills: data.skills || ''
                });
            })
            .catch((e) => {
                toast(e.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const updateField = (field, value) => {
        setForm((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const saveProfile = async (e) => {
        e.preventDefault();

        setSaving(true);

        try {
            const updated = await api('/api/profile', {
                method: 'PUT',
                body: JSON.stringify(form)
            });

            const updatedUser = {
                ...user,
                ...updated
            };

            setUser(updatedUser);
            saveUser(updatedUser);

            toast('Profile updated successfully.');
        } catch (e) {
            toast(e.message);
        } finally {
            setSaving(false);
        }
    };

    const uploadResume = async () => {
        if (!resumeFile) {
            toast('Please select a PDF resume.');
            return;
        }

        if (resumeFile.type !== 'application/pdf') {
            toast('Only PDF resumes are allowed.');
            return;
        }

        if (resumeFile.size > 5 * 1024 * 1024) {
            toast('Resume must be less than 5 MB.');
            return;
        }

        setUploadingResume(true);

        try {
            const formData = new FormData();

            formData.append('file', resumeFile);

            await api('/api/profile/resume', {
                method: 'POST',
                body: formData
            });

            toast('Resume uploaded successfully.');
            setResumeFile(null);

        } catch (e) {
            toast(e.message);
        } finally {
            setUploadingResume(false);
        }
    };

    const viewResume = async () => {
        try {
            const currentUser = loadUser();

            if (!currentUser?.token) {
                toast('Please login again.');
                return;
            }

            const response = await fetch(
                API + '/api/profile/resume',
                {
                    method: 'GET',
                    headers: {
                        Authorization:
                            `Bearer ${currentUser.token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error(
                    'Resume not found. Please upload your resume first.'
                );
            }

            const blob = await response.blob();

            const url = URL.createObjectURL(blob);

            window.open(url, '_blank');

            setTimeout(() => {
                URL.revokeObjectURL(url);
            }, 60000);

        } catch (e) {
            toast(e.message);
        }
    };

    if (loading) {
        return (
            <section className="section dashboard">
                <div className="loading">
                    Loading profile...
                </div>
            </section>
        );
    }

    return (
        <section className="section dashboard">

            <div className="dash-head">
                <div>
                    <div className="eyebrow">
                        MY PROFILE
                    </div>

                    <h1>Profile settings</h1>

                    <p>
                        Keep your JobSphere profile information
                        up to date.
                    </p>
                </div>

                <div className="profile-avatar">
                    {(form.name || user.name || 'U')
                        .charAt(0)
                        .toUpperCase()}
                </div>
            </div>

            <div className="profile-grid">

                {/* PERSONAL INFORMATION */}

                <div className="panel">

                    <div className="panel-head">
                        <h2>Personal information</h2>
                    </div>

                    <form onSubmit={saveProfile}>

                        <label>
                            Full name

                            <input
                                value={form.name}
                                onChange={(e) =>
                                    updateField(
                                        'name',
                                        e.target.value
                                    )
                                }
                                required
                            />
                        </label>

                        <label>
                            Email

                            <input
                                value={user.email || ''}
                                disabled
                            />

                            <span className="field-note">
                                Email cannot be changed.
                            </span>
                        </label>

                        <label>
                            Phone

                            <input
                                value={form.phone}
                                onChange={(e) =>
                                    updateField(
                                        'phone',
                                        e.target.value
                                    )
                                }
                                placeholder="Enter your phone number"
                            />
                        </label>

                        <label>
                            Skills

                            <textarea
                                value={form.skills}
                                onChange={(e) =>
                                    updateField(
                                        'skills',
                                        e.target.value
                                    )
                                }
                                placeholder="Java, Spring Boot, React, MySQL..."
                                rows="5"
                            />
                        </label>

                        <button
                            className="btn primary"
                            disabled={saving}
                        >
                            {saving
                                ? 'Saving...'
                                : 'Save changes'}
                        </button>

                    </form>

                </div>


                {/* RESUME - CANDIDATE ONLY */}

                {user.role === 'CANDIDATE' && (
                    <div className="panel">

                        <div className="panel-head">
                            <h2>Resume</h2>
                        </div>

                        <p className="muted">
                            Upload your latest resume in PDF
                            format. Maximum size: 5 MB.
                        </p>

                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={(e) =>
                                setResumeFile(
                                    e.target.files?.[0] || null
                                )
                            }
                        />

                        {resumeFile && (
                            <p className="muted">
                                Selected: {resumeFile.name}
                            </p>
                        )}

                        <button
                            type="button"
                            className="btn primary"
                            style={{
                                marginTop: '12px'
                            }}
                            disabled={uploadingResume}
                            onClick={uploadResume}
                        >
                            {uploadingResume
                                ? 'Uploading...'
                                : 'Upload Resume'}
                        </button>

                        <button
                            type="button"
                            className="btn outline"
                            style={{
                                marginTop: '12px',
                                marginLeft: '10px'
                            }}
                            onClick={viewResume}
                        >
                            View Resume
                        </button>

                    </div>
                )}


                {/* ACCOUNT */}

                <div className="panel profile-summary">

                    <div className="panel-head">
                        <h2>Account</h2>
                    </div>

                    <div className="profile-item">
                        <span>Account type</span>
                        <b>{user.role}</b>
                    </div>

                    <div className="profile-item">
                        <span>Email</span>
                        <b>{user.email}</b>
                    </div>

                    <div className="profile-item">
                        <span>Phone</span>
                        <b>
                            {form.phone || 'Not added'}
                        </b>
                    </div>

                    <div className="profile-item">
                        <span>Skills</span>
                        <b>
                            {form.skills || 'Not added'}
                        </b>
                    </div>

                </div>

            </div>

        </section>
    );
}
function Stat({ label, value, icon }) {
    return (
        <div className="stat">
            <div className="stat-icon">{icon}</div>

            <div>
                <strong>{value}</strong>
                <span>{label}</span>
            </div>
        </div>
    );
}

function Status({ status }) {
    return (
        <span
            className={cls(
                'badge',
                String(status).toLowerCase()
            )}
        >
      {String(status).replaceAll('_', ' ')}
    </span>
    );
}

createRoot(document.getElementById('root')).render(
    <App />
);