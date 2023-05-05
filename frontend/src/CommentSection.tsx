import React, { useState, useEffect } from 'react';
import './includes/main.css';
import CourseRating from './CourseRating';
import DifficultyRating from './DifficultyRating';
import GetStar from './GetStar';

type Comment = {
    id: number;
    user_id: number;
    user_name: string;
    course_id: number;
    rating: number;
    difficulty: number;
    comment: string;
    datetime: string;
};

type CommentSectionProps = {
    courseName: string;
};

const CommentSection: React.FC<CommentSectionProps> = ({ courseName }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [rating, setRating] = useState(0);
    const [difficulty, setDifficulty] = useState(0);

    // Fetch comments for the specific courseName
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await fetch(`/api/comments/${courseName}`);
                const data = await response.json();
                setComments(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchComments();
    }, [courseName]);

    const handleCommentSubmit = async () => {
        try {
            const response = await fetch('/api/add-comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    course_name: courseName,
                    comment: newComment,
                    rating,
                    difficulty,
                }),
            });

            if (response.ok) {
                const newCommentObj = await response.json();
                setComments([...comments, newCommentObj]);
                setNewComment('');
                setRating(0);
                window.location.reload();
            } else {
                console.error('Error adding comment');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="comment-section">
            <hr></hr>
            <div className="comment-input">
                <h3 style={{marginBottom: 0, marginTop: 0}}>Course Rating: &nbsp;
                    <CourseRating onRating={(newRating) => setRating(newRating)} /> </h3>
                <h3 style={{marginTop: 0}}>Difficulty Rating: &nbsp;
                    <DifficultyRating onRating={(newRating) => setDifficulty(newRating)} /> </h3>
                <textarea
                    value={newComment}
                    className="comment-input-box"
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write your comment here..."
                />
                <button style={{ width: "30%", marginBottom:'10px'}} className="custom-btn btn-1" onClick={handleCommentSubmit}>Submit</button>
            </div>
            <hr></hr>
            <h2>Latest Comments</h2>
            <ul className="comment-list">
                {comments.map((comment) => (
                    <li key={comment.id}>
                        <p>
                            <strong>{comment.user_name}</strong> {comment.datetime} <br /> Course Rating: <GetStar rating={comment.rating} /><br /> Difficulty Rating: <GetStar rating={comment.difficulty} /><br /> {comment.comment}<br />  
                        </p>
                    </li>
                ))}
            </ul>

        </div>
    );
};

export default CommentSection;
