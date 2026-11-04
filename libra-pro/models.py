from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from datetime import datetime

db = SQLAlchemy()

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), default='member')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text)

class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    author = db.Column(db.String(100), nullable=False)
    isbn = db.Column(db.String(20), unique=True)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'))
    category = db.relationship('Category', backref='books')
    publisher = db.Column(db.String(100))
    year = db.Column(db.Integer)
    copies = db.Column(db.Integer, default=1)
    available = db.Column(db.Integer, default=1)
    cover_url = db.Column(db.String(300))
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Member(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True)
    phone = db.Column(db.String(20))
    membership_type = db.Column(db.String(20), default='standard')
    joined_at = db.Column(db.DateTime, default=datetime.utcnow)
    active = db.Column(db.Boolean, default=True)
    address = db.Column(db.String(200))

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)
    member_id = db.Column(db.Integer, db.ForeignKey('member.id'), nullable=False)
    issued_at = db.Column(db.DateTime, default=datetime.utcnow)
    due_date = db.Column(db.DateTime)
    returned_at = db.Column(db.DateTime)
    status = db.Column(db.String(20), default='issued')
    fine = db.Column(db.Float, default=0.0)
    fine_paid = db.Column(db.Boolean, default=False)
    book = db.relationship('Book', backref='transactions')
    member = db.relationship('Member', backref='transactions')

class Reservation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)
    member_id = db.Column(db.Integer, db.ForeignKey('member.id'), nullable=False)
    reserved_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='active')
    book = db.relationship('Book', backref='reservations')
    member = db.relationship('Member', backref='reservations')

class ActivityLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    action = db.Column(db.String(200), nullable=False)
    details = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user = db.relationship('User', backref='logs')

class LibrarySettings(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    default_loan_days = db.Column(db.Integer, default=14)
    fine_per_day = db.Column(db.Float, default=5.0)
    max_books_per_member = db.Column(db.Integer, default=5)
    library_name = db.Column(db.String(100), default='LibraPro Library')
