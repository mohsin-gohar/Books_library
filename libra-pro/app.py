from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
from models import db, User, Book, Member, Transaction
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'premium-library-secret-key-2026'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///library.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    return db.session.get(User, int(user_id))

def create_tables():
    with app.app_context():
        db.create_all()
        if not User.query.filter_by(username='admin').first():
            admin = User(username='admin', email='admin@library.com', password=generate_password_hash('admin123'), role='admin')
            db.session.add(admin)
            books = [
                Book(title='The Great Gatsby', author='F. Scott Fitzgerald', isbn='9780743273565', category='Fiction', publisher='Scribner', year=1925, copies=5, available=5, description='Classic American novel.'),
                Book(title='To Kill a Mockingbird', author='Harper Lee', isbn='9780061120084', category='Fiction', publisher='J.B. Lippincott', year=1960, copies=4, available=4, description='Pulitzer Prize winner.'),
                Book(title='1984', author='George Orwell', isbn='9780451524935', category='Dystopian', publisher='Secker & Warburg', year=1949, copies=6, available=6, description='Totalitarian future.'),
                Book(title='Pride and Prejudice', author='Jane Austen', isbn='9780141439518', category='Romance', publisher='T. Egerton', year=1813, copies=3, available=3, description='Timeless romance.'),
                Book(title='The Catcher in the Rye', author='J.D. Salinger', isbn='9780316769488', category='Fiction', publisher='Little, Brown', year=1951, copies=4, available=4, description='Coming of age story.'),
                Book(title='Clean Code', author='Robert C. Martin', isbn='9780132350884', category='Technology', publisher='Prentice Hall', year=2008, copies=2, available=2, description='Software craftsmanship.'),
                Book(title='Atomic Habits', author='James Clear', isbn='9780735211292', category='Self-Help', publisher='Avery', year=2018, copies=5, available=5, description='Tiny changes, remarkable results.'),
            ]
            for b in books: db.session.add(b)
            members = [
                Member(name='Ali Khan', email='ali@example.com', phone='03001234567', membership_type='premium'),
                Member(name='Sara Ahmed', email='sara@example.com', phone='03007654321', membership_type='standard'),
                Member(name='Usman Malik', email='usman@example.com', phone='03009876543', membership_type='premium'),
            ]
            for m in members: db.session.add(m)
            db.session.commit()

@app.route('/')
def index():
    if current_user.is_authenticated: return redirect(url_for('dashboard'))
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        user = User.query.filter_by(username=username).first()
        if user and check_password_hash(user.password, password):
            login_user(user)
            flash('Login successful!', 'success')
            return redirect(url_for('dashboard'))
        flash('Invalid credentials', 'danger')
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

@app.route('/dashboard')
@login_required
def dashboard():
    total_books = Book.query.count()
    total_members = Member.query.count()
    issued = Transaction.query.filter_by(status='issued').count()
    overdue = Transaction.query.filter(Transaction.status == 'issued', Transaction.due_date < datetime.utcnow()).count()
    recent_transactions = Transaction.query.order_by(Transaction.issued_at.desc()).limit(8).all()
    categories = db.session.query(Book.category, db.func.count(Book.id)).group_by(Book.category).all()
    return render_template('dashboard.html', total_books=total_books, total_members=total_members, issued=issued, overdue=overdue, recent=recent_transactions, categories=categories)

@app.route('/books')
@login_required
def books():
    search = request.args.get('search', '')
    category = request.args.get('category', '')
    query = Book.query
    if search: query = query.filter(Book.title.contains(search) | Book.author.contains(search) | Book.isbn.contains(search))
    if category: query = query.filter_by(category=category)
    books = query.order_by(Book.title).all()
    categories = db.session.query(Book.category).distinct().all()
    return render_template('books.html', books=books, categories=[c[0] for c in categories if c[0]], search=search)

@app.route('/books/add', methods=['GET', 'POST'])
@login_required
def add_book():
    if current_user.role not in ['admin', 'librarian']:
        flash('Permission denied', 'danger')
        return redirect(url_for('books'))
    if request.method == 'POST':
        book = Book(title=request.form['title'], author=request.form['author'], isbn=request.form['isbn'], category=request.form['category'], publisher=request.form.get('publisher'), year=int(request.form.get('year') or 0), copies=int(request.form.get('copies') or 1), available=int(request.form.get('copies') or 1), description=request.form.get('description'))
        db.session.add(book)
        db.session.commit()
        flash('Book added successfully', 'success')
        return redirect(url_for('books'))
    return render_template('book_form.html', book=None)

@app.route('/books/edit/<int:id>', methods=['GET', 'POST'])
@login_required
def edit_book(id):
    if current_user.role not in ['admin', 'librarian']:
        flash('Permission denied', 'danger')
        return redirect(url_for('books'))
    book = Book.query.get_or_404(id)
    if request.method == 'POST':
        book.title = request.form['title']
        book.author = request.form['author']
        book.isbn = request.form['isbn']
        book.category = request.form['category']
        book.publisher = request.form.get('publisher')
        book.year = int(request.form.get('year') or 0)
        book.copies = int(request.form.get('copies') or 1)
        book.description = request.form.get('description')
        db.session.commit()
        flash('Book updated', 'success')
        return redirect(url_for('books'))
    return render_template('book_form.html', book=book)

@app.route('/books/delete/<int:id>')
@login_required
def delete_book(id):
    if current_user.role != 'admin':
        flash('Only admin can delete', 'danger')
        return redirect(url_for('books'))
    book = Book.query.get_or_404(id)
    db.session.delete(book)
    db.session.commit()
    flash('Book deleted', 'success')
    return redirect(url_for('books'))

@app.route('/members')
@login_required
def members():
    members = Member.query.order_by(Member.name).all()
    return render_template('members.html', members=members)

@app.route('/members/add', methods=['GET', 'POST'])
@login_required
def add_member():
    if current_user.role not in ['admin', 'librarian']:
        flash('Permission denied', 'danger')
        return redirect(url_for('members'))
    if request.method == 'POST':
        member = Member(name=request.form['name'], email=request.form['email'], phone=request.form.get('phone'), membership_type=request.form.get('membership_type', 'standard'))
        db.session.add(member)
        db.session.commit()
        flash('Member added', 'success')
        return redirect(url_for('members'))
    return render_template('member_form.html', member=None)

@app.route('/issue')
@login_required
def issue_page():
    books = Book.query.filter(Book.available > 0).all()
    members = Member.query.filter_by(active=True).all()
    return render_template('issue.html', books=books, members=members)

@app.route('/issue/do', methods=['POST'])
@login_required
def do_issue():
    book_id = request.form.get('book_id')
    member_id = request.form.get('member_id')
    days = int(request.form.get('days', 14))
    book = Book.query.get(book_id)
    if not book or book.available <= 0:
        flash('Book not available', 'danger')
        return redirect(url_for('issue_page'))
    txn = Transaction(book_id=book_id, member_id=member_id, due_date=datetime.utcnow() + timedelta(days=days), status='issued')
    book.available -= 1
    db.session.add(txn)
    db.session.commit()
    flash('Book issued successfully', 'success')
    return redirect(url_for('transactions'))

@app.route('/return/<int:id>')
@login_required
def return_book(id):
    txn = Transaction.query.get_or_404(id)
    if txn.status != 'issued':
        flash('Already returned', 'warning')
        return redirect(url_for('transactions'))
    txn.returned_at = datetime.utcnow()
    txn.status = 'returned'
    if txn.due_date and datetime.utcnow() > txn.due_date:
        days_late = (datetime.utcnow() - txn.due_date).days
        txn.fine = days_late * 5.0
    book = Book.query.get(txn.book_id)
    book.available += 1
    db.session.commit()
    flash(f'Book returned. Fine: {txn.fine}', 'success')
    return redirect(url_for('transactions'))

@app.route('/transactions')
@login_required
def transactions():
    txns = Transaction.query.order_by(Transaction.issued_at.desc()).all()
    for t in txns:
        if t.status == 'issued' and t.due_date and t.due_date < datetime.utcnow():
            t.status = 'overdue'
    db.session.commit()
    return render_template('transactions.html', transactions=txns)

@app.route('/reports')
@login_required
def reports():
    if current_user.role not in ['admin', 'librarian']:
        flash('Permission denied', 'danger')
        return redirect(url_for('dashboard'))
    return render_template('reports.html')

@app.route('/profile')
@login_required
def profile():
    return render_template('profile.html')

@app.route('/scan')
@login_required
def scan():
    return render_template('scan.html')

@app.route('/api/book-by-isbn/<isbn>')
@login_required
def book_by_isbn(isbn):
    clean_isbn = ''.join(c for c in isbn if c.isdigit() or c.upper() == 'X')
    book = Book.query.filter(
        (Book.isbn == isbn) | (Book.isbn == clean_isbn) | (Book.isbn.like(f'%{clean_isbn}%'))
    ).first()
    if book:
        return jsonify({
            'found': True,
            'book': {
                'id': book.id,
                'title': book.title,
                'author': book.author,
                'isbn': book.isbn,
                'category': book.category,
                'year': book.year,
                'available': book.available,
                'copies': book.copies
            }
        })
    return jsonify({'found': False})

if __name__ == '__main__':
    create_tables()
    app.run(host='0.0.0.0', port=5000, debug=True)
