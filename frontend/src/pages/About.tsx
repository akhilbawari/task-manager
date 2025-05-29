import React from 'react';
import { Calendar, Clock, Users, Zap, Brain, MessageSquare, Target, CheckCircle } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Smart Task Manager
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              AI-powered task management solution that understands natural language and converts meeting minutes into actionable tasks
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
                <Brain className="h-5 w-5" />
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
                <MessageSquare className="h-5 w-5" />
                <span>Natural Language</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
                <Target className="h-5 w-5" />
                <span>Smart Parsing</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Features Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Natural Language Task Manager */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 rounded-lg p-2">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Natural Language Task Manager</h2>
              </div>
            </div>
            <div className="p-8">
              <p className="text-gray-600 mb-6 text-lg">
                Transform casual language into organized tasks with intelligent parsing and automatic extraction.
              </p>
              
              <div className="space-y-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-2">Example Input:</p>
                  <p className="text-gray-800 italic">"Finish landing page Aman by 11pm 20th June"</p>
                </div>
                <div className="text-center">
                  <div className="inline-block bg-blue-100 rounded-full p-2">
                    <Brain className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                  <p className="text-sm text-emerald-600 mb-2">Parsed Output:</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Task:</span>
                      <span>Finish landing page</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Assignee:</span>
                      <span>Aman</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Due:</span>
                      <span>11:00 PM, 20 June</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Priority:</span>
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">P3</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-800">Smart Extraction</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Target className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-800">Auto Priority</p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Meeting Minutes Converter */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
            <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-6">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 rounded-lg p-2">
                  <MessageSquare className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">AI Meeting Minutes Converter</h2>
              </div>
            </div>
            <div className="p-8">
              <p className="text-gray-600 mb-6 text-lg">
                Paste entire meeting transcripts and automatically extract all tasks, assignments, and deadlines.
              </p>
              
              <div className="space-y-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-2">Example Transcript:</p>
                  <div className="text-gray-800 text-sm space-y-1">
                    <p>"Aman you take the landing page by 10pm tomorrow."</p>
                    <p>"Rajeev you take care of client follow-up by Wednesday."</p>
                    <p>"Shreya please review the marketing deck tonight."</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="inline-block bg-purple-100 rounded-full p-2">
                    <Brain className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="bg-violet-50 rounded-lg p-4 border border-violet-200">
                  <p className="text-sm text-violet-600 mb-3">Auto-Generated Tasks:</p>
                  <div className="space-y-3">
                    {[
                      { task: "Take the landing page", assignee: "Aman", due: "10:00 PM, Tomorrow" },
                      { task: "Client follow-up", assignee: "Rajeev", due: "Wednesday" },
                      { task: "Review marketing deck", assignee: "Shreya", due: "Tonight" }
                    ].map((item, idx) => (
                      <div key={idx} className="bg-white rounded-lg p-3 border">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-800">{item.task}</span>
                          <span className="bg-violet-100 text-violet-800 px-2 py-1 rounded text-xs">P3</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {item.assignee} • {item.due}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-violet-50 rounded-lg">
                  <Users className="h-6 w-6 text-violet-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-800">Multi-Assignee</p>
                </div>
                <div className="text-center p-4 bg-pink-50 rounded-lg">
                  <Calendar className="h-6 w-6 text-pink-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-800">Smart Deadlines</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Creator Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="lg:flex">
            <div className="lg:flex-shrink-0 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 lg:w-80 flex items-center justify-center p-12">
              <div className="relative">
                <div className="h-48 w-48 rounded-full bg-white p-3 shadow-2xl">
                  <div className="h-full w-full rounded-full bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 flex items-center justify-center text-white text-7xl font-bold shadow-inner">
                    AB
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg">
                  <Brain className="h-8 w-8 text-indigo-600" />
                </div>
              </div>
            </div>
            
            <div className="p-12 lg:flex-1">
              <div className="uppercase tracking-wide text-sm text-indigo-600 font-semibold mb-2">Creator & AI Engineer</div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Akhil Bawari</h2>
              <p className="text-xl text-indigo-600 font-medium mb-8">Future AI Engineer</p>
              
              <div className="text-gray-700 space-y-6 text-lg leading-relaxed">
                <p>
                  Passionate about artificial intelligence and its applications in solving real-world problems. 
                  As a future AI engineer, I'm dedicated to creating innovative solutions that leverage the power of 
                  machine learning and natural language processing to enhance productivity and simplify complex tasks.
                </p>
                
                <p>
                  This enterprise-grade task manager demonstrates my commitment to combining AI with practical utility, 
                  creating tools that understand human language and help organizations manage their workflow efficiently. 
                  The application showcases advanced parsing capabilities and intelligent task extraction from both 
                  individual inputs and meeting transcripts.
                </p>
                
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="font-semibold text-gray-900 mb-3">Key Innovations:</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 rounded-lg p-2">
                        <Brain className="h-5 w-5 text-blue-600" />
                      </div>
                      <span>Natural Language Processing</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-100 rounded-lg p-2">
                        <Target className="h-5 w-5 text-green-600" />
                      </div>
                      <span>Smart Task Extraction</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-purple-100 rounded-lg p-2">
                        <Users className="h-5 w-5 text-purple-600" />
                      </div>
                      <span>Multi-user Assignment</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-orange-100 rounded-lg p-2">
                        <Clock className="h-5 w-5 text-orange-600" />
                      </div>
                      <span>Intelligent Scheduling</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-10 flex flex-wrap gap-4">
                <a 
                  href="https://github.com/akhilbawari" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center px-6 py-3 border-2 border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                >
                  <svg className="h-5 w-5 mr-3 text-gray-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.699 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  GitHub Profile
                </a>
                <a 
                  href="https://www.linkedin.com/in/akhil-bawari-166341196" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center px-6 py-3 border-2 border-blue-300 rounded-xl shadow-sm text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 hover:border-blue-400 transition-all duration-200"
                >
                  <svg className="h-5 w-5 mr-3 text-blue-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  LinkedIn Profile
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-20 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-12 text-white">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Built with Modern Technology</h2>
            <p className="text-gray-300 text-lg">Enterprise-grade architecture for scalable task management</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI/ML Processing</h3>
              <p className="text-gray-300">Advanced natural language processing for intelligent task extraction</p>
            </div>
            <div className="text-center">
              <div className="bg-green-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Parsing</h3>
              <p className="text-gray-300">Instant conversion of natural language to structured tasks</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Analytics</h3>
              <p className="text-gray-300">Intelligent priority assignment and deadline management</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;