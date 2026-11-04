from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, Response
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
from models import db, User, Book, Member, Transaction, Category, Reservation, ActivityLog, LibrarySettings
import csv, io

app = Flask(__name__)
app.config['SECRET_KEY'] = 'premium-library-secret-key-2026'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/library.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    return db.session.get(User, int(user_id))

def log_activity(action, details=''):
    if current_user.is_authenticated:
        log = ActivityLog(user_id=current_user.id, action=action, details=details)
        db.session.add(log)
        db.session.commit()

def get_settings():
    s = LibrarySettings.query.first()
    if not s:
        s = LibrarySettings()
        db.session.add(s)
        db.session.commit()
    return s

def create_tables():
    with app.app_context():
        db.create_all()
        if not User.query.filter_by(username='admin').first():
            admin = User(username='admin', email='admin@library.com', password=generate_password_hash('admin123'), role='admin')
            db.session.add(admin)
            for c in ['Fiction', 'Non-Fiction', 'Science', 'Technology', 'Self-Help', 'Romance', 'Dystopian', 'History']:
                db.session.add(Category(name=c))
            db.session.commit()
            books_data = [
                ('The Great Gatsby', 'F. Scott Fitzgerald', '9780743273565', 'Fiction', 'Scribner', 1925, 5),
                ('To Kill a Mockingbird', 'Harper Lee', '9780061120084', 'Fiction', 'J.B. Lippincott', 1960, 4),
                ('1984', 'George Orwell', '9780451524935', 'Dystopian', 'Secker & Warburg', 1949, 6),
                ('Pride and Prejudice', 'Jane Austen', '9780141439518', 'Romance', 'T. Egerton', 1813, 3),
                ('The Catcher in the Rye', 'J.D. Salinger', '9780316769488', 'Fiction', 'Little, Brown', 1951, 4),
                ('Clean Code', 'Robert C. Martin', '9780132350884', 'Technology', 'Prentice Hall', 2008, 2),
                ('Atomic Habits', 'James Clear', '9780735211292', 'Self-Help', 'Avery', 2018, 5),
            ]
            for title, author, isbn, cat, pub, year, copies in books_data:
                category = Category.query.filter_by(name=cat).first()
                db.session.add(Book(title=title, author=author, isbn=isbn, category_id=category.id if category else None, publisher=pub, year=year, copies=copies, available=copies))
            for name, email, phone, mtype in [('Ali Khan','ali@example.com','03001234567','premium'),('Sara Ahmed','sara@example.com','03007654321','standard'),('Usman Malik','usman@example.com','03009876543','premium')]:
                db.session.add(Member(name=name, email=email, phone=phone, membership_type=mtype))
            db.session.add(LibrarySettings())
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
            log_activity('Login', f'{username} logged in')
            flash('Login successful!', 'success')
            return redirect(url_for('dashboard'))
        flash('Invalid credentials', 'danger')
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    log_activity('Logout')
    logout_user()
    return redirect(url_for('login'))

@app.route('/dashboard')
@login_required
def dashboard():
    total_books = Book.query.count()
    total_members = Member.query.count()
    issued = Transaction.query.filter_by(status='issued').count()
    overdue = Transaction.query.filter(Transaction.status == 'issued', Transaction.due_date < datetime.utcnow()).count()
    active_reservations = Reservation.query.filter_by(status='active').count()
    recent = Transaction.query.order_by(Transaction.issued_at.desc()).limit(8).all()
    categories = db.session.query(Category.name, db.func.count(Book.id)).outerjoin(Book).group_by(Category.id).all()
    return render_template('dashboard.html', total_books=total_books, total_members=total_members, issued=issued, overdue=overdue, active_reservations=active_reservations, recent=recent, categories=categories)

@app.route('/books')
@login_required
def books():
    search = request.args.get('search', '')
    category_id = request.args.get('category', '')
    query = Book.query
    if search: query = query.filter(Book.title.contains(search) | Book.author.contains(search) | Book.isbn.contains(search))
    if category_id: query = query.filter_by(category_id=category_id)
    books_list = query.order_by(Book.title).all()
    categories = Category.query.order_by(Category.name).all()
    return render_template('books.html', books=books_list, categories=categories, search=search)

@app.route('/books/add', methods=['GET', 'POST'])
@login_required
def add_book():
    if current_user.role not in ['admin', 'librarian']:
        flash('Permission denied', 'danger')
        return redirect(url_for('books'))
    if request.method == 'POST':
        book = Book(title=request.form['title'], author=request.form['author'], isbn=request.form['isbn'], category_id=request.form.get('category_id') or None, publisher=request.form.get('publisher'), year=int(request.form.get('year') or 0), copies=int(request.form.get('copies') or 1), available=int(request.form.get('copies') or 1), description=request.form.get('description'))
        db.session.add(book)
        db.session.commit()
        log_activity('Add Book', book.title)
        flash('Book added successfully', 'success')
        return redirect(url_for('books'))
    return render_template('book_form.html', book=None, categories=Category.query.all())

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
        book.category_id = request.form.get('category_id') or None
        book.publisher = request.form.get('publisher')
        book.year = int(request.form.get('year') or 0)
        book.copies = int(request.form.get('copies') or 1)
        book.description = request.form.get('description')
        db.session.commit()
        log_activity('Edit Book', book.title)
        flash('Book updated', 'success')
        return redirect(url_for('books'))
    return render_template('book_form.html', book=book, categories=Category.query.all())

@app.route('/books/delete/<int:id>')
@login_required
def delete_book(id):
    if current_user.role != 'admin':
        flash('Only admin can delete', 'danger')
        return redirect(url_for('books'))
    book = Book.query.get_or_404(id)
    db.session.delete(book)
    db.session.commit()
    log_activity('Delete Book', book.title)
    flash('Book deleted', 'success')
    return redirect(url_for('books'))

@app.route('/books/<int:id>')
@login_required
def book_detail(id):
    book = Book.query.get_or_404(id)
    txns = Transaction.query.filter_by(book_id=id).order_by(Transaction.issued_at.desc()).limit(10).all()
    return render_template('book_detail.html', book=book, transactions=txns)

@app.route('/members')
@login_required
def members():
    return render_template('members.html', members=Member.query.order_by(Member.name).all())

@app.route('/members/add', methods=['GET', 'POST'])
@login_required
def add_member():
    if current_user.role not in ['admin', 'librarian']:
        flash('Permission denied', 'danger')
        return redirect(url_for('members'))
    if request.method == 'POST':
        member = Member(name=request.form['name'], email=request.form['email'], phone=request.form.get('phone'), membership_type=request.form.get('membership_type', 'standard'), address=request.form.get('address'))
        db.session.add(member)
        db.session.commit()
        log_activity('Add Member', member.name)
        flash('Member added', 'success')
        return redirect(url_for('members'))
    return render_template('member_form.html', member=None)

@app.route('/members/<int:id>')
@login_required
def member_detail(id):
    member = Member.query.get_or_404(id)
    txns = Transaction.query.filter_by(member_id=id).order_by(Transaction.issued_at.desc()).all()
    return render_template('member_detail.html', member=member, transactions=txns)

@app.route('/issue')
@login_required
def issue_page():
    return render_template('issue.html', books=Book.query.filter(Book.available > 0).all(), members=Member.query.filter_by(active=True).all(), settings=get_settings())

@app.route('/issue/do', methods=['POST'])
@login_required
def do_issue():
    book_id = request.form.get('book_id')
    member_id = request.form.get('member_id')
    days = int(request.form.get('days', get_settings().default_loan_days))
    book = Book.query.get(book_id)
    if not book or book.available <= 0:
        flash('Book not available', 'danger')
        return redirect(url_for('issue_page'))
    txn = Transaction(book_id=book_id, member_id=member_id, due_date=datetime.utcnow() + timedelta(days=days), status='issued')
    book.available -= 1
    db.session.add(txn)
    db.session.commit()
    log_activity('Issue Book', f'{book.title} to member {member_id}')
    flash('Book issued successfully', 'success')
    return redirect(url_for('transactions'))

@app.route('/return/<int:id>')
@login_required
def return_book(id):
    txn = Transaction.query.get_or_404(id)
    if txn.status not in ['issued', 'overdue']:
        flash('Already returned', 'warning')
        return redirect(url_for('transactions'))
    settings = get_settings()
    txn.returned_at = datetime.utcnow()
    txn.status = 'returned'
    if txn.due_date and datetime.utcnow() > txn.due_date:
        days_late = (datetime.utcnow() - txn.due_date).days
        txn.fine = days_late * settings.fine_per_day
    book = Book.query.get(txn.book_id)
    book.available += 1
    db.session.commit()
    log_activity('Return Book', f'{book.title} - Fine: {txn.fine}')
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

@app.route('/overdue')
@login_required
def overdue():
    txns = Transaction.query.filter(Transaction.status.in_(['issued', 'overdue']), Transaction.due_date < datetime.utcnow()).all()
    return render_template('overdue.html', transactions=txns, now=datetime.utcnow())

@app.route('/reservations')
@login_required
def reservations():
    return render_template('reservations.html', reservations=Reservation.query.order_by(Reservation.reserved_at.desc()).all())

@app.route('/reserve', methods=['POST'])
@login_required
def do_reserve():
    r = Reservation(book_id=request.form.get('book_id'), member_id=request.form.get('member_id'))
    db.session.add(r)
    db.session.commit()
    log_activity('Reserve Book', f'Book {r.book_id} for member {r.member_id}')
    flash('Book reserved', 'success')
    return redirect(url_for('reservations'))

@app.route('/categories')
@login_required
def categories():
    if current_user.role not in ['admin', 'librarian']:
        flash('Permission denied', 'danger')
        return redirect(url_for('dashboard'))
    return render_template('categories.html', categories=Category.query.order_by(Category.name).all())

@app.route('/categories/add', methods=['POST'])
@login_required
def add_category():
    if current_user.role not in ['admin', 'librarian']:
        return redirect(url_for('categories'))
    name = request.form.get('name')
    if name and not Category.query.filter_by(name=name).first():
        db.session.add(Category(name=name, description=request.form.get('description')))
        db.session.commit()
        flash('Category added', 'success')
    return redirect(url_for('categories'))

@app.route('/settings', methods=['GET', 'POST'])
@login_required
def settings():
    if current_user.role != 'admin':
        flash('Only admin can change settings', 'danger')
        return redirect(url_for('dashboard'))
    s = get_settings()
    if request.method == 'POST':
        s.default_loan_days = int(request.form.get('default_loan_days', 14))
        s.fine_per_day = float(request.form.get('fine_per_day', 5))
        s.max_books_per_member = int(request.form.get('max_books_per_member', 5))
        s.library_name = request.form.get('library_name', 'LibraPro Library')
        db.session.commit()
        log_activity('Update Settings')
        flash('Settings saved', 'success')
        return redirect(url_for('settings'))
    return render_template('settings.html', settings=s)

@app.route('/logs')
@login_required
def logs():
    if current_user.role != 'admin':
        flash('Permission denied', 'danger')
        return redirect(url_for('dashboard'))
    return render_template('logs.html', logs=ActivityLog.query.order_by(ActivityLog.created_at.desc()).limit(100).all())

@app.route('/reports')
@login_required
def reports():
    if current_user.role not in ['admin', 'librarian']:
        flash('Permission denied', 'danger')
        return redirect(url_for('dashboard'))
    return render_template('reports.html')

@app.route('/export/books')
@login_required
def export_books():
    if current_user.role not in ['admin', 'librarian']:
        return redirect(url_for('dashboard'))
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(['ID', 'Title', 'Author', 'ISBN', 'Category', 'Copies', 'Available'])
    for b in Book.query.all():
        writer.writerow([b.id, b.title, b.author, b.isbn, b.category.name if b.category else '', b.copies, b.available])
    return Response(output.getvalue(), mimetype='text/csv', headers={'Content-Disposition': 'attachment;filename=books.csv'})

@app.route('/export/transactions')
@login_required
def export_transactions():
    if current_user.role not in ['admin', 'librarian']:
        return redirect(url_for('dashboard'))
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(['ID', 'Book', 'Member', 'Issued', 'Due', 'Status', 'Fine'])
    for t in Transaction.query.all():
        writer.writerow([t.id, t.book.title, t.member.name, t.issued_at, t.due_date, t.status, t.fine])
    return Response(output.getvalue(), mimetype='text/csv', headers={'Content-Disposition': 'attachment;filename=transactions.csv'})

@app.route('/scan')
@login_required
def scan():
    return render_template('scan.html')

@app.route('/api/book-by-isbn/<isbn>')
@login_required
def book_by_isbn(isbn):
    clean_isbn = ''.join(c for c in isbn if c.isdigit() or c.upper() == 'X')
    book = Book.query.filter((Book.isbn == isbn) | (Book.isbn == clean_isbn) | (Book.isbn.like(f'%{clean_isbn}%'))).first()
    if book:
        return jsonify({'found': True, 'book': {'id': book.id, 'title': book.title, 'author': book.author, 'isbn': book.isbn, 'category': book.category.name if book.category else '', 'year': book.year, 'available': book.available, 'copies': book.copies}})
    return jsonify({'found': False})

@app.route('/profile')
@login_required
def profile():
    return render_template('profile.html')

@app.route('/users')
@login_required
def users():
    if current_user.role != 'admin':
        flash('Permission denied', 'danger')
        return redirect(url_for('dashboard'))
    return render_template('users.html', users=User.query.all())

@app.route('/users/add', methods=['POST'])
@login_required
def add_user():
    if current_user.role != 'admin':
        return redirect(url_for('users'))
    u = User(username=request.form['username'], email=request.form['email'], password=generate_password_hash(request.form['password']), role=request.form.get('role', 'librarian'))
    db.session.add(u)
    db.session.commit()
    log_activity('Add User', u.username)
    flash('User created', 'success')
    return redirect(url_for('users'))

if __name__ == '__main__':
    create_tables()
    app.run(host='0.0.0.0', port=5000, debug=True)
