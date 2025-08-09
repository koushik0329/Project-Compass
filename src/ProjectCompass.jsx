import React, { useState, useEffect } from "react";
import {
  FileText,
  Target,
  TrendingUp,
  Plus,
  Save,
  ArrowLeft,
  Calendar,
  User,
  LogOut,
} from "lucide-react";

const ProjectCompass = () => {
  const [currentScreen, setCurrentScreen] = useState("login");
  const [user, setUser] = useState(null);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [sparkEntry, setSparkEntry] = useState("");
  const [goals, setGoals] = useState([]);
  const [blueprints, setBlueprints] = useState([]);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    category: "personal",
  });
  const [newBlueprint, setNewBlueprint] = useState({
    title: "",
    description: "",
    steps: [],
  });
  const [sparkEntries, setSparkEntries] = useState([]);

  useEffect(() => {
    // Load saved data on component mount
    const savedUser = JSON.parse(
      localStorage.getItem("compass_user") || "null"
    );
    const savedGoals = JSON.parse(
      localStorage.getItem("compass_goals") || "[]"
    );
    const savedBlueprints = JSON.parse(
      localStorage.getItem("compass_blueprints") || "[]"
    );
    const savedEntries = JSON.parse(
      localStorage.getItem("compass_entries") || "[]"
    );

    if (savedUser) {
      setUser(savedUser);
      setCurrentScreen("dashboard");
    }
    setGoals(savedGoals);
    setBlueprints(savedBlueprints);
    setSparkEntries(savedEntries);
  }, []);

  const saveToStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginData.email && loginData.password) {
      const userData = {
        name:
          loginData.email.split("@")[0].charAt(0).toUpperCase() +
          loginData.email.split("@")[0].slice(1),
        email: loginData.email,
      };
      setUser(userData);
      saveToStorage("compass_user", userData);
      setCurrentScreen("dashboard");
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("compass_user");
    setCurrentScreen("login");
  };

  const saveSpark = () => {
    if (sparkEntry.trim()) {
      const entry = {
        id: Date.now(),
        date: new Date().toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        content: sparkEntry,
        timestamp: new Date().toISOString(),
      };
      const updatedEntries = [entry, ...sparkEntries];
      setSparkEntries(updatedEntries);
      saveToStorage("compass_entries", updatedEntries);
      setSparkEntry("");
      setCurrentScreen("dashboard");
    }
  };

  const addGoal = () => {
    if (newGoal.title.trim()) {
      const goal = {
        id: Date.now(),
        ...newGoal,
        progress: 0,
        created: new Date().toISOString(),
      };
      const updatedGoals = [...goals, goal];
      setGoals(updatedGoals);
      saveToStorage("compass_goals", updatedGoals);
      setNewGoal({ title: "", description: "", category: "personal" });
    }
  };

  const addBlueprint = () => {
    if (newBlueprint.title.trim()) {
      const blueprint = {
        id: Date.now(),
        ...newBlueprint,
        created: new Date().toISOString(),
      };
      const updatedBlueprints = [...blueprints, blueprint];
      setBlueprints(updatedBlueprints);
      saveToStorage("compass_blueprints", updatedBlueprints);
      setNewBlueprint({ title: "", description: "", steps: [] });
    }
  };

  const updateGoalProgress = (goalId, progress) => {
    const updatedGoals = goals.map((goal) =>
      goal.id === goalId ? { ...goal, progress } : goal
    );
    setGoals(updatedGoals);
    saveToStorage("compass_goals", updatedGoals);
  };

  if (currentScreen === "login") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-white text-center mb-8">
            Project Compass
          </h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="email"
              placeholder="Email"
              value={loginData.email}
              onChange={(e) =>
                setLoginData({ ...loginData, email: e.target.value })
              }
              className="w-full p-4 bg-gray-700 text-white rounded-xl border-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
              className="w-full p-4 bg-gray-700 text-white rounded-xl border-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl font-semibold transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (currentScreen === "dashboard") {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>

          <div className="bg-gray-800 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">
              Today's Spark
            </h2>
            <p className="text-gray-400 mb-6">
              What's on your mind? Capture your thoughts and ideas.
            </p>
            <button
              onClick={() => setCurrentScreen("spark")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-colors"
            >
              Begin Entry
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              onClick={() => setCurrentScreen("blueprints")}
              className="bg-gray-800 rounded-2xl p-6 cursor-pointer hover:bg-gray-700 transition-colors"
            >
              <div className="flex flex-col items-center text-center">
                <FileText className="text-green-400 mb-4" size={48} />
                <h3 className="text-xl font-semibold mb-2">My Blueprints</h3>
                <p className="text-gray-400 text-sm">
                  {blueprints.length} active plans
                </p>
              </div>
            </div>

            <div
              onClick={() => setCurrentScreen("goals")}
              className="bg-gray-800 rounded-2xl p-6 cursor-pointer hover:bg-gray-700 transition-colors"
            >
              <div className="flex flex-col items-center text-center">
                <Target className="text-yellow-400 mb-4" size={48} />
                <h3 className="text-xl font-semibold mb-2">My Goals</h3>
                <p className="text-gray-400 text-sm">
                  {goals.length} active goals
                </p>
              </div>
            </div>

            <div
              onClick={() => setCurrentScreen("progress")}
              className="bg-gray-800 rounded-2xl p-6 cursor-pointer hover:bg-gray-700 transition-colors"
            >
              <div className="flex flex-col items-center text-center">
                <TrendingUp className="text-purple-400 mb-4" size={48} />
                <h3 className="text-xl font-semibold mb-2">Review Progress</h3>
                <p className="text-gray-400 text-sm">
                  {sparkEntries.length} entries made
                </p>
              </div>
            </div>
          </div>

          {sparkEntries.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Recent Sparks</h3>
              <div className="space-y-4">
                {sparkEntries.slice(0, 3).map((entry) => (
                  <div key={entry.id} className="bg-gray-800 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">
                        {entry.date}
                      </span>
                      <Calendar size={16} className="text-gray-500" />
                    </div>
                    <p className="text-gray-300">
                      {entry.content.length > 150
                        ? entry.content.substring(0, 150) + "..."
                        : entry.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (currentScreen === "spark") {
    const today = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto p-6">
          <div className="flex items-center mb-6">
            <button
              onClick={() => setCurrentScreen("dashboard")}
              className="mr-4 p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold">Today's Spark: {today}</h1>
          </div>

          <div className="bg-gray-800 rounded-2xl p-8">
            <h2 className="text-lg text-gray-300 mb-6">
              What is the one action you will take today to move your mission
              forward?
            </h2>
            <textarea
              value={sparkEntry}
              onChange={(e) => setSparkEntry(e.target.value)}
              placeholder="Reflect on your day, capture your thoughts, and plan your next steps..."
              className="w-full h-96 bg-gray-700 text-white p-6 rounded-xl border-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 resize-none"
            />
            <div className="flex justify-end mt-6">
              <button
                onClick={saveSpark}
                disabled={!sparkEntry.trim()}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition-colors"
              >
                <Save size={20} />
                <span>Save Entry</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === "goals") {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <button
                onClick={() => setCurrentScreen("dashboard")}
                className="mr-4 p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-2xl font-bold">My Goals</h1>
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Add New Goal</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Goal title"
                value={newGoal.title}
                onChange={(e) =>
                  setNewGoal({ ...newGoal, title: e.target.value })
                }
                className="w-full p-3 bg-gray-700 text-white rounded-lg border-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              />
              <textarea
                placeholder="Goal description"
                value={newGoal.description}
                onChange={(e) =>
                  setNewGoal({ ...newGoal, description: e.target.value })
                }
                className="w-full p-3 bg-gray-700 text-white rounded-lg border-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 h-24 resize-none"
              />
              <select
                value={newGoal.category}
                onChange={(e) =>
                  setNewGoal({ ...newGoal, category: e.target.value })
                }
                className="w-full p-3 bg-gray-700 text-white rounded-lg border-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="personal">Personal</option>
                <option value="professional">Professional</option>
                <option value="health">Health</option>
                <option value="learning">Learning</option>
              </select>
              <button
                onClick={addGoal}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                <Plus size={20} />
                <span>Add Goal</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {goals.map((goal) => (
              <div key={goal.id} className="bg-gray-800 rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{goal.title}</h3>
                    <span className="text-sm text-blue-400 capitalize">
                      {goal.category}
                    </span>
                  </div>
                  <span className="text-sm text-gray-400">
                    {goal.progress}%
                  </span>
                </div>
                {goal.description && (
                  <p className="text-gray-400 mb-4">{goal.description}</p>
                )}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    {[10, 25, 50, 75, 100].map((value) => (
                      <button
                        key={value}
                        onClick={() => updateGoalProgress(goal.id, value)}
                        className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
                      >
                        {value}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === "blueprints") {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <button
                onClick={() => setCurrentScreen("dashboard")}
                className="mr-4 p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-2xl font-bold">My Blueprints</h1>
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Create New Blueprint</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Blueprint title"
                value={newBlueprint.title}
                onChange={(e) =>
                  setNewBlueprint({ ...newBlueprint, title: e.target.value })
                }
                className="w-full p-3 bg-gray-700 text-white rounded-lg border-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              />
              <textarea
                placeholder="Blueprint description and strategic plan"
                value={newBlueprint.description}
                onChange={(e) =>
                  setNewBlueprint({
                    ...newBlueprint,
                    description: e.target.value,
                  })
                }
                className="w-full p-3 bg-gray-700 text-white rounded-lg border-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 h-32 resize-none"
              />
              <button
                onClick={addBlueprint}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                <Plus size={20} />
                <span>Create Blueprint</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {blueprints.map((blueprint) => (
              <div key={blueprint.id} className="bg-gray-800 rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">{blueprint.title}</h3>
                  <span className="text-sm text-gray-400">
                    {new Date(blueprint.created).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-400">{blueprint.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === "progress") {
    const completedGoals = goals.filter((goal) => goal.progress === 100).length;
    const avgProgress =
      goals.length > 0
        ? Math.round(
            goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length
          )
        : 0;

    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto p-6">
          <div className="flex items-center mb-6">
            <button
              onClick={() => setCurrentScreen("dashboard")}
              className="mr-4 p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold">Review Progress</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-2">Total Entries</h3>
              <p className="text-3xl font-bold text-blue-400">
                {sparkEntries.length}
              </p>
            </div>
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-2">Completed Goals</h3>
              <p className="text-3xl font-bold text-green-400">
                {completedGoals}
              </p>
            </div>
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-2">Average Progress</h3>
              <p className="text-3xl font-bold text-purple-400">
                {avgProgress}%
              </p>
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">All Spark Entries</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {sparkEntries.map((entry) => (
                <div key={entry.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">{entry.date}</span>
                    <Calendar size={16} className="text-gray-500" />
                  </div>
                  <p className="text-gray-300">{entry.content}</p>
                </div>
              ))}
              {sparkEntries.length === 0 && (
                <p className="text-gray-500 text-center py-8">
                  No entries yet. Start your journey today!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ProjectCompass;
