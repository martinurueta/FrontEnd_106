import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CommentSection from './CommentSection';
import { NavLink } from 'react-router-dom';

interface Course {
  name: string;
  description: string;
  average_rating: number;
  textbook: string;
  professor: string;
  difficulty: number;
}

const CoursePage: React.FC = () => {
  const { courseName } = useParams<{ courseName: string }>();
  const [course, setCourse] = useState<Course | null>(null);


  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/course/${courseName}`);
        const data = await response.json();
        console.log("HERE");
        console.log(courseName);
        setCourse(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCourse();
  }, [courseName]);



  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="course-page-wrapper">
      <NavLink to="/">
      <button style={{ width: "12%", minWidth: '169px'}} className="custom-btn btn-1">
  <i className="fa fa-arrow-left"></i> &nbsp;&nbsp;&nbsp;Back to courses
</button>
</NavLink>
        <div className="course-container">
          <h1>{course.name}</h1>
          <p><h3>Description:</h3>{course.description}</p>
          <div className="course-details">
            <p><h3>Average Rating:</h3>{course.average_rating}</p>
            <p><h3>Textbook:</h3>{course.textbook}</p>
            <p><h3>Professor:</h3>{course.professor}</p>
            <p><h3>Difficulty:</h3>{course.difficulty}</p>
          </div>
        </div>
        {courseName && <CommentSection courseName={courseName} />}
      </div>
    </div>
  );
};

export default CoursePage;
