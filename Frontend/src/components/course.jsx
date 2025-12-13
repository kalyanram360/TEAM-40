import React, { useState, useEffect } from 'react';
import { ChevronDown, BookOpen, Clock, Award, PlayCircle, ChevronLeft, ChevronRight, Trash2, Plus } from 'lucide-react';
import curriculum from '../../../data/curriculum.json';

const Course = ({ onModuleClick }) => {
  const [expandedModule, setExpandedModule] = useState(null);
  const [currentCourseIndex, setCurrentCourseIndex] = useState(0);
  const [expandedChanges, setExpandedChanges] = useState({});
  const [gapAnalysisResults, setGapAnalysisResults] = useState({});
  const [loading, setLoading] = useState(true);
  
  // Load gap analysis results from RAG system
  useEffect(() => {
    const loadGapAnalysis = async () => {
      try {
        const results = {};
        
        // Try to load gap analysis for each course
        for (const course of curriculum.courses) {
          // Try multiple possible paths for the gap analysis files
          const paths = [
            `/gap_analysis_${course.id}.json`, // Frontend public folder (preferred)
            `../../RAG_System/gap_analysis_${course.id}.json`, // Relative to Frontend folder
          ];
          
          let loaded = false;
          for (const path of paths) {
            try {
              console.log(`Trying to fetch gap analysis from: ${path}`);
              const response = await fetch(path);
              if (response.ok) {
                const data = await response.json();
                results[course.id] = data;
                console.log(`✓ Successfully loaded gap analysis for course ${course.id} from ${path}`);
                loaded = true;
                break;
              }
            } catch (err) {
              console.log(`✗ Failed to fetch from ${path}`);
              // Try next path
            }
          }
          
          if (!loaded) {
            // No gap analysis file found, use empty defaults
            console.warn(`No gap analysis file found for course ${course.id}, using defaults`);
            results[course.id] = {
              modulesToDelete: [],
              modulesToAdd: []
            };
          }
        }
        
        console.log('Gap analysis results loaded:', results);
        setGapAnalysisResults(results);
      } catch (error) {
        console.error('Error loading gap analysis results:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadGapAnalysis();
  }, []);
  
  const courses = curriculum.courses;
  const course = courses[currentCourseIndex];
  const { id, courseName, description, instructor, duration, level, enrolled, modules } = course;
  const changes = gapAnalysisResults[id] || { modulesToDelete: [], modulesToAdd: [] };

  const toggleModule = (moduleId) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  const nextCourse = () => {
    setCurrentCourseIndex((prev) => (prev + 1) % courses.length);
    setExpandedModule(null);
  };

  const prevCourse = () => {
    setCurrentCourseIndex((prev) => (prev - 1 + courses.length) % courses.length);
    setExpandedModule(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Course Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                {curriculum.track} Track • Course {currentCourseIndex + 1} of {courses.length}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={prevCourse}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                aria-label="Previous course"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex gap-1">
                {courses.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentCourseIndex(index);
                      setExpandedModule(null);
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === currentCourseIndex ? 'bg-blue-600 w-8' : 'bg-gray-300'
                    }`}
                    aria-label={`Go to course ${index + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={nextCourse}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                aria-label="Next course"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="mb-4">
            <span className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-medium">
              {level}
            </span>
          </div>
          <h1 className="text-5xl font-bold mb-6 leading-tight">{courseName}</h1>
          <p className="text-xl text-blue-50 mb-8 max-w-3xl leading-relaxed">{description}</p>
          
          {/* Course Stats */}
          <div className="flex flex-wrap gap-8 text-sm">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              <span>{modules.length} Modules</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              <span>By {instructor}</span>
            </div>
            <div className="flex items-center gap-2">
              <PlayCircle className="w-5 h-5" />
              <span>{enrolled}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Course Curriculum Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Course Curriculum</h2>
          <p className="text-gray-600">
            {modules.length} modules • Expand each module to see detailed descriptions
          </p>
        </div>

        {/* Modules List */}
        <div className="space-y-4">
          {modules && modules.length > 0 ? (
            modules.map((module, index) => (
              <div
                key={module.id}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-xl"
              >
                {/* Module Header - Always Visible */}
                <div
                  className="p-6 cursor-pointer"
                  onClick={() => toggleModule(module.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold text-sm">
                          {index + 1}
                        </span>
                        <h3 className="text-xl font-semibold text-gray-900">{module.title}</h3>
                      </div>
                      <p className="text-gray-600 mb-3 ml-13">{module.shortDescription}</p>
                      <div className="flex gap-4 text-sm text-gray-500 ml-13">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {module.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {module.lessons} lessons
                        </span>
                      </div>
                    </div>
                    <button
                      className={`ml-4 p-2 rounded-full hover:bg-gray-100 transition-all duration-300 ${
                        expandedModule === module.id ? 'rotate-180 bg-gray-100' : ''
                      }`}
                      aria-label={expandedModule === module.id ? 'Collapse module' : 'Expand module'}
                    >
                      <ChevronDown className="w-6 h-6 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Expanded Content */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    expandedModule === module.id ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                    <div className="ml-13 bg-blue-50 rounded-lg p-5">
                      <h4 className="font-semibold text-gray-900 mb-3">What you'll learn:</h4>
                      <p className="text-gray-700 leading-relaxed">{module.fullDescription}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onModuleClick) {
                            onModuleClick(module.id, module.title);
                          }
                        }}
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                      >
                        Start Module
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-xl shadow-md">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No modules available for this course.</p>
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-3">Ready to Start Learning?</h3>
          <p className="mb-6 text-blue-50">Join thousands of students mastering React</p>
          <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200 shadow-lg">
            Enroll Now
          </button>
        </div>

        {/* Curriculum Updates Section */}
        {!loading && (changes.modulesToDelete?.length > 0 || changes.modulesToAdd?.length > 0) && (
          <div className="mt-16">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Recommended Curriculum Updates</h2>
              <p className="text-gray-600">
                Based on current job market analysis, here are recommended changes for this course
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Modules to Remove */}
              {changes.modulesToDelete && changes.modulesToDelete.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <Trash2 className="w-6 h-6 text-red-600" />
                    <h3 className="text-2xl font-bold text-gray-900">Modules to Remove</h3>
                    <span className="ml-auto bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                      {changes.modulesToDelete.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {changes.modulesToDelete.map((module, index) => (
                      <div
                        key={index}
                        onClick={() => setExpandedChanges(prev => ({ ...prev, [`remove-${index}`]: !prev[`remove-${index}`] }))}
                        className="bg-white border-2 border-red-200 rounded-lg p-5 cursor-pointer hover:shadow-lg hover:border-red-400 transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{module.title}</h4>
                            {module.id && <p className="text-sm text-red-600 mt-1">ID: {module.id}</p>}
                            {module.reason && <p className="text-sm text-gray-600 mt-2">{module.reason}</p>}
                            {expandedChanges[`remove-${index}`] && (
                              <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded text-sm text-red-800">
                                Less relevant based on job market demand. Consider archiving instead of deletion.
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modules to Add */}
              {changes.modulesToAdd && changes.modulesToAdd.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <Plus className="w-6 h-6 text-green-600" />
                    <h3 className="text-2xl font-bold text-gray-900">Modules to Add</h3>
                    <span className="ml-auto bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                      {changes.modulesToAdd.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {changes.modulesToAdd.map((module, index) => (
                      <div
                        key={index}
                        onClick={() => setExpandedChanges(prev => ({ ...prev, [`add-${index}`]: !prev[`add-${index}`] }))}
                        className="bg-white border-2 border-green-200 rounded-lg p-5 cursor-pointer hover:shadow-lg hover:border-green-400 transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                            <Plus className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{module.title}</h4>
                            {module.skills && (
                              <p className="text-sm text-green-600 mt-1">
                                Skills: {module.skills.join(', ')}
                              </p>
                            )}
                            {module.reason && <p className="text-sm text-gray-600 mt-2">{module.reason}</p>}
                            {module.description && !module.reason && <p className="text-sm text-gray-600 mt-2">{module.description}</p>}
                            {expandedChanges[`add-${index}`] && (
                              <div className="mt-3 p-3 bg-green-50 border border-green-100 rounded text-sm text-green-800">
                                In high demand based on job market analysis. Critical for keeping curriculum relevant.
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4 flex-wrap">
              <button className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors duration-200">
                Approve Changes
              </button>
              <button className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-200">
                Review Later
              </button>
            </div>
          </div>
        )}
        
        {loading && (
          <div className="mt-16 text-center py-8">
            <p className="text-gray-500">Loading curriculum recommendations...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Course;