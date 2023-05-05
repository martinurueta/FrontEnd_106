import React, { useState } from 'react';
import './includes/main.css';
import { NavLink } from 'react-router-dom';

const HomePage: React.FC = () => {
    const [count, setCount] = useState(0);

    return (
        <div>
            <div className="course-page-wrapper">
                <div className="container">
                    <form>
                        <h1>Learn More about Classes</h1>
                        <p> CourseTalk is an app that empowers students to share their
                            experiences by reviewing college courses and professors. Users
                            can create an account, then post public reviews detailing their
                            thoughts on course content, teaching style, and overall satisfaction.
                            CourseTalk aggregates these reviews, calculating an average
                            rating for each course and professor. Additionally, users can engage
                            in discussions by commenting on others' reviews, fostering a
                            transparent and collaborative learning community. This platform not
                            only helps students make informed decisions when choosing
                            courses, but also provides valuable feedback for educators to
                            improve their teaching practices.</p>
                        <NavLink to="/login">
                            <button className="custom-btn btn-1 btn btn-primary">Login</button>
                        </NavLink>
                    </form>

                </div>
            </div>
        </div>
    );
};

export default HomePage;
