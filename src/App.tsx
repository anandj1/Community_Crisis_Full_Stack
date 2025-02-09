import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { CrisisCard } from './components/CrisisCard';
import { Shimmer } from './components/shared/Shimmer';
import { Dashboard } from './components/Dashboard';
import { ResetPasswordForm } from './components/auth/ResetPasswordForm';
import { ForgotPasswordForm } from './components/auth/ForgotPasswordForm';
import { CrisisForm } from './components/crisis/CrisisForm';
import { crisisService } from './services/crisisService';
import { authStore } from './services/auth/authStore';
import type { Crisis } from './types/crisis';
import { Status, Severity } from './types/status';

function App() {
  const [crises, setCrises] = useState<Crisis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{ severity?: Severity; status?: Status }>({});
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [showLearnMore, setShowLearnMore] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);

  const user = authStore.getUser();
  const isAdmin = user?.role === 'admin';
  const isAuthenticated = authStore.isAuthenticated();

  const fetchCrises = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = isAdmin
        ? await crisisService.getAllCrises(filters)
        : await crisisService.getMyCrises();
        setCrises(Array.isArray(data) ? data : []);

    } catch (error) {
      console.error('Failed to fetch crises:', error);
      setError('Failed to load crises. Please try again.');
      setCrises([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCrises();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, isAdmin, filters]);

  const handleSignInClick = () => {
    const headerElement = document.querySelector('header');
    if (headerElement) {
      const signInButton = headerElement.querySelector('[data-action="signin"]') as HTMLButtonElement | null;
      signInButton?.click();
    }
  };

  const handleReportCrisis = async (formData: any) => {
    try {
      await crisisService.reportCrisis(formData);
      setShowReportForm(false);
      fetchCrises();
    } catch (error) {
      console.error('Failed to report crisis:', error);
      throw new Error('Failed to report crisis. Please try again.');
    }
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/reset-password/:token" 
          element={
            <div className="min-h-screen bg-gradient-to-br from-blue-800 via-indigo-900 to-purple-900">
              <Header />
              <main className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 py-16">
                <div className="bg-white shadow-xl rounded-lg p-8">
                  <ResetPasswordForm />
                </div>
              </main>
            </div>
          } 
        />
        <Route 
          path="/forgot-password" 
          element={
            <div className="min-h-screen bg-gradient-to-br from-blue-800 via-indigo-900 to-purple-900">
              <Header />
              <main className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 py-16">
                <div className="bg-white shadow-xl rounded-lg p-8">
                  <ForgotPasswordForm />
                </div>
              </main>
            </div>
          } 
        />
        <Route 
          path="/" 
          element={
            isAuthenticated ? (
              <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                  {isAdmin && <Dashboard crises={crises} userId={user?.id} />}
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {isAdmin ? 'All Crises' : 'My Reported Crises'}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4">
                      {!showReportForm && (
                        <button
                          onClick={() => setShowReportForm(true)}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                        >
                          Report Crisis
                        </button>
                      )}
                      {isAdmin && (
                        <div className="flex flex-wrap gap-4">
                          <select
                            value={filters.severity || ''}
                            onChange={(e) => setFilters(prev => ({ 
                              ...prev, 
                              severity: e.target.value as Severity || undefined 
                            }))}
                            className="rounded-lg border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                          >
                            <option value="">All Severities</option>
                            <option value="critical">Critical</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                          </select>
                          <select
                            value={filters.status || ''}
                            onChange={(e) => setFilters(prev => ({ 
                              ...prev, 
                              status: e.target.value as Status || undefined 
                            }))}
                            className="rounded-lg border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                          >
                            <option value="">All Statuses</option>
                            <option value="reported">Reported</option>
                            <option value="inProgress">In Progress</option>
                            <option value="resolved">Resolved</option>
                          </select>
                        </div>
                      )}
                      <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm">
                        <button
                          onClick={() => setView('grid')}
                          className={`p-2 rounded-md transition-colors ${
                            view === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setView('list')}
                          className={`p-2 rounded-md transition-colors ${
                            view === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {showReportForm ? (
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Report New Crisis</h2>
                        <button
                          onClick={() => setShowReportForm(false)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <CrisisForm onSubmit={handleReportCrisis} />
                    </div>
                  ) : (
                    <>
                      {error && (
                        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                          <p className="text-sm text-red-700">{error}</p>
                        </div>
                      )}

                      {loading ? (
                        <div className={view === 'grid' 
                          ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                          : "space-y-4"
                        }>
                          {[...Array(6)].map((_, i) => (
                            <Shimmer key={i} className="h-64" />
                          ))}
                        </div>
                      ) : crises.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                          <div className="text-gray-500 text-lg mb-4">No crises reported yet</div>
                          <button 
                            onClick={() => setShowReportForm(true)}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                          >
                            Report New Crisis
                          </button>
                        </div>
                      ) : (
                        <div className={view === 'grid'
                          ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                          : "space-y-4"
                        }>
                          {crises.map((crisis) => (
                            <CrisisCard
                              key={crisis.id}
                              crisis={crisis}
                              isAdmin={isAdmin}
                              onRefresh={fetchCrises}
                              view={view}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </main>
              </div>
            ) : (
              <div className="min-h-screen bg-gradient-to-br from-blue-800 via-indigo-900 to-purple-900">
                <Header />
                <main className="relative">
                  <div 
                    className="absolute inset-0 z-0 opacity-10 bg-cover bg-center"
                    style={{
                      backgroundImage: 'url("https://media.licdn.com/dms/image/v2/C5612AQH9UdhcKdxOBg/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1590443075736?e=2147483647&v=beta&t=lo83dutXjx9dcJ02Wm8TI20Mm-hCleEe8nhLWln7hy8")'
                    }}
                  />

                  <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
                    {!showLearnMore ? (
                      <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="flex-1 text-white">
                          <div className="relative">
                            <div className="absolute -top-4 -left-4 w-20 h-20 bg-blue-500/20 rounded-full blur-xl" />
                            <h1 className="relative text-5xl font-bold mb-6 leading-tight">
                              Rapid Response Crisis Management System
                            </h1>
                          </div>
                          <p className="text-xl mb-8 text-blue-100">
                            Connect, report, and manage crises in real-time. Join our platform to make a difference in emergency response and crisis management.
                          </p>
                          <div className="space-y-4 sm:space-y-0 sm:space-x-4">
                            <button 
                              onClick={handleSignInClick}
                              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-500 shadow-lg transition-all duration-200"
                            >
                              Sign In to Continue
                            </button>
                            <button 
                              onClick={() => setShowLearnMore(true)}
                              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border-2 border-blue-400 text-base font-medium rounded-lg text-blue-400 hover:bg-blue-400/10 transition-all duration-200"
                            >
                              Learn More
                            </button>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="relative">
                            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 text-white border border-white/10">
                              <h3 className="text-2xl font-semibold mb-6">Key Features</h3>
                              <ul className="space-y-4">
                                <li className="flex items-start">
                                  <img
                                    src="https://images.unsplash.com/photo-1584467735867-4297ae2ebcee?auto=format&fit=crop&q=80&w=100"
                                    alt="Real-time tracking"
                                    className="w-12 h-12 rounded-lg object-cover mr-4"
                                  />
                                  <div>
                                    <h4 className="font-semibold mb-1">Real-time Tracking</h4>
                                    <p className="text-sm text-blue-200">Monitor incidents as they happen</p>
                                  </div>
                                </li>
                                <li className="flex items-start">
                                  <img
                                    src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=1902&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?auto=format&fit=crop&q=80&w=100"
                                    alt="Documentation"
                                    className="w-12 h-12 rounded-lg object-cover mr-4"
                                  />
                                  <div>
                                    <h4 className="font-semibold mb-1">Rich Documentation</h4>
                                    <p className="text-sm text-blue-200">Comprehensive incident records</p>
                                  </div>
                                </li>
                                <li className="flex items-start">
                                  <img
                                    src="https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&q=80&w=100"
                                    alt="Analytics"
                                    className="w-12 h-12 rounded-lg object-cover mr-4"
                                  />
                                  <div>
                                    <h4 className="font-semibold mb-1">Advanced Analytics</h4>
                                    <p className="text-sm text-blue-200">Data-driven insights</p>
                                  </div>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white">
                        <button 
                          onClick={() => setShowLearnMore(false)}
                          className="mb-6 inline-flex items-center text-sm hover:text-blue-200"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                          Back to Home
                        </button>
                        
                        <h2 className="text-4xl font-bold mb-8">About CrisisConnect</h2>
                        
                        <div className="space-y-8">
                          <section>
                            <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
                            <p className="text-lg text-blue-100">
                              CrisisConnect is dedicated to streamlining crisis management and emergency response through innovative technology. 
                              We provide a comprehensive platform that enables quick reporting, efficient tracking, and effective resolution of crisis situations.
                            </p>
                          </section>

                          <section>
                            <h3 className="text-2xl font-semibold mb-4">How It Works</h3>
                            <div className="grid md:grid-cols-3 gap-6">
                              <div className="bg-white/5 p-6 rounded-xl">
                                <div className="text-xl font-semibold mb-2">1. Report</div>
                                <p>Quickly report crises with detailed information, location data, and supporting media.</p>
                              </div>
                              <div className="bg-white/5 p-6 rounded-xl">
                                <div className="text-xl font-semibold mb-2">2. Track</div>
                                <p>Monitor crisis status in real-time with updates, comments, and progress tracking.</p>
                              </div>
                              <div className="bg-white/5 p-6 rounded-xl">
                                <div className="text-xl font-semibold mb-2">3. Resolve</div>
                                <p>Coordinate response efforts and mark crises as resolved when handled.</p>
                              </div>
                            </div>
                          </section>

                          <section>
                            <h3 className="text-2xl font-semibold mb-4">Key Benefits</h3>
                            <ul className="grid md:grid-cols-2 gap-4">
                              <li className="flex items-start">
                                <svg className="h-6 w-6 text-blue-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Centralized crisis management system</span>
                              </li>
                              <li className="flex items-start">
                                <svg className="h-6 w-6 text-blue-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Real-time status updates and notifications</span>
                              </li>
                              <li className="flex items-start">
                                <svg className="h-6 w-6 text-blue-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Secure data handling and storage</span>
                              </li>
                              <li className="flex items-start">
                                <svg className="h-6 w-6 text-blue-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Advanced analytics and reporting</span>
                              </li>
                            </ul>
                          </section>

                          <div className="mt-8 text-center">
                            <p className="text-lg mb-4">Ready to get started?</p>
                            <button 
                              onClick={handleSignInClick}
                              className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-lg text-blue-900 bg-white hover:bg-blue-50 shadow-lg transition-all duration-200"
                            >
                              Sign In Now
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </main>
              </div>
            )
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;