import React, { useState, useEffect } from 'react';

export default function TotalTonnage() {
  const [workouts, setWorkouts] = useState([]);
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [currentTab, setCurrentTab] = useState('home');
  const [yearlyGoal, setYearlyGoal] = useState({});
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [insightsView, setInsightsView] = useState('daily');

  useEffect(() => {
    const saved = localStorage.getItem('workouts');
    if (saved) {
      setWorkouts(JSON.parse(saved));
    }
    const savedGoals = localStorage.getItem('yearlyGoals');
    if (savedGoals) {
      setYearlyGoal(JSON.parse(savedGoals));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('workouts', JSON.stringify(workouts));
  }, [workouts]);

  useEffect(() => {
    localStorage.setItem('yearlyGoals', JSON.stringify(yearlyGoal));
  }, [yearlyGoal]);

  const addWorkout = (workout) => {
    setWorkouts([...workouts, { ...workout, id: Date.now() }]);
    setShowWorkoutModal(false);
    setEditingWorkout(null);
  };

  const updateWorkout = (updatedWorkout) => {
    setWorkouts(workouts.map(w => w.id === updatedWorkout.id ? updatedWorkout : w));
    setShowWorkoutModal(false);
    setEditingWorkout(null);
  };

  const deleteWorkout = (id) => {
    setWorkouts(workouts.filter(w => w.id !== id));
  };

  const editWorkout = (workout) => {
    setEditingWorkout(workout);
    setShowWorkoutModal(true);
  };

  const setGoal = (year, goal) => {
    setYearlyGoal({ ...yearlyGoal, [year]: goal });
    setShowGoalModal(false);
  };

  const totalWeight = (year) => {
    return workouts
      .filter(w => new Date(w.date).getFullYear() === year)
      .reduce((sum, w) => sum + w.totalWeight, 0);
  };

  const allYears = () => {
    const years = [...new Set(workouts.map(w => new Date(w.date).getFullYear()))];
    return years.sort((a, b) => b - a);
  };

  const filteredWorkouts = workouts
    .filter(w => new Date(w.date).getFullYear() === selectedYear)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const years = allYears();
  const currentTotal = totalWeight(selectedYear);
  const currentGoal = yearlyGoal[selectedYear] || 0;
  const progressPercent = currentGoal > 0 ? Math.min((currentTotal / currentGoal) * 100, 100) : 0;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <div className="relative w-full max-w-sm">
        <div className="bg-black rounded-[3rem] p-3 shadow-2xl">
          <div className="bg-white rounded-[2.5rem] overflow-hidden h-[700px] flex flex-col">
            {/* Status Bar */}
            <div className="bg-white px-6 pt-3 pb-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span>9:41</span>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/></svg>
                  <svg className="w-4 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>
                  <svg className="w-5 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8l4-2 4 2V6z"/></svg>
                </div>
              </div>
            </div>

            {/* Nav Bar */}
            <div className="bg-white px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <h1 className="text-2xl font-bold">
                {currentTab === 'home' ? 'Progress' : currentTab === 'diary' ? 'Workouts' : 'Insights'}
              </h1>
              {currentTab === 'diary' && (
                <button
                  onClick={() => {
                    setEditingWorkout(null);
                    setShowWorkoutModal(true);
                  }}
                  className="text-blue-500 text-3xl"
                >
                  +
                </button>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto bg-gray-50">
              {currentTab === 'home' ? (
                <div className="p-6 space-y-6">
                  {years.length > 1 && (
                    <div className="flex gap-2 justify-center">
                      {years.map(year => (
                        <button
                          key={year}
                          onClick={() => setSelectedYear(year)}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            selectedYear === year
                              ? 'bg-blue-500 text-white'
                              : 'bg-white text-gray-700 border border-gray-200'
                          }`}
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <svg width="200" height="200" className="transform -rotate-90">
                        <circle
                          cx="100"
                          cy="100"
                          r="80"
                          stroke="#e5e7eb"
                          strokeWidth="12"
                          fill="none"
                        />
                        <circle
                          cx="100"
                          cy="100"
                          r="80"
                          stroke="#3b82f6"
                          strokeWidth="12"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 80}`}
                          strokeDashoffset={`${2 * Math.PI * 80 * (1 - progressPercent / 100)}`}
                          strokeLinecap="round"
                          className="transition-all duration-500"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl font-bold text-blue-500">
                          {Math.round(progressPercent)}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-6 text-center">
                      <p className="text-sm text-gray-500 mb-1">Total Lifted in {selectedYear}</p>
                      <p className="text-4xl font-bold text-gray-900 mb-4">
                        {Math.round(currentTotal).toLocaleString()} lbs
                      </p>
                      
                      {currentGoal > 0 ? (
                        <>
                          <p className="text-sm text-gray-500 mb-1">Goal</p>
                          <p className="text-2xl font-semibold text-blue-500 mb-4">
                            {Math.round(currentGoal).toLocaleString()} lbs
                          </p>
                          <p className="text-sm text-gray-600">
                            {Math.round(currentGoal - currentTotal).toLocaleString()} lbs to go
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-gray-500">No goal set yet</p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setShowGoalModal(true)}
                    className="w-full py-4 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
                  >
                    {currentGoal > 0 ? 'Update Goal' : 'Set Goal'}
                  </button>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <p className="text-sm text-gray-500 mb-1">Progress</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {Math.round(progressPercent)}%
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <p className="text-sm text-gray-500 mb-1">Remaining</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {currentGoal > 0 ? Math.round(100 - progressPercent) : 0}%
                      </p>
                    </div>
                  </div>
                </div>
              ) : currentTab === 'insights' ? (
                <InsightsPage workouts={workouts} />
              ) : (
                <>
                  <div className="bg-white p-6 mb-4">
                    <p className="text-sm text-gray-500 text-center mb-1">Total Weight Lifted</p>
                    <p className="text-5xl font-bold text-blue-500 text-center mb-4">
                      {Math.round(currentTotal).toLocaleString()} lbs
                    </p>

                    {years.length > 1 && (
                      <div className="flex gap-2 justify-center">
                        {years.map(year => (
                          <button
                            key={year}
                            onClick={() => setSelectedYear(year)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                              selectedYear === year
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            {year}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {filteredWorkouts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 px-6">
                      <div className="text-6xl mb-4">🏋️</div>
                      <p className="text-xl font-medium text-gray-700 mb-2">No workouts yet</p>
                      <p className="text-sm text-gray-500">Tap + to log your first workout!</p>
                    </div>
                  ) : (
                    <div className="px-4 space-y-3 pb-4">
                      {filteredWorkouts.map(workout => (
                        <div key={workout.id} className="bg-white rounded-xl p-4 shadow-sm">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1" onClick={() => editWorkout(workout)} style={{ cursor: 'pointer' }}>
                              <h3 className="text-lg font-semibold text-gray-900">{workout.name}</h3>
                              <p className="text-sm text-gray-500">{new Date(workout.date).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xl font-bold text-blue-500">
                                {Math.round(workout.totalWeight).toLocaleString()} lbs
                              </span>
                              <button
                                onClick={() => deleteWorkout(workout.id)}
                                className="text-red-500 hover:text-red-700 text-2xl leading-none"
                              >
                                ×
                              </button>
                            </div>
                          </div>
                          <div className="space-y-1 border-t border-gray-100 pt-2">
                            {workout.exercises.map((ex, idx) => (
                              <div key={idx} className="text-sm text-gray-600 flex justify-between">
                                <span>{ex.name}: {ex.sets}×{ex.reps} @ {ex.weight}lbs</span>
                                <span className="text-gray-400">{Math.round(ex.total).toLocaleString()}lbs</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Tab Bar */}
            <div className="bg-white border-t border-gray-200 flex">
              <button
                onClick={() => setCurrentTab('home')}
                className={`flex-1 py-3 flex flex-col items-center gap-1 transition-colors ${
                  currentTab === 'home' ? 'text-blue-500' : 'text-gray-400'
                }`}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                </svg>
                <span className="text-xs font-medium">Home</span>
              </button>
              <button
                onClick={() => setCurrentTab('diary')}
                className={`flex-1 py-3 flex flex-col items-center gap-1 transition-colors ${
                  currentTab === 'diary' ? 'text-blue-500' : 'text-gray-400'
                }`}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"/>
                </svg>
                <span className="text-xs font-medium">Diary</span>
              </button>
              <button
                onClick={() => setCurrentTab('insights')}
                className={`flex-1 py-3 flex flex-col items-center gap-1 transition-colors ${
                  currentTab === 'insights' ? 'text-blue-500' : 'text-gray-400'
                }`}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
                </svg>
                <span className="text-xs font-medium">Insights</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showWorkoutModal && (
        <WorkoutModal
          onClose={() => {
            setShowWorkoutModal(false);
            setEditingWorkout(null);
          }}
          onSave={editingWorkout ? updateWorkout : addWorkout}
          workout={editingWorkout}
        />
      )}

      {showGoalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <button onClick={() => setShowGoalModal(false)} className="text-blue-500 font-medium">
                Cancel
              </button>
              <h2 className="text-lg font-semibold">Set Goal for {selectedYear}</h2>
              <button
                onClick={() => {
                  const goalInput = document.getElementById('goal').value;
                  if (goalInput && parseFloat(goalInput) > 0) {
                    setGoal(selectedYear, parseFloat(goalInput));
                  }
                }}
                className="text-blue-500 font-semibold"
              >
                Save
              </button>
            </div>

            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Weight Goal (lbs)
              </label>
              <input
                id="goal"
                type="number"
                placeholder="e.g., 10000000"
                defaultValue={currentGoal > 0 ? currentGoal : ''}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
              <p className="mt-3 text-sm text-gray-500">
                Enter your total weight lifting goal for {selectedYear}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InsightsPage({ workouts }) {
  const [timeView, setTimeView] = useState('weekly');
  const [exercise1, setExercise1] = useState('');
  const [exercise2, setExercise2] = useState('');
  const [focusedInput, setFocusedInput] = useState(null);

  // Get all unique exercise names
  const getAllExerciseNames = () => {
    const allNames = new Set();
    workouts.forEach(w => {
      w.exercises.forEach(ex => {
        if (ex.name.trim()) {
          allNames.add(ex.name.trim());
        }
      });
    });
    return Array.from(allNames).sort();
  };

  const getSuggestions = (input) => {
    if (!input.trim()) return [];
    const allNames = getAllExerciseNames();
    const inputLower = input.toLowerCase();
    return allNames.filter(name => name.toLowerCase().startsWith(inputLower));
  };

  // Calculate data for bar graph
  const getGraphData = () => {
    const now = new Date();
    const data = [];

    if (timeView === 'daily') {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const total = workouts
          .filter(w => w.date === dateStr)
          .reduce((sum, w) => sum + w.totalWeight, 0);
        
        data.push({
          label: date.toLocaleDateString('en-US', { weekday: 'short' }),
          value: total
        });
      }
    } else if (timeView === 'weekly') {
      // Last 8 weeks
      for (let i = 7; i >= 0; i--) {
        const endDate = new Date(now);
        endDate.setDate(endDate.getDate() - (i * 7));
        const startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - 6);
        
        const total = workouts
          .filter(w => {
            const wDate = new Date(w.date);
            return wDate >= startDate && wDate <= endDate;
          })
          .reduce((sum, w) => sum + w.totalWeight, 0);
        
        data.push({
          label: `W${8 - i}`,
          value: total
        });
      }
    } else {
      // Last 6 months
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - i);
        const month = date.getMonth();
        const year = date.getFullYear();
        
        const total = workouts
          .filter(w => {
            const wDate = new Date(w.date);
            return wDate.getMonth() === month && wDate.getFullYear() === year;
          })
          .reduce((sum, w) => sum + w.totalWeight, 0);
        
        data.push({
          label: date.toLocaleDateString('en-US', { month: 'short' }),
          value: total
        });
      }
    }

    return data;
  };

  // Calculate streaks
  const calculateStreak = () => {
    if (workouts.length === 0) return 0;
    
    const sortedDates = [...new Set(workouts.map(w => w.date))].sort().reverse();
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0];
    
    // Check if there's a workout today or yesterday to start counting
    if (sortedDates[0] !== today && sortedDates[0] !== yesterday) {
      return 0;
    }
    
    let currentDate = new Date(sortedDates[0]);
    
    for (let i = 0; i < sortedDates.length; i++) {
      const expectedDate = new Date(currentDate);
      expectedDate.setDate(expectedDate.getDate() - i);
      const expectedStr = expectedDate.toISOString().split('T')[0];
      
      if (sortedDates[i] === expectedStr) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  // Get total weight for an exercise
  const getExerciseTotal = (exerciseName) => {
    if (!exerciseName.trim()) return 0;
    
    const nameLower = exerciseName.toLowerCase();
    let total = 0;
    
    workouts.forEach(w => {
      w.exercises.forEach(ex => {
        if (ex.name.toLowerCase() === nameLower) {
          total += ex.total;
        }
      });
    });
    
    return total;
  };

  // Get top exercises by total weight
  const getTopExercises = () => {
    const exerciseTotals = {};
    
    workouts.forEach(w => {
      w.exercises.forEach(ex => {
        if (!exerciseTotals[ex.name]) {
          exerciseTotals[ex.name] = 0;
        }
        exerciseTotals[ex.name] += ex.total;
      });
    });
    
    return Object.entries(exerciseTotals)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  };

  const graphData = getGraphData();
  const maxValue = Math.max(...graphData.map(d => d.value), 1);
  const streak = calculateStreak();
  const exercise1Total = getExerciseTotal(exercise1);
  const exercise2Total = getExerciseTotal(exercise2);
  const topExercises = getTopExercises();

  return (
    <div className="p-4 space-y-6">
      {/* Streak Card */}
      <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-xl p-6 text-white shadow-lg">
        <p className="text-sm opacity-90 mb-1">Current Streak</p>
        <p className="text-5xl font-bold">{streak}</p>
        <p className="text-sm opacity-90 mt-1">{streak === 1 ? 'day' : 'days'} 🔥</p>
      </div>

      {/* Top Exercises Leaderboard */}
      {topExercises.length > 0 && (
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Top Exercises 🏆</h3>
          <div className="space-y-3">
            {topExercises.map((exercise, idx) => (
              <div key={exercise.name} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  idx === 0 ? 'bg-yellow-400 text-yellow-900' :
                  idx === 1 ? 'bg-gray-300 text-gray-700' :
                  idx === 2 ? 'bg-orange-400 text-orange-900' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{exercise.name}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${(exercise.total / topExercises[0].total) * 100}%` }}
                    />
                  </div>
                </div>
                <p className="text-sm font-semibold text-gray-700">
                  {Math.round(exercise.total).toLocaleString()} lbs
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bar Graph */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-900">Weight Lifted</h3>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setTimeView('daily')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                timeView === 'daily' ? 'bg-blue-500 text-white' : 'text-gray-600'
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setTimeView('weekly')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                timeView === 'weekly' ? 'bg-blue-500 text-white' : 'text-gray-600'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setTimeView('monthly')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                timeView === 'monthly' ? 'bg-blue-500 text-white' : 'text-gray-600'
              }`}
            >
              Monthly
            </button>
          </div>
        </div>

        <div className="flex items-end justify-between h-48 gap-2">
          {graphData.map((item, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex items-end justify-center" style={{ height: '160px' }}>
                <div
                  className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                  style={{ height: `${(item.value / maxValue) * 100}%`, minHeight: item.value > 0 ? '4px' : '0' }}
                  title={`${Math.round(item.value).toLocaleString()} lbs`}
                />
              </div>
              <span className="text-xs text-gray-600">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Exercise Comparison */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Exercise Comparison</h3>
        
        <div className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Exercise 1</label>
            <input
              type="text"
              value={exercise1}
              onChange={(e) => setExercise1(e.target.value)}
              onFocus={() => setFocusedInput(1)}
              onBlur={() => setTimeout(() => setFocusedInput(null), 200)}
              placeholder="e.g., Squat"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {focusedInput === 1 && getSuggestions(exercise1).length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                {getSuggestions(exercise1).map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => setExercise1(suggestion)}
                    className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors text-sm"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
            {exercise1 && (
              <div className="mt-2 text-center">
                <p className="text-2xl font-bold text-blue-600">{Math.round(exercise1Total).toLocaleString()} lbs</p>
                <p className="text-xs text-gray-500">Total lifted</p>
              </div>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Exercise 2 (Optional)</label>
            <input
              type="text"
              value={exercise2}
              onChange={(e) => setExercise2(e.target.value)}
              onFocus={() => setFocusedInput(2)}
              onBlur={() => setTimeout(() => setFocusedInput(null), 200)}
              placeholder="e.g., Bench Press"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {focusedInput === 2 && getSuggestions(exercise2).length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                {getSuggestions(exercise2).map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => setExercise2(suggestion)}
                    className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors text-sm"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
            {exercise2 && (
              <div className="mt-2 text-center">
                <p className="text-2xl font-bold text-green-600">{Math.round(exercise2Total).toLocaleString()} lbs</p>
                <p className="text-xs text-gray-500">Total lifted</p>
              </div>
            )}
          </div>

          {exercise1 && exercise2 && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Comparison</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-blue-500 h-full transition-all"
                      style={{ width: `${exercise1Total > 0 ? (exercise1Total / Math.max(exercise1Total, exercise2Total)) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-700 w-20 text-right">{exercise1}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-green-500 h-full transition-all"
                      style={{ width: `${exercise2Total > 0 ? (exercise2Total / Math.max(exercise1Total, exercise2Total)) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-700 w-20 text-right">{exercise2}</span>
                </div>
              </div>
              {exercise1Total > 0 && exercise2Total > 0 && (
                <p className="text-xs text-gray-500 mt-3 text-center">
                  {exercise1Total > exercise2Total 
                    ? `${exercise1} is ${Math.round((exercise1Total / exercise2Total - 1) * 100)}% higher`
                    : `${exercise2} is ${Math.round((exercise2Total / exercise1Total - 1) * 100)}% higher`
                  }
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function WorkoutModal({ onClose, onSave, workout }) {
  const [name, setName] = useState(workout?.name || '');
  const [date, setDate] = useState(workout?.date || new Date().toISOString().split('T')[0]);
  const [exercises, setExercises] = useState(workout?.exercises || []);
  const [focusedExercise, setFocusedExercise] = useState(null);

  // Get all unique exercise names from localStorage
  const getAllExerciseNames = () => {
    const saved = localStorage.getItem('workouts');
    if (!saved) return [];
    
    const workouts = JSON.parse(saved);
    const allNames = new Set();
    
    workouts.forEach(w => {
      w.exercises.forEach(ex => {
        if (ex.name.trim()) {
          allNames.add(ex.name.trim());
        }
      });
    });
    
    return Array.from(allNames);
  };

  const capitalizeWords = (str) => {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getSuggestions = (input) => {
    if (!input.trim()) return [];
    
    const allNames = getAllExerciseNames();
    const inputLower = input.toLowerCase();
    
    return allNames
      .filter(name => name.toLowerCase().startsWith(inputLower))
      .sort();
  };

  const addExercise = () => {
    setExercises([...exercises, { name: '', sets: '', reps: '', weight: '', total: 0 }]);
  };

  const updateExercise = (index, field, value) => {
    const updated = [...exercises];
    updated[index][field] = value;
    
    // Calculate total
    const sets = parseFloat(updated[index].sets) || 0;
    const reps = parseFloat(updated[index].reps) || 0;
    const weight = parseFloat(updated[index].weight) || 0;
    updated[index].total = sets * reps * weight;
    
    setExercises(updated);
  };

  const selectSuggestion = (index, suggestion) => {
    const updated = [...exercises];
    updated[index].name = suggestion;
    setExercises(updated);
    setFocusedExercise(null);
  };

  const removeExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const totalWeight = exercises.reduce((sum, ex) => sum + (ex.total || 0), 0);

  const handleSave = () => {
    if (name && exercises.length > 0 && exercises.every(ex => ex.name && ex.sets && ex.reps && ex.weight)) {
      // Capitalize exercise names before saving
      const capitalizedExercises = exercises.map(ex => ({
        ...ex,
        name: capitalizeWords(ex.name.trim())
      }));
      
      const workoutData = {
        ...(workout?.id && { id: workout.id }),
        name,
        date,
        exercises: capitalizedExercises,
        totalWeight
      };
      onSave(workoutData);
    }
  };

  const isValid = name && exercises.length > 0 && exercises.every(ex => ex.name && ex.sets && ex.reps && ex.weight);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <button onClick={onClose} className="text-blue-500 font-medium">
            Cancel
          </button>
          <h2 className="text-lg font-semibold">{workout ? 'Edit Workout' : 'Add Workout'}</h2>
          <button
            onClick={handleSave}
            disabled={!isValid}
            className={`font-semibold ${isValid ? 'text-blue-500' : 'text-gray-400'}`}
          >
            Save
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Workout Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Morning Lift"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-medium text-gray-700">Exercises</label>
              <button
                onClick={addExercise}
                className="text-blue-500 text-sm font-semibold"
              >
                + Add Exercise
              </button>
            </div>

            {exercises.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">No exercises yet. Click "Add Exercise" to start.</p>
            ) : (
              <div className="space-y-3">
                {exercises.map((ex, idx) => {
                  const suggestions = getSuggestions(ex.name);
                  const showSuggestions = focusedExercise === idx && suggestions.length > 0;
                  
                  return (
                  <div key={idx} className="border border-gray-200 rounded-lg p-3 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={ex.name}
                          onChange={(e) => updateExercise(idx, 'name', e.target.value)}
                          onFocus={() => setFocusedExercise(idx)}
                          onBlur={() => setTimeout(() => setFocusedExercise(null), 200)}
                          placeholder="Exercise name (e.g., Squat)"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {showSuggestions && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                            {suggestions.map((suggestion, sIdx) => (
                              <button
                                key={sIdx}
                                onClick={() => selectSuggestion(idx, suggestion)}
                                className="w-full text-left px-3 py-2 hover:bg-blue-50 transition-colors"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removeExercise(idx)}
                        className="ml-2 text-red-500 hover:text-red-700 text-xl"
                      >
                        ×
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Sets</label>
                        <input
                          type="number"
                          value={ex.sets}
                          onChange={(e) => updateExercise(idx, 'sets', e.target.value)}
                          placeholder="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Reps</label>
                        <input
                          type="number"
                          value={ex.reps}
                          onChange={(e) => updateExercise(idx, 'reps', e.target.value)}
                          placeholder="10"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Weight (lbs)</label>
                        <input
                          type="number"
                          value={ex.weight}
                          onChange={(e) => updateExercise(idx, 'weight', e.target.value)}
                          placeholder="135"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="text-sm text-gray-600">
                      Total: <span className="font-semibold">{Math.round(ex.total).toLocaleString()} lbs</span>
                      {ex.sets && ex.reps && ex.weight && (
                        <span className="text-gray-400 ml-2">({ex.sets} × {ex.reps} × {ex.weight})</span>
                      )}
                    </div>
                  </div>
                );
              })}
              </div>
            )}
          </div>

          {exercises.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
              <p className="text-sm text-gray-600 mb-1">Workout Total</p>
              <p className="text-3xl font-bold text-blue-600">{Math.round(totalWeight).toLocaleString()} lbs</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
