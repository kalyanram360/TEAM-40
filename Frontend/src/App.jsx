import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Navigation from './components/Navigation'
import Course from './components/course'
import JobForm from './components/JobForm'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<Course />} />
          <Route path="/post-job" element={<JobForm />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
