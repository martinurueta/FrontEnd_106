from flask import Flask, request, jsonify, session, redirect, url_for
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import joinedload
from sqlalchemy.exc import IntegrityError
from werkzeug.security import generate_password_hash, check_password_hash
import datetime

app = Flask(__name__)

# Configure the SQLAlchemy database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = "I like men"

db = SQLAlchemy(app)

# User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

    def __repr__(self):
        return f"<User {self.username}>"
    
    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return self.id

class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    average_rating = db.Column(db.String(120), nullable=False)
    description = db.Column(db.String(120), nullable=False)
    textbook = db.Column(db.String(120), nullable=False)
    professor = db.Column(db.String(120), nullable=False)
    difficulty = db.Column(db.String(120), nullable=False)
    comments = db.relationship('Comment', backref='course', lazy=True)

    def __repr__(self):
        return f"<Course {self.name}>"

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "average_rating": self.average_rating,
            "description": self.description,
            "textbook": self.textbook,
            "professor": self.professor,
            "difficulty": self.difficulty,
            "comments": [comment.to_dict() for comment in self.comments]
        }

# make a comment model with user and the course id as well as comment other comments
class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    difficulty = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.String(120), nullable=False)
    datetime = db.Column(db.DateTime, nullable=False)

    def __init__(self, user_id, course_id, rating, difficulty, comment, datetime):
        self.user_id = user_id
        self.course_id = course_id
        self.rating = rating
        self.difficulty = difficulty
        self.comment = comment
        self.datetime = datetime

    def __repr__(self):
        return f"<Comment {self.comment}>"

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "course_id": self.course_id,
            "rating": self.rating,
            "difficulty": self.difficulty,
            "comment": self.comment,
            "datetime": self.datetime
        }
    

#upvote model
class Vote(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    comment_id = db.Column(db.Integer, nullable=False)
    vote = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f"<Vote {self.vote}>"

    
# Create the database tables
db.create_all()

login_manager = LoginManager(app)
login_manager.session_protection = "basic"

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)

# Login route
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()

    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()

    if user and check_password_hash(user.password, password):
        login_user(user)
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401

# Signup route
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()

    username = data.get('username')
    password = data.get('password')

    hashed_password = generate_password_hash(password)

    if len(username) < 6:
        return jsonify({"message": "Username must be at least 6 characters long"}), 400

    if len(password) < 5:
        return jsonify({"message": "Password must be at least 5 characters long"}), 400
    
    new_user = User(username=username, password=hashed_password)

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "Signup successful"}), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({"message": "Username already exists"}), 400
    

@app.route('/api/checkLogin', methods=['GET'])
def checkLogin():
    if current_user.is_authenticated and current_user.is_active:
        return jsonify({"message": "User is logged in"}), 200
    else:
        return jsonify({"message": "User is not logged in"}), 401


@app.route('/api/logout', methods=['GET'])
def logout():
    logout_user()
    return jsonify({"message": "Logout successful"}), 200


@app.route('/api/search-courses', methods=['GET'])
def search_courses():
    query = request.args.get('q', '')
    courses = Course.query.filter(Course.name.ilike(f"%{query}%")).all()
    result = [course.name for course in courses]  # Return only the course name
    return jsonify(result)


@app.route('/api/course/<course_name>', methods=['GET'])
def get_course(course_name):
    # Fetch course details from the database based on the course_id
    course = Course.query.filter_by(name=course_name).first()
    if course:
        return jsonify(course.to_dict())
    else:
        return jsonify({"error": "Course not found"}), 404


@app.route('/api/comments/<course_name>', methods=['GET'])
def get_comments(course_name):
    course = Course.query.filter_by(name=course_name).first()
    if course:
        # get all comments for the course and its users
        comments = Comment.query.filter_by(course_id=course.id).all()
        comments_list = []
        for comment in comments:
            user = User.query.filter_by(id=comment.user_id).first()
            comments_list.insert(0,{
                "user_name": user.username,
                "comment": comment.comment,
                "rating": comment.rating,
                "difficulty": comment.difficulty,
                "datetime": comment.datetime.strftime("%d %b %Y %I:%M %p")
            })
        return jsonify(comments_list)
    else:
        return jsonify({"error": "Course not found"}), 404


@app.route('/api/add-comment', methods=['POST'])
def add_comment():
    data = request.get_json()
    course_name = data.get('course_name')
    comment = data.get('comment')
    rating = data.get('rating')
    difficulty = data.get('difficulty')

    course = Course.query.filter_by(name=course_name).first()
    if course:
        new_comment = Comment(user_id=current_user.id, course_id=course.id, rating=rating, difficulty=difficulty, comment=comment, datetime=datetime.datetime.now())
        db.session.add(new_comment)
        db.session.commit()

        all_ratings = [c.rating for c in course.comments]
        new_average = round(sum(all_ratings) / len(all_ratings), 2)
        course.average_rating = str(new_average)
        db.session.commit()

        all_difficulties = [c.difficulty for c in course.comments]
        new_difficulty = round(sum(all_difficulties) / len(all_difficulties), 2)
        course.difficulty = str(new_difficulty)
        db.session.commit()

        return jsonify({"message": "Comment added successfully"}), 201
    else:
        return jsonify({"error": "Course not found"}), 404
    


if __name__ == '__main__':
    app.run(debug=True)
