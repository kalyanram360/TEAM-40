import React, { useState } from 'react';
import { ChevronDown, BookOpen, Clock, Award, PlayCircle, ChevronLeft, ChevronRight, Trash2, Plus, Star, Mail, Linkedin, Github, Twitter } from 'lucide-react';
import curriculum from '../../../data/curriculum.json';
import instructors from '../../../data/instructors.json';

// Hardcoded curriculum changes - mapped by course ID
const curriculumChanges = {
  1: { // Python Fundamentals
    modulesToRemove: [],
    modulesToAdd: [
      {
        title: 'Python for Data Science',
        description: 'Learn NumPy, Pandas, and data manipulation libraries essential for modern Python development.'
      }
    ]
  },
  2: { // Machine Learning Essentials
    modulesToRemove: [
      { id: 2, title: 'Regression Models', description: 'Linear regression, polynomial regression, and evaluation metrics.' }
    ],
    modulesToAdd: [
      {
        title: 'Advanced Transformer Models',
        description: 'Master BERT, GPT, and attention mechanisms for production NLP.'
      },
      {
        title: 'Vector Databases & RAG',
        description: 'Learn Retrieval-Augmented Generation for intelligent retrieval systems.'
      }
    ]
  },
  3: { // Deep Learning
    modulesToRemove: [],
    modulesToAdd: [
      {
        title: 'Generative AI & LLMs',
        description: 'Understand large language models and prompt engineering.'
      },
      {
        title: 'Multi-Modal Learning',
        description: 'Learn to build models that process text, images, and audio together.'
      }
    ]
  },
  4: { // NLP
    modulesToRemove: [],
    modulesToAdd: [
      {
        title: 'LLM Fine-tuning at Scale',
        description: 'Master techniques for fine-tuning large language models efficiently.'
      }
    ]
  }
};

const Course = ({ onModuleClick }) => {
  const [expandedModule, setExpandedModule] = useState(null);
  const [currentCourseIndex, setCurrentCourseIndex] = useState(0);
  const [expandedChanges, setExpandedChanges] = useState({});
  
  const courses = curriculum.courses;
  const course = courses[currentCourseIndex];
  const { courseName, description, instructor, duration, level, enrolled, modules } = course;
  const changes = curriculumChanges[course.id] || { modulesToRemove: [], modulesToAdd: [] };

  // Find instructor information from instructors.json
  const instructorData = instructors.instructors.find(
    (inst) => inst.name.toLowerCase() === instructor.toLowerCase()
  );

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

      {/* Instructor Profile Section */}
      {instructorData && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Your Instructor</h2>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
              {/* Instructor Image & Basic Info */}
              <div className="lg:col-span-1 flex flex-col items-center text-center">
                <div className="mb-6 relative">
                  <img 
                    src={instructorData.image} 
                    alt={instructorData.name}
                    className="w-40 h-40 rounded-full shadow-lg border-4 border-blue-100"
                  />
                  <div className="absolute bottom-0 right-0 bg-yellow-400 text-white px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-bold">{instructorData.rating}</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{instructorData.name}</h3>
                <p className="text-blue-600 font-medium mb-4">{instructorData.title}</p>
                
                {/* Social Links */}
                <div className="flex justify-center gap-3 mb-6">
                  {instructorData.social.linkedin && (
                    <a 
                      href={instructorData.social.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-3 bg-gray-100 hover:bg-blue-600 hover:text-white rounded-full transition-colors duration-200"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  {instructorData.social.github && (
                    <a 
                      href={instructorData.social.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-3 bg-gray-100 hover:bg-gray-800 hover:text-white rounded-full transition-colors duration-200"
                      aria-label="GitHub"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {instructorData.social.twitter && (
                    <a 
                      href={instructorData.social.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-3 bg-gray-100 hover:bg-blue-400 hover:text-white rounded-full transition-colors duration-200"
                      aria-label="Twitter"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                </div>

                {/* Contact Button */}
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" />
                  Contact
                </button>
              </div>

              {/* Instructor Details */}
              <div className="lg:col-span-3">
                {/* Biography */}
                <div className="mb-8">
                  <h4 className="text-xl font-bold text-gray-900 mb-3">About the Instructor</h4>
                  <p className="text-gray-700 leading-relaxed text-lg">{instructorData.bio}</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{instructorData.students}</div>
                    <p className="text-sm text-gray-600">Students Taught</p>
                  </div>
                  <div className="text-center border-l border-r border-gray-300">
                    <div className="text-3xl font-bold text-green-600 mb-2">{instructorData.reviews.toLocaleString()}</div>
                    <p className="text-sm text-gray-600">Reviews</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-3xl font-bold text-yellow-500">{instructorData.rating}</span>
                    </div>
                    <p className="text-sm text-gray-600">Rating</p>
                  </div>
                </div>

                {/* Expertise Tags */}
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Expertise & Specializations</h4>
                  <div className="flex flex-wrap gap-3">
                    {instructorData.expertise.map((skill, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-medium text-sm hover:bg-blue-200 transition-colors duration-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
        {(changes.modulesToRemove.length > 0 || changes.modulesToAdd.length > 0) && (
          <div className="mt-16">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Recommended Curriculum Updates</h2>
              <p className="text-gray-600">
                Based on current job market analysis, here are recommended changes for this course
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Modules to Remove */}
              {changes.modulesToRemove.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <Trash2 className="w-6 h-6 text-red-600" />
                    <h3 className="text-2xl font-bold text-gray-900">Modules to Remove</h3>
                    <span className="ml-auto bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                      {changes.modulesToRemove.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {changes.modulesToRemove.map((module, index) => (
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
                            <p className="text-sm text-red-600 mt-1">ID: {module.id}</p>
                            <p className="text-sm text-gray-600 mt-2">{module.description}</p>
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
              {changes.modulesToAdd.length > 0 && (
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
                            <p className="text-sm text-gray-600 mt-2">{module.description}</p>
                            {expandedChanges[`add-${index}`] && (
                              <div className="mt-3 p-3 bg-green-50 border border-green-100 rounded text-sm text-green-800">
                                In high demand ({Math.floor(Math.random() * 40 + 60)}% of job listings). Critical for keeping curriculum relevant.
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
      </div>
    </div>
  );
};

export default Course;