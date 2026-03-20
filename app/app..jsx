import { useState, useEffect, useCallback } from "react";
import {
  User, Briefcase, BookOpen, Calendar, ChevronRight,
  LogOut, Trash2, ArrowLeft, MapPin, Clock, School,
  UserCheck, Eye, EyeOff, CheckCircle, XCircle,
  AlertCircle, Plus, Star, Phone, Mail, FileText
} from "lucide-react-native";


const db = {
  async get(key) {
    try {
      const r = await window.storage.get(key, true);
      return r ? JSON.parse(r.value) : null;
    } catch { return null; }
  },
  async set(key, value) {
    try {
      await window.storage.set(key, JSON.stringify(value), true);
      return true;
    } catch { return false; }
  },
};

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

//shared ui comp.
const Btn = ({ children, onClick, variant = "primary", className = "", disabled = false }) => {
  const base = "px-4 py-2.5 rounded-lg font-semibold text-sm transition-all active:scale-95 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200",
    success: "bg-emerald-600 text-white hover:bg-emerald-700",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "text-blue-600 hover:bg-blue-50",
    outline: "border border-blue-600 text-blue-600 hover:bg-blue-50",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${className}`}
    >
      {children}
    </button>
  );
};

const Input = ({ label, type = "text", value, onChange, placeholder, required, multiline, rows = 3, rightEl }) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium text-slate-700 mb-1">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>}
    <div className="relative">
      {multiline
        ? <textarea rows={rows} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" />
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10" />
      }
      {rightEl && <div className="absolute right-3 top-2.5">{rightEl}</div>}
    </div>
  </div>
);

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}>{children}</div>
);

const Badge = ({ children, color = "blue" }) => {
  const colors = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-emerald-100 text-emerald-700",
    yellow: "bg-amber-100 text-amber-700",
    red: "bg-red-100 text-red-700",
    gray: "bg-slate-100 text-slate-600",
    indigo: "bg-indigo-100 text-indigo-700",
  };
  return <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${colors[color] || colors.blue}`}>{children}</span>;
};

const StatCard = ({ title, value, color }) => {
  const colors = { green: "#10b981", indigo: "#4f46e5", yellow: "#f59e0b", pink: "#ec4899" };
  const c = colors[color] || "#9ca3af";
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between" style={{ borderBottomWidth: 3, borderBottomColor: c }}>
      <div>
        <p className="text-xs text-slate-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-slate-800 mt-0.5">{value}</p>
      </div>
      <span className="text-2xl" style={{ color: c }}>★</span>
    </div>
  );
};

const Alert = ({ type = "warning", title, message }) => {
  const cfg = {
    warning: { bg: "bg-amber-50 border-amber-200", icon: <AlertCircle size={18} className="text-amber-600" />, titleC: "text-amber-800", msgC: "text-amber-700" },
    success: { bg: "bg-emerald-50 border-emerald-200", icon: <CheckCircle size={18} className="text-emerald-600" />, titleC: "text-emerald-800", msgC: "text-emerald-700" },
    error: { bg: "bg-red-50 border-red-200", icon: <XCircle size={18} className="text-red-600" />, titleC: "text-red-800", msgC: "text-red-700" },
  };
  const c = cfg[type];
  return (
    <div className={`${c.bg} border rounded-lg p-3 flex gap-2.5 mb-4`}>
      <div className="mt-0.5">{c.icon}</div>
      <div>
        {title && <p className={`text-sm font-semibold ${c.titleC}`}>{title}</p>}
        {message && <p className={`text-xs mt-0.5 ${c.msgC}`}>{message}</p>}
      </div>
    </div>
  );
};

const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, []);
  const cfg = {
    success: "bg-emerald-600",
    error: "bg-red-600",
    info: "bg-blue-600",
  };
  return (
    <div className={`fixed bottom-6 right-6 ${cfg[type]} text-white px-5 py-3 rounded-xl shadow-xl text-sm font-medium z-50 flex items-center gap-2`}>
      {type === "success" && <CheckCircle size={16} />}
      {type === "error" && <XCircle size={16} />}
      {message}
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-12">
    <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
  </div>
);

//side nav
const SideMenu = ({ visible, onClose, currentUser, setCurrentPage, onLogout, onDeleteAccount }) => {
  const isTeacher = currentUser?.role === "teacher";

  const teacherNav = [
    { label: "Applications", page: "TeacherDashboard", icon: <Briefcase size={20} /> },
    { label: "Interviews", page: "Interviews", icon: <Calendar size={20} /> },
    { label: "Saved Schools", page: "SavedSchools", icon: <BookOpen size={20} /> },
  ];
  const schoolNav = [
    { label: "Dashboard", page: "SchoolDashboard", icon: <Briefcase size={20} /> },
    { label: "Interviews", page: "Interviews", icon: <Calendar size={20} /> },
    { label: "Teachers", page: "SavedTeachers", icon: <BookOpen size={20} /> },
    { label: "Waitlist", page: "Waitlist", icon: <UserCheck size={20} /> },
    { label: "Vacancies", page: "UploadVacancy", icon: <Plus size={20} /> },
  ];
  const navItems = isTeacher ? teacherNav : schoolNav;

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative ml-auto w-72 max-w-full bg-white h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 p-5 border-b border-slate-100">
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <ArrowLeft size={20} className="text-blue-800" />
          </button>
          <span className="font-bold text-blue-900 text-lg">TeacherHub</span>
        </div>

        {/* Profile */}
        <div className="p-5 border-b border-slate-100 text-center">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
            {isTeacher ? <User size={40} className="text-blue-600" /> : <School size={40} className="text-blue-600" />}
          </div>
          <p className="font-bold text-slate-800">{currentUser?.name}</p>
          <p className="text-sm text-slate-500">{currentUser?.email}</p>
          <Badge color={isTeacher ? "blue" : "indigo"} className="mt-1">{isTeacher ? "Teacher" : "School"}</Badge>
        </div>

        {/* Nav items */}
        <div className="flex-1 overflow-y-auto p-3">
          {navItems.map(item => (
            <button key={item.page}
              onClick={() => { setCurrentPage(item.page); onClose(); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 text-slate-700 hover:text-blue-700 transition-colors mb-1">
              <span className="text-blue-600">{item.icon}</span>
              <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
              <ChevronRight size={16} className="text-slate-400" />
            </button>
          ))}

          <div className="my-3 border-t border-slate-100" />

          <button onClick={() => { setCurrentPage(isTeacher ? "TeacherSettings" : "SchoolSettings"); onClose(); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 text-slate-700 hover:text-blue-700 transition-colors mb-1">
            <User size={20} className="text-blue-600" />
            <span className="text-sm font-medium flex-1 text-left">Edit Profile</span>
            <ChevronRight size={16} className="text-slate-400" />
          </button>

          <button onClick={onDeleteAccount}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 transition-colors mb-1">
            <Trash2 size={20} />
            <span className="text-sm font-medium flex-1 text-left">Delete Account</span>
            <ChevronRight size={16} className="text-red-400" />
          </button>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-slate-100">
          <button onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl font-semibold text-sm transition-colors">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

//header
const AppHeader = ({ currentUser, onOpenMenu }) => (
  <div className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm">
    <span className="font-extrabold text-blue-800 text-xl tracking-tight">TeacherHub</span>
    {currentUser && (
      <button onClick={onOpenMenu} className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-200 transition-colors">
        <User size={20} className="text-blue-700" />
      </button>
    )}
  </div>
);

//auth for landing, login, register
const LandingPage = ({ setPage }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex flex-col items-center justify-center p-6">
    <div className="text-center mb-12">
      <h1 className="text-5xl font-black text-white tracking-tight mb-3">TeacherHub</h1>
      <p className="text-blue-200 text-lg">Connecting great teachers with great schools</p>
    </div>
    <div className="grid grid-cols-1 gap-4 w-full max-w-sm">
      <button onClick={() => setPage("login")}
        className="bg-white text-blue-800 py-4 rounded-2xl font-bold text-base shadow-xl hover:shadow-2xl transition-all hover:-translate-y-0.5 active:scale-98">
        Sign In
      </button>
      <p className="text-center text-blue-300 text-sm">— or create an account —</p>
      <button onClick={() => setPage("register-teacher")}
        className="bg-blue-600/80 backdrop-blur border border-blue-400/50 text-white py-4 rounded-2xl font-bold text-base hover:bg-blue-600 transition-all flex items-center justify-center gap-3">
        <User size={20} /> Join as Teacher
      </button>
      <button onClick={() => setPage("register-school")}
        className="bg-indigo-600/80 backdrop-blur border border-indigo-400/50 text-white py-4 rounded-2xl font-bold text-base hover:bg-indigo-600 transition-all flex items-center justify-center gap-3">
        <School size={20} /> Join as School
      </button>
    </div>
  </div>
);

const LoginPage = ({ setPage, onLogin, setToast }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true); setError("");
    const accounts = await db.get("th_accounts") || [];
    const user = accounts.find(a => a.email.toLowerCase() === email.toLowerCase() && a.password === password);
    if (!user) { setError("Invalid email or password."); setLoading(false); return; }
    setLoading(false);
    setToast({ message: `Welcome back, ${user.name}!`, type: "success" });
    onLogin(user);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button onClick={() => setPage("landing")} className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 mb-6 transition-colors">
          <ArrowLeft size={16} /> Back
        </button>
        <Card className="p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-1">Welcome back</h2>
          <p className="text-slate-500 text-sm mb-6">Sign in to your TeacherHub account</p>
          {error && <Alert type="error" message={error} />}
          <Input label="Email Address" type="email" value={email} onChange={setEmail} placeholder="you@example.com" required />
          <Input label="Password" type={showPw ? "text" : "password"} value={password} onChange={setPassword} placeholder="••••••••"
            rightEl={<button onClick={() => setShowPw(!showPw)} className="text-slate-400 hover:text-slate-600">{showPw ? <EyeOff size={16} /> : <Eye size={16} />}</button>} />
          <Btn onClick={handleLogin} disabled={loading} className="w-full mt-2">
            {loading ? "Signing in…" : "Sign In"}
          </Btn>
          <p className="text-center text-sm text-slate-500 mt-5">
            Don't have an account?{" "}
            <button onClick={() => setPage("register-teacher")} className="text-blue-600 font-semibold hover:underline">Register</button>
          </p>
        </Card>
      </div>
    </div>
  );
};

const RegisterPage = ({ role, setPage, onLogin, setToast }) => {
  const isTeacher = role === "teacher";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPw) { setError("Please fill in all fields."); return; }
    if (password !== confirmPw) { setError("Passwords do not match."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true); setError("");

    const accounts = await db.get("th_accounts") || [];
    if (accounts.find(a => a.email.toLowerCase() === email.toLowerCase())) {
      setError("An account with this email already exists."); setLoading(false); return;
    }

    const newUser = { id: genId(), email, password, role, name, createdAt: new Date().toISOString() };
    accounts.push(newUser);
    await db.set("th_accounts", accounts);

    // empty profile
    if (isTeacher) {
      const profiles = await db.get("th_teacherProfiles") || [];
      profiles.push({ userId: newUser.id, name, email, subject: "", experience: "", education: "", availability: "", location: "", bio: "", certifications: [], phone: "", visible: true, offerTutoring: false });
      await db.set("th_teacherProfiles", profiles);
    } else {
      const profiles = await db.get("th_schoolProfiles") || [];
      profiles.push({ userId: newUser.id, name, email, phone: "", bio: "", location: "", hireCondition: "", salaryMin: "", registrationNumber: "", visible: true, offerTraining: false });
      await db.set("th_schoolProfiles", profiles);
    }

    setLoading(false);
    setToast({ message: `Account created! Welcome, ${name}!`, type: "success" });
    onLogin(newUser);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button onClick={() => setPage("landing")} className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 mb-6 transition-colors">
          <ArrowLeft size={16} /> Back
        </button>
        <Card className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isTeacher ? "bg-blue-100" : "bg-indigo-100"}`}>
              {isTeacher ? <User size={20} className="text-blue-600" /> : <School size={20} className="text-indigo-600" />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Create {isTeacher ? "Teacher" : "School"} Account</h2>
              <p className="text-slate-500 text-xs">Fill in your details to get started</p>
            </div>
          </div>
          {error && <Alert type="error" message={error} />}
          <Input label={isTeacher ? "Full Name" : "School Name"} value={name} onChange={setName} placeholder={isTeacher ? "e.g., Miss Jane Doe" : "e.g., Echosys Academy"} required />
          <Input label="Email Address" type="email" value={email} onChange={setEmail} placeholder={isTeacher ? "jane.doe@email.com" : "school@edu.cm"} required />
          <Input label="Password" type={showPw ? "text" : "password"} value={password} onChange={setPassword} placeholder="Min. 6 characters"
            rightEl={<button onClick={() => setShowPw(!showPw)} className="text-slate-400 hover:text-slate-600">{showPw ? <EyeOff size={16} /> : <Eye size={16} />}</button>} />
          <Input label="Confirm Password" type={showPw ? "text" : "password"} value={confirmPw} onChange={setConfirmPw} placeholder="Re-enter password" />
          <Btn onClick={handleRegister} disabled={loading} className="w-full mt-2">
            {loading ? "Creating account…" : "Create Account"}
          </Btn>
          <div className="flex items-center justify-center gap-3 mt-4 text-sm text-slate-500">
            <button onClick={() => setPage("register-teacher")} className={`hover:underline ${!isTeacher ? "text-blue-600 font-semibold" : ""}`}>Teacher</button>
            <span>·</span>
            <button onClick={() => setPage("register-school")} className={`hover:underline ${isTeacher ? "" : "text-indigo-600 font-semibold"}`}>School</button>
          </div>
          <p className="text-center text-sm text-slate-500 mt-2">
            Already have an account?{" "}
            <button onClick={() => setPage("login")} className="text-blue-600 font-semibold hover:underline">Sign In</button>
          </p>
        </Card>
      </div>
    </div>
  );
};

//teacher scrn
const TeacherHome = ({ currentUser, setCurrentPage, setSelectedJobId, setToast }) => {
  const [jobs, setJobs] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    db.get("th_jobListings").then(d => setJobs(d || []));
  }, []);

  const handleApply = async (job) => {
    const apps = await db.get("th_applications") || [];
    const exists = apps.find(a => a.teacherId === currentUser.id && a.jobId === job.id);
    if (exists) { setToast({ message: "You already applied for this job.", type: "info" }); return; }
    const newApp = {
      id: genId(), teacherId: currentUser.id, teacherName: currentUser.name,
      jobId: job.id, schoolId: job.schoolId, schoolName: job.schoolName,
      jobTitle: job.title, status: "Pending", date: new Date().toISOString(),
    };
    apps.push(newApp);
    await db.set("th_applications", apps);
    setToast({ message: "Application submitted successfully!", type: "success" });
  };

  const filtered = (jobs || []).filter(j =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.schoolName.toLowerCase().includes(search.toLowerCase()) ||
    (j.location || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Find Your Next Role</h1>
        <p className="text-slate-500 text-sm mt-1">Browse open positions from top schools</p>
      </div>

      <div className="mb-5">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search jobs, schools, location…"
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" />
      </div>

      <div className="flex gap-3 mb-6">
        <Btn onClick={() => {}} className="flex-1">Find Jobs</Btn>
        <Btn onClick={() => setCurrentPage("TeacherDashboard")} variant="secondary" className="flex-1">Dashboard</Btn>
      </div>

      {jobs === null ? <LoadingSpinner /> : filtered.length === 0 ? (
        <Card className="p-10 text-center">
          <Briefcase size={40} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No job listings yet</p>
          <p className="text-slate-400 text-sm mt-1">Schools will post vacancies here</p>
        </Card>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-slate-500 font-medium">Featured Job Listings — {filtered.length} found</p>
          {filtered.map(job => (
            <Card key={job.id} className="p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Briefcase size={18} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-800 text-base">{job.title}</h3>
                  <p className="text-sm text-slate-500">{job.schoolName}</p>
                </div>
              </div>
              <div className="space-y-1.5 mb-3">
                {job.location && <div className="flex items-center gap-2 text-sm text-slate-600"><MapPin size={13} />{job.location}</div>}
                {job.employmentType && <div className="flex items-center gap-2 text-sm text-slate-600"><Clock size={13} />{job.employmentType}</div>}
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {job.requirements && <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">{job.requirements}</span>}
                {job.startDate && <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">Start: {job.startDate}</span>}
                {job.deadline && <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">Deadline: {job.deadline}</span>}
              </div>
              {(job.salaryMin || job.salaryMax) && (
                <p className="text-emerald-700 font-bold text-sm mb-4">
                  XAF {job.salaryMin || "?"} – {job.salaryMax || "?"}/month
                </p>
              )}
              <div className="flex gap-2">
                <Btn onClick={() => { setSelectedJobId(job.id); setCurrentPage("JobDetails"); }} variant="outline" className="flex-1">View Details</Btn>
                <Btn onClick={() => handleApply(job)} variant="success" className="flex-1">Apply Now</Btn>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const TeacherDashboard = ({ currentUser, setCurrentPage, setToast }) => {
  const [apps, setApps] = useState(null);

  useEffect(() => {
    db.get("th_applications").then(all => {
      setApps((all || []).filter(a => a.teacherId === currentUser.id).sort((a, b) => new Date(b.date) - new Date(a.date)));
    });
  }, []);

  const statusColor = s => s === "Scheduled" || s === "Interview" ? "yellow" : s === "Pending" ? "blue" : s === "Accepted" ? "green" : "red";
  const timeAgo = d => { const diff = Date.now() - new Date(d); const days = Math.floor(diff / 86400000); return days === 0 ? "Today" : days === 1 ? "Yesterday" : `${days} days ago`; };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Welcome, {currentUser.name.split(" ")[0]}</h1>
        <p className="text-slate-500 text-sm">Manage your applications and profile</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <StatCard title="Total Applications" value={apps ? apps.length.toString() : "—"} color="indigo" />
        <StatCard title="Pending" value={apps ? apps.filter(a => a.status === "Pending").length.toString() : "—"} color="yellow" />
      </div>

      <Alert type="warning" title="Keep your profile updated" message="Schools browse teacher profiles. Make sure your qualifications are current." />

      <div className="flex gap-2 mb-5">
        <Btn onClick={() => setCurrentPage("TeacherSettings")} className="flex-1">Edit Profile</Btn>
        <Btn onClick={() => setCurrentPage("TeacherHome")} variant="secondary" className="flex-1">Browse Jobs</Btn>
      </div>

      <Card>
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-800">My Applications</h2>
        </div>
        {apps === null ? <LoadingSpinner /> : apps.length === 0 ? (
          <div className="p-8 text-center">
            <FileText size={36} className="text-slate-300 mx-auto mb-2" />
            <p className="text-slate-500 text-sm">No applications yet. Browse jobs to apply!</p>
          </div>
        ) : (
          <div>
            {apps.map(app => (
              <div key={app.id} className="flex items-center gap-3 px-5 py-4 border-b border-slate-50 last:border-0">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Briefcase size={14} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{app.jobTitle}</p>
                  <p className="text-xs text-slate-500 truncate">{app.schoolName}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <Badge color={statusColor(app.status)}>{app.status}</Badge>
                  <p className="text-xs text-slate-400 mt-1">{timeAgo(app.date)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

const JobDetailsPage = ({ currentUser, jobId, setCurrentPage, setToast }) => {
  const [job, setJob] = useState(null);

  useEffect(() => {
    db.get("th_jobListings").then(jobs => {
      const found = (jobs || []).find(j => j.id === jobId);
      setJob(found || null);
    });
  }, [jobId]);

  const handleApply = async () => {
    if (!job) return;
    const apps = await db.get("th_applications") || [];
    const exists = apps.find(a => a.teacherId === currentUser.id && a.jobId === job.id);
    if (exists) { setToast({ message: "Already applied for this job.", type: "info" }); return; }
    apps.push({ id: genId(), teacherId: currentUser.id, teacherName: currentUser.name, jobId: job.id, schoolId: job.schoolId, schoolName: job.schoolName, jobTitle: job.title, status: "Pending", date: new Date().toISOString() });
    await db.set("th_applications", apps);
    setToast({ message: "Application submitted!", type: "success" });
    setCurrentPage("TeacherDashboard");
  };

  if (!job && job !== null) return <LoadingSpinner />;
  if (job === null && jobId) return null;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <button onClick={() => setCurrentPage("TeacherHome")} className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 mb-5 transition-colors">
        <ArrowLeft size={16} /> Back to Jobs
      </button>
      {!job ? <Card className="p-8 text-center"><p className="text-slate-500">Job not found.</p></Card> : (
        <>
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">
              <Briefcase size={28} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">{job.title}</h1>
              <p className="text-slate-500">{job.schoolName}</p>
            </div>
          </div>
          <Card className="p-5 mb-4">
            {[["Location", job.location], ["Employment Type", job.employmentType], ["Start Date", job.startDate], ["Salary", job.salaryMin && job.salaryMax ? `XAF ${job.salaryMin} – ${job.salaryMax}/month` : ""], ["Application Deadline", job.deadline], ["Requirements", job.requirements]].filter(([,v]) => v).map(([l, v]) => (
              <div key={l} className="flex gap-3 py-2 border-b border-slate-50 last:border-0">
                <span className="text-sm font-semibold text-slate-600 w-36 flex-shrink-0">{l}:</span>
                <span className="text-sm text-slate-800">{v}</span>
              </div>
            ))}
          </Card>
          {(job.description || job.responsibilities) && (
            <Card className="p-5 mb-4">
              {job.description && <><h3 className="font-bold text-slate-800 mb-2">About This Position</h3><p className="text-sm text-slate-600 mb-4">{job.description}</p></>}
              {job.responsibilities && <><h3 className="font-bold text-slate-800 mb-2">Key Responsibilities</h3><p className="text-sm text-slate-600 whitespace-pre-line">{job.responsibilities}</p></>}
            </Card>
          )}
          <div className="flex gap-3">
            <Btn onClick={() => setCurrentPage("TeacherHome")} variant="secondary" className="flex-1">Back to Jobs</Btn>
            <Btn onClick={handleApply} variant="success" className="flex-1">Apply Now</Btn>
          </div>
        </>
      )}
    </div>
  );
};

const TeacherSettings = ({ currentUser, setCurrentPage, setToast }) => {
  const [tab, setTab] = useState("profile");
  const [profile, setProfile] = useState(null);
  const [newCert, setNewCert] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    db.get("th_teacherProfiles").then(profiles => {
      const p = (profiles || []).find(p => p.userId === currentUser.id);
      setProfile(p || { userId: currentUser.id, name: currentUser.name, email: currentUser.email, subject: "", experience: "", education: "", availability: "", location: "", bio: "", certifications: [], phone: "", visible: true, offerTutoring: false });
    });
  }, []);

  const update = (field, value) => setProfile(prev => ({ ...prev, [field]: value }));

  const save = async () => {
    setSaving(true);
    const profiles = await db.get("th_teacherProfiles") || [];
    const idx = profiles.findIndex(p => p.userId === currentUser.id);
    if (idx >= 0) profiles[idx] = profile; else profiles.push(profile);
    await db.set("th_teacherProfiles", profiles);
    setSaving(false);
    setToast({ message: "Profile saved successfully!", type: "success" });
  };

  const addCert = () => {
    if (!newCert.trim()) return;
    update("certifications", [...(profile.certifications || []), newCert.trim()]);
    setNewCert("");
  };

  const removeCert = (i) => update("certifications", profile.certifications.filter((_, idx) => idx !== i));

  const tabs = [
    { id: "profile", label: "Basic Profile" },
    { id: "qualifications", label: "Qualifications" },
    { id: "visibility", label: "Visibility" },
  ];

  if (!profile) return <LoadingSpinner />;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Teacher Profile Settings</h1>
        <p className="text-slate-500 text-sm">Update your details and qualifications</p>
      </div>
      <Card>
        <div className="flex border-b border-slate-200">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 py-3 text-xs font-semibold transition-colors ${tab === t.id ? "border-b-2 border-blue-600 text-blue-600" : "text-slate-500 hover:text-slate-700"}`}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="p-5">
          {tab === "profile" && (
            <>
              <Input label="Full Name" value={profile.name} onChange={v => update("name", v)} placeholder="Your full name" required />
              <Input label="Job Title / Specialty" value={profile.subject} onChange={v => update("subject", v)} placeholder="e.g., Mathematics Teacher" />
              <Input label="Email Address" value={profile.email} onChange={v => update("email", v)} placeholder="your@email.com" />
              <Input label="Phone Number" value={profile.phone} onChange={v => update("phone", v)} placeholder="+237 600 000 000" />
              <Input label="Location" value={profile.location} onChange={v => update("location", v)} placeholder="City, Region" />
              <Input label="Availability" value={profile.availability} onChange={v => update("availability", v)} placeholder="Full-time, Part-time, Contract" />
              <Input label="Professional Summary / Bio" value={profile.bio} onChange={v => update("bio", v)} placeholder="Brief summary of your teaching experience…" multiline rows={4} />
            </>
          )}
          {tab === "qualifications" && (
            <>
              <Input label="Education / Degree" value={profile.education} onChange={v => update("education", v)} placeholder="e.g., M.Ed in Mathematics Education" />
              <Input label="Years of Experience" value={profile.experience} onChange={v => update("experience", v)} placeholder="e.g., 8 years" />
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">Certifications & Licenses</label>
                <div className="flex gap-2 mb-2">
                  <input value={newCert} onChange={e => setNewCert(e.target.value)} onKeyDown={e => e.key === "Enter" && addCert()} placeholder="Add a certification…"
                    className="flex-1 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <Btn onClick={addCert} variant="outline"><Plus size={16} /></Btn>
                </div>
                {(profile.certifications || []).length === 0 ? (
                  <p className="text-xs text-slate-400 py-2">No certifications added yet.</p>
                ) : (
                  <div className="space-y-2">
                    {profile.certifications.map((c, i) => (
                      <div key={i} className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
                        <span className="text-sm text-slate-700 flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" />{c}</span>
                        <button onClick={() => removeCert(i)} className="text-red-400 hover:text-red-600"><XCircle size={15} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
          {tab === "visibility" && (
            <>
              <div className="border border-slate-200 rounded-xl p-4 flex items-start gap-4 mb-3">
                <div className="flex-1">
                  <p className="font-semibold text-slate-800 text-sm">Visible to Schools</p>
                  <p className="text-xs text-slate-500 mt-0.5">Allow schools to find and view your profile</p>
                </div>
                <button onClick={() => update("visible", !profile.visible)}
                  className={`w-11 h-6 rounded-full transition-colors flex-shrink-0 ${profile.visible ? "bg-blue-600" : "bg-slate-300"}`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${profile.visible ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>
              <div className="border border-slate-200 rounded-xl p-4 flex items-start gap-4 mb-4">
                <div className="flex-1">
                  <p className="font-semibold text-slate-800 text-sm">Offer Private Tutoring / Consulting</p>
                  <p className="text-xs text-slate-500 mt-0.5">Appear on the Services Marketplace</p>
                </div>
                <button onClick={() => update("offerTutoring", !profile.offerTutoring)}
                  className={`w-11 h-6 rounded-full transition-colors flex-shrink-0 ${profile.offerTutoring ? "bg-blue-600" : "bg-slate-300"}`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${profile.offerTutoring ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>
            </>
          )}
          <Btn onClick={save} disabled={saving} className="w-full mt-2">
            {saving ? "Saving…" : "Save Changes"}
          </Btn>
        </div>
      </Card>
    </div>
  );
};

//school scrn
const SchoolHome = ({ currentUser, setCurrentPage, setSelectedTeacherId, setToast }) => {
  const [teachers, setTeachers] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    db.get("th_teacherProfiles").then(d => setTeachers((d || []).filter(t => t.visible !== false)));
  }, []);

  const filtered = (teachers || []).filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    (t.subject || "").toLowerCase().includes(search.toLowerCase()) ||
    (t.location || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Welcome to TeacherHub</h1>
        <p className="text-slate-500 text-sm">Find and hire top teaching talent</p>
      </div>

      <div className="mb-4">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search teachers by name, subject, location…"
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" />
      </div>

      <div className="flex gap-2 mb-6">
        <Btn onClick={() => setCurrentPage("UploadVacancy")} className="flex-1"><Plus size={16} /> Post Vacancy</Btn>
        <Btn onClick={() => setCurrentPage("SchoolDashboard")} variant="secondary" className="flex-1">Dashboard</Btn>
      </div>

      {teachers === null ? <LoadingSpinner /> : filtered.length === 0 ? (
        <Card className="p-10 text-center">
          <User size={40} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No teacher profiles yet</p>
          <p className="text-slate-400 text-sm mt-1">Teachers will appear here once they register and set up their profiles</p>
        </Card>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-slate-500 font-medium">Teacher Listings — {filtered.length} found</p>
          {filtered.map(t => (
            <Card key={t.userId} className="p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-700 font-bold text-lg">
                  {t.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-800">{t.name}</h3>
                  <p className="text-sm text-slate-500">{t.subject || "Subject not specified"}</p>
                </div>
              </div>
              <div className="space-y-1.5 mb-3">
                {t.location && <div className="flex items-center gap-2 text-sm text-slate-600"><MapPin size={13} />{t.location}</div>}
                {t.availability && <div className="flex items-center gap-2 text-sm text-slate-600"><Clock size={13} />{t.availability}</div>}
                {t.experience && <div className="flex items-center gap-2 text-sm text-slate-600"><Star size={13} />{t.experience} experience</div>}
              </div>
              {t.bio && <p className="text-sm text-slate-600 mb-3 line-clamp-2">{t.bio}</p>}
              <div className="flex gap-2">
                <Btn onClick={() => { setSelectedTeacherId(t.userId); setCurrentPage("TeacherDetails"); }} variant="outline" className="flex-1">View Profile</Btn>
                <Btn onClick={() => setToast({ message: `${t.name} added to waitlist!`, type: "success" })} variant="success" className="flex-1">Waitlist</Btn>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const SchoolDashboard = ({ currentUser, setCurrentPage, setToast }) => {
  const [myJobs, setMyJobs] = useState(null);
  const [apps, setApps] = useState(null);

  useEffect(() => {
    Promise.all([db.get("th_jobListings"), db.get("th_applications")]).then(([jobs, applications]) => {
      const mine = (jobs || []).filter(j => j.schoolId === currentUser.id);
      const myJobIds = mine.map(j => j.id);
      const relevantApps = (applications || []).filter(a => myJobIds.includes(a.jobId)).sort((a, b) => new Date(b.date) - new Date(a.date));
      setMyJobs(mine);
      setApps(relevantApps);
    });
  }, []);

  const updateAppStatus = async (appId, status) => {
    const all = await db.get("th_applications") || [];
    const idx = all.findIndex(a => a.id === appId);
    if (idx >= 0) { all[idx].status = status; await db.set("th_applications", all); setToast({ message: `Application marked as ${status}`, type: "success" }); setApps(prev => prev.map(a => a.id === appId ? { ...a, status } : a)); }
  };

  const timeAgo = d => { const diff = Date.now() - new Date(d); const days = Math.floor(diff / 86400000); return days === 0 ? "Today" : days === 1 ? "Yesterday" : `${days} days ago`; };
  const statusColor = s => s === "Scheduled" || s === "Interview" ? "yellow" : s === "Pending" ? "blue" : s === "Accepted" ? "green" : "red";

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">School Dashboard</h1>
        <p className="text-slate-500 text-sm">{currentUser.name}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <StatCard title="Active Vacancies" value={myJobs ? myJobs.length.toString() : "—"} color="indigo" />
        <StatCard title="Applications" value={apps ? apps.length.toString() : "—"} color="yellow" />
      </div>

      <Alert type="warning" title="Keep your profile visible" message="Update your school profile to attract top teacher talent." />

      <div className="flex gap-2 mb-5">
        <Btn onClick={() => setCurrentPage("SchoolSettings")} className="flex-1">Edit Profile</Btn>
        <Btn onClick={() => setCurrentPage("UploadVacancy")} variant="secondary" className="flex-1"><Plus size={16} /> Post Job</Btn>
      </div>

      {myJobs !== null && myJobs.length > 0 && (
        <Card className="mb-4">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-800">My Vacancies</h2>
            <Btn onClick={() => setCurrentPage("UploadVacancy")} variant="ghost" className="text-xs py-1 px-2"><Plus size={13} /> Add</Btn>
          </div>
          {myJobs.map(job => (
            <div key={job.id} className="flex items-center gap-3 px-5 py-3 border-b border-slate-50 last:border-0">
              <Briefcase size={16} className="text-blue-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{job.title}</p>
                <p className="text-xs text-slate-400">{job.employmentType} · {job.location}</p>
              </div>
            </div>
          ))}
        </Card>
      )}

      <Card>
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-800">Incoming Applications</h2>
        </div>
        {apps === null ? <LoadingSpinner /> : apps.length === 0 ? (
          <div className="p-8 text-center">
            <FileText size={36} className="text-slate-300 mx-auto mb-2" />
            <p className="text-slate-500 text-sm">No applications yet. Post a vacancy to start receiving applications.</p>
          </div>
        ) : (
          apps.map(app => (
            <div key={app.id} className="px-5 py-4 border-b border-slate-50 last:border-0">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">
                  {app.teacherName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800">{app.teacherName}</p>
                  <p className="text-xs text-slate-500">→ {app.jobTitle}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{timeAgo(app.date)}</p>
                </div>
                <Badge color={statusColor(app.status)}>{app.status}</Badge>
              </div>
              {app.status === "Pending" && (
                <div className="flex gap-2 mt-3 ml-11">
                  <Btn onClick={() => updateAppStatus(app.id, "Interview")} variant="outline" className="text-xs py-1.5 flex-1">Schedule Interview</Btn>
                  <Btn onClick={() => updateAppStatus(app.id, "Accepted")} variant="success" className="text-xs py-1.5 flex-1">Accept</Btn>
                  <Btn onClick={() => updateAppStatus(app.id, "Rejected")} variant="danger" className="text-xs py-1.5 px-3">✕</Btn>
                </div>
              )}
            </div>
          ))
        )}
      </Card>
    </div>
  );
};

const UploadVacancy = ({ currentUser, setCurrentPage, setToast }) => {
  const [form, setForm] = useState({ title: "", subject: "", employmentType: "", location: "", salaryMin: "", salaryMax: "", requirements: "", responsibilities: "", startDate: "", deadline: "", description: "" });
  const [saving, setSaving] = useState(false);
  const upd = (f, v) => setForm(prev => ({ ...prev, [f]: v }));

  const handleSubmit = async () => {
    if (!form.title || !form.subject) { setToast({ message: "Position title and subject are required.", type: "error" }); return; }
    setSaving(true);

    //school name from profile
    const schoolProfiles = await db.get("th_schoolProfiles") || [];
    const schoolProfile = schoolProfiles.find(p => p.userId === currentUser.id);
    const schoolName = schoolProfile?.name || currentUser.name;

    const jobs = await db.get("th_jobListings") || [];
    jobs.push({ id: genId(), schoolId: currentUser.id, schoolName, ...form, createdAt: new Date().toISOString() });
    await db.set("th_jobListings", jobs);
    setSaving(false);
    setToast({ message: "Vacancy posted successfully!", type: "success" });
    setCurrentPage("SchoolDashboard");
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Post a Vacancy</h1>
        <p className="text-slate-500 text-sm">Fill in the details to attract qualified teachers</p>
      </div>
      <Card className="p-5">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 border-l-4 border-blue-600 pl-3">Position Details</p>
        <Input label="Position Title" value={form.title} onChange={v => upd("title", v)} placeholder="e.g., High School Math Teacher" required />
        <Input label="Subject / Department" value={form.subject} onChange={v => upd("subject", v)} placeholder="e.g., Mathematics, Science" required />
        <Input label="Employment Type" value={form.employmentType} onChange={v => upd("employmentType", v)} placeholder="Full-time, Part-time, or Contract" />
        <Input label="Location" value={form.location} onChange={v => upd("location", v)} placeholder="City, Region, Country" />
        <Input label="Start Date" value={form.startDate} onChange={v => upd("startDate", v)} placeholder="e.g., September 2026" />

        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 mt-2 border-l-4 border-emerald-500 pl-3">Compensation</p>
        <Input label="Minimum Salary (XAF)" type="number" value={form.salaryMin} onChange={v => upd("salaryMin", v)} placeholder="e.g., 150000" />
        <Input label="Maximum Salary (XAF)" type="number" value={form.salaryMax} onChange={v => upd("salaryMax", v)} placeholder="e.g., 300000" />

        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 mt-2 border-l-4 border-indigo-500 pl-3">Job Description</p>
        <Input label="About this Position" value={form.description} onChange={v => upd("description", v)} placeholder="Describe what this role involves…" multiline rows={3} />
        <Input label="Requirements" value={form.requirements} onChange={v => upd("requirements", v)} placeholder="Required qualifications, certifications, experience…" multiline rows={3} />
        <Input label="Key Responsibilities" value={form.responsibilities} onChange={v => upd("responsibilities", v)} placeholder="Main duties and responsibilities…" multiline rows={3} />
        <Input label="Application Deadline" value={form.deadline} onChange={v => upd("deadline", v)} placeholder="DD/MM/YYYY" />

        <div className="flex gap-3 mt-2">
          <Btn onClick={handleSubmit} disabled={saving} className="flex-1">{saving ? "Posting…" : "Post Vacancy"}</Btn>
          <Btn onClick={() => setCurrentPage("SchoolDashboard")} variant="secondary" className="flex-1">Cancel</Btn>
        </div>
      </Card>
    </div>
  );
};

const TeacherDetailsPage = ({ teacherUserId, setCurrentPage, setToast }) => {
  const [teacher, setTeacher] = useState(null);
  const [showSchedule, setShowSchedule] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    db.get("th_teacherProfiles").then(profiles => {
      setTeacher((profiles || []).find(p => p.userId === teacherUserId) || null);
    });
  }, [teacherUserId]);

  const handleSchedule = () => {
    if (!date || !time) { setToast({ message: "Please enter both date and time.", type: "error" }); return; }
    setToast({ message: `Video interview scheduled with ${teacher.name} on ${date} at ${time}`, type: "success" });
    setShowSchedule(false); setDate(""); setTime("");
  };

  if (!teacher) return <LoadingSpinner />;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <button onClick={() => setCurrentPage("SchoolHome")} className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 mb-5 transition-colors">
        <ArrowLeft size={16} /> Back to Listings
      </button>
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-2xl">
            {teacher.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">{teacher.name}</h1>
            <p className="text-slate-500">{teacher.subject || "Subject not specified"}</p>
          </div>
        </div>

        {teacher.bio && (
          <div className="mb-5">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 border-l-4 border-blue-600 pl-3">About</p>
            <p className="text-sm text-slate-600">{teacher.bio}</p>
          </div>
        )}

        <div className="mb-5">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 border-l-4 border-indigo-500 pl-3">Professional Information</p>
          <div className="bg-slate-50 rounded-xl divide-y divide-slate-200">
            {[["Experience", teacher.experience], ["Education", teacher.education], ["Availability", teacher.availability], ["Location", teacher.location]].filter(([,v]) => v).map(([l, v]) => (
              <div key={l} className="flex gap-3 px-4 py-2.5">
                <span className="text-sm font-semibold text-slate-600 w-28 flex-shrink-0">{l}:</span>
                <span className="text-sm text-slate-800">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {(teacher.email || teacher.phone) && (
          <div className="mb-5">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 border-l-4 border-emerald-500 pl-3">Contact</p>
            <div className="space-y-2">
              {teacher.email && <div className="flex items-center gap-2 text-sm text-slate-700"><Mail size={14} className="text-emerald-600" />{teacher.email}</div>}
              {teacher.phone && <div className="flex items-center gap-2 text-sm text-slate-700"><Phone size={14} className="text-emerald-600" />{teacher.phone}</div>}
            </div>
          </div>
        )}

        {(teacher.certifications || []).length > 0 && (
          <div className="mb-5">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 border-l-4 border-amber-500 pl-3">Certifications</p>
            <div className="flex flex-wrap gap-2">
              {teacher.certifications.map((c, i) => (
                <span key={i} className="text-sm bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <CheckCircle size={13} />  {c}
                </span>
              ))}
            </div>
          </div>
        )}

        {!showSchedule ? (
          <div className="flex gap-3">
            <Btn onClick={() => setShowSchedule(true)} className="flex-1">Schedule Video Interview</Btn>
            <Btn onClick={() => setToast({ message: `${teacher.name} added to waitlist!`, type: "success" })} variant="success" className="flex-1">Add to Waitlist</Btn>
          </div>
        ) : (
          <div className="border border-blue-200 rounded-xl p-4 bg-blue-50">
            <p className="font-bold text-slate-800 mb-4">Schedule Video Interview</p>
            <Input label="Interview Date" value={date} onChange={setDate} placeholder="DD/MM/YYYY" />
            <Input label="Interview Time" value={time} onChange={setTime} placeholder="HH:MM (e.g., 14:00)" />
            <p className="text-xs text-slate-500 mb-4">A video meeting link will be sent to both parties via email.</p>
            <div className="flex gap-2">
              <Btn onClick={handleSchedule} className="flex-1">Confirm Schedule</Btn>
              <Btn onClick={() => { setShowSchedule(false); setDate(""); setTime(""); }} variant="secondary" className="flex-1">Cancel</Btn>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

const SchoolSettings = ({ currentUser, setCurrentPage, setToast }) => {
  const [tab, setTab] = useState("profile");
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    db.get("th_schoolProfiles").then(profiles => {
      const p = (profiles || []).find(p => p.userId === currentUser.id);
      setProfile(p || { userId: currentUser.id, name: currentUser.name, email: currentUser.email, phone: "", bio: "", location: "", hireCondition: "", salaryMin: "", registrationNumber: "", visible: true, offerTraining: false });
    });
  }, []);

  const update = (field, value) => setProfile(prev => ({ ...prev, [field]: value }));

  const save = async () => {
    setSaving(true);
    const profiles = await db.get("th_schoolProfiles") || [];
    const idx = profiles.findIndex(p => p.userId === currentUser.id);
    if (idx >= 0) profiles[idx] = profile; else profiles.push(profile);
    await db.set("th_schoolProfiles", profiles);
    setSaving(false);
    setToast({ message: "School profile saved!", type: "success" });
  };

  const tabs = [{ id: "profile", label: "Basic Profile" }, { id: "qualifications", label: "Documents" }, { id: "visibility", label: "Visibility" }];

  if (!profile) return <LoadingSpinner />;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">School Profile Settings</h1>
        <p className="text-slate-500 text-sm">Update your school details and visibility</p>
      </div>
      <Card>
        <div className="flex border-b border-slate-200">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 py-3 text-xs font-semibold transition-colors ${tab === t.id ? "border-b-2 border-blue-600 text-blue-600" : "text-slate-500 hover:text-slate-700"}`}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="p-5">
          {tab === "profile" && (
            <>
              <Input label="School Name" value={profile.name} onChange={v => update("name", v)} placeholder="Enter school name" required />
              <Input label="Phone Number" value={profile.phone} onChange={v => update("phone", v)} placeholder="+237 600 000 000" />
              <Input label="Email Address" value={profile.email} onChange={v => update("email", v)} placeholder="school@edu.cm" />
              <Input label="Location" value={profile.location} onChange={v => update("location", v)} placeholder="City, Region, Country" />
              <Input label="School Summary / Bio" value={profile.bio} onChange={v => update("bio", v)} placeholder="Tell teachers about your school…" multiline rows={4} />
              <Input label="Hire Condition" value={profile.hireCondition} onChange={v => update("hireCondition", v)} placeholder="e.g., Immediate, Next semester" />
              <Input label="Minimum Salary Offered (XAF)" value={profile.salaryMin} onChange={v => update("salaryMin", v)} placeholder="e.g., 150000" />
            </>
          )}
          {tab === "qualifications" && (
            <>
              <Input label="Registration Number" value={profile.registrationNumber} onChange={v => update("registrationNumber", v)} placeholder="Enter official registration number" />
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center">
                <FileText size={28} className="text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-600">Drag & drop documents or <span className="text-blue-600 cursor-pointer font-medium">Browse Files</span></p>
                <p className="text-xs text-slate-400 mt-1">Licenses, certificates, accreditation (PDF)</p>
              </div>
            </>
          )}
          {tab === "visibility" && (
            <>
              <div className="border border-slate-200 rounded-xl p-4 flex items-start gap-4 mb-3">
                <div className="flex-1">
                  <p className="font-semibold text-slate-800 text-sm">Visible to Teachers</p>
                  <p className="text-xs text-slate-500 mt-0.5">Allow teachers to find and view your school profile</p>
                </div>
                <button onClick={() => update("visible", !profile.visible)}
                  className={`w-11 h-6 rounded-full transition-colors flex-shrink-0 ${profile.visible ? "bg-blue-600" : "bg-slate-300"}`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${profile.visible ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>
              <div className="border border-slate-200 rounded-xl p-4 flex items-start gap-4 mb-4">
                <div className="flex-1">
                  <p className="font-semibold text-slate-800 text-sm">Offer Training / Consulting Services</p>
                  <p className="text-xs text-slate-500 mt-0.5">Appear on the Services Marketplace</p>
                </div>
                <button onClick={() => update("offerTraining", !profile.offerTraining)}
                  className={`w-11 h-6 rounded-full transition-colors flex-shrink-0 ${profile.offerTraining ? "bg-blue-600" : "bg-slate-300"}`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${profile.offerTraining ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>
            </>
          )}
          <Btn onClick={save} disabled={saving} className="w-full mt-2">{saving ? "Saving…" : "Save Changes"}</Btn>
        </div>
      </Card>
    </div>
  );
};

//main app
export default function App() {
  const [authPage, setAuthPage] = useState("landing"); // landing | login | register-teacher | register-school
  const [currentUser, setCurrentUser] = useState(null); // null when not logged in
  const [currentPage, setCurrentPage] = useState("Home");
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const [toast, setToast] = useState(null);

  const handleLogin = (user) => { setCurrentUser(user); setCurrentPage("Home"); };

  const handleLogout = () => { setCurrentUser(null); setCurrentPage("Home"); setAuthPage("landing"); setMenuVisible(false); };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This cannot be undone.")) return;
    const accounts = await db.get("th_accounts") || [];
    await db.set("th_accounts", accounts.filter(a => a.id !== currentUser.id));
    handleLogout();
    setToast({ message: "Account deleted successfully.", type: "info" });
  };

  const renderPage = () => {
    if (!currentUser) return null;
    const isTeacher = currentUser.role === "teacher";

    if (isTeacher) {
      switch (currentPage) {
        case "Home": return <TeacherHome currentUser={currentUser} setCurrentPage={setCurrentPage} setSelectedJobId={setSelectedJobId} setToast={setToast} />;
        case "TeacherHome": return <TeacherHome currentUser={currentUser} setCurrentPage={setCurrentPage} setSelectedJobId={setSelectedJobId} setToast={setToast} />;
        case "TeacherDashboard": return <TeacherDashboard currentUser={currentUser} setCurrentPage={setCurrentPage} setToast={setToast} />;
        case "TeacherSettings": return <TeacherSettings currentUser={currentUser} setCurrentPage={setCurrentPage} setToast={setToast} />;
        case "JobDetails": return <JobDetailsPage currentUser={currentUser} jobId={selectedJobId} setCurrentPage={setCurrentPage} setToast={setToast} />;
        default: return <TeacherHome currentUser={currentUser} setCurrentPage={setCurrentPage} setSelectedJobId={setSelectedJobId} setToast={setToast} />;
      }
    } else {
      switch (currentPage) {
        case "Home": return <SchoolHome currentUser={currentUser} setCurrentPage={setCurrentPage} setSelectedTeacherId={setSelectedTeacherId} setToast={setToast} />;
        case "SchoolHome": return <SchoolHome currentUser={currentUser} setCurrentPage={setCurrentPage} setSelectedTeacherId={setSelectedTeacherId} setToast={setToast} />;
        case "SchoolDashboard": return <SchoolDashboard currentUser={currentUser} setCurrentPage={setCurrentPage} setToast={setToast} />;
        case "TeacherDashboard": return <SchoolDashboard currentUser={currentUser} setCurrentPage={setCurrentPage} setToast={setToast} />;
        case "SchoolSettings": return <SchoolSettings currentUser={currentUser} setCurrentPage={setCurrentPage} setToast={setToast} />;
        case "UploadVacancy": return <UploadVacancy currentUser={currentUser} setCurrentPage={setCurrentPage} setToast={setToast} />;
        case "TeacherDetails": return <TeacherDetailsPage teacherUserId={selectedTeacherId} setCurrentPage={setCurrentPage} setToast={setToast} />;
        default: return <SchoolHome currentUser={currentUser} setCurrentPage={setCurrentPage} setSelectedTeacherId={setSelectedTeacherId} setToast={setToast} />;
      }
    }
  };

  // Not logged in 
  if (!currentUser) {
    if (authPage === "landing") return (
      <>
        <LandingPage setPage={setAuthPage} />
        {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      </>
    );
    if (authPage === "login") return (
      <>
        <LoginPage setPage={setAuthPage} onLogin={handleLogin} setToast={setToast} />
        {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      </>
    );
    if (authPage.startsWith("register")) {
      const role = authPage === "register-school" ? "school" : "teacher";
      return (
        <>
          <RegisterPage role={role} setPage={setAuthPage} onLogin={handleLogin} setToast={setToast} />
          {toast && <Toast {...toast} onClose={() => setToast(null)} />}
        </>
      );
    }
  }

  // Logged in
  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader currentUser={currentUser} onOpenMenu={() => setMenuVisible(true)} />
      <SideMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        currentUser={currentUser}
        setCurrentPage={(p) => { setCurrentPage(p); setMenuVisible(false); }}
        onLogout={handleLogout}
        onDeleteAccount={handleDeleteAccount}
      />
      <div className="pb-8">
        {renderPage()}
      </div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}