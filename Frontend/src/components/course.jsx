import React, { useState } from 'react';
import { ChevronDown, BookOpen, Clock, Award, PlayCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import curriculum from '../../../data/curriculum.json';

const Course = ({ onModuleClick }) => {
  const [expandedModule, setExpandedModule] = useState(null);
  const [currentCourseIndex, setCurrentCourseIndex] = useState(0);
  
  const courses = curriculum.courses;
  const course = courses[currentCourseIndex];
  const { courseName, description, instructor, duration, level, enrolled, modules } = course;

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
      </div>
    </div>
  );
};

export default Course;