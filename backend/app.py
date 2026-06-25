from flask import Flask, request, jsonify, session
from flask_cors import CORS
import sqlite3
import os
from flask import redirect, url_for

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Change this to a secure secret key
CORS(app)

# Database paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
USERS_DB = os.path.join(BASE_DIR, 'users.db')
RENTED_LAPTOPS_DB = os.path.join(BASE_DIR, 'rented_laptops.db')

# Initialize the databases
def init_users_db():
    conn = sqlite3.connect(USERS_DB)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users (
                    username TEXT PRIMARY KEY,
                    password TEXT,
                    email TEXT,
                    phone TEXT,
                    address TEXT)''')
    conn.commit()
    conn.close()

def init_rented_laptops_db():
    conn = sqlite3.connect(RENTED_LAPTOPS_DB)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS rented_laptops (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    laptop_name TEXT,
                    username TEXT,
                    days INTEGER)''')
    conn.commit()
    conn.close()

# Call initialization functions
init_users_db()
init_rented_laptops_db()

# User registration endpoint
@app.route("/api/signup", methods=["POST"])
def signup():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    email = data.get("email")
    phone = data.get("phone")
    address = data.get("address")

    conn = sqlite3.connect(USERS_DB)
    c = conn.cursor()
    c.execute("SELECT * FROM users WHERE username=?", (username,))
    if c.fetchone():
        return jsonify({"message": "Username already exists."}), 400

    c.execute("INSERT INTO users (username, password, email, phone, address) VALUES (?, ?, ?, ?, ?)",
              (username, password, email, phone, address))
    conn.commit()
    conn.close()
    return jsonify({"message": "User registered successfully!"}), 200

# User login endpoint
@app.route("/api/signin", methods=["POST"])
def signin():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    conn = sqlite3.connect(USERS_DB)
    c = conn.cursor()
    c.execute("SELECT * FROM users WHERE username=?", (username,))
    user = c.fetchone()
    if not user or user[1] != password:
        return jsonify({"message": "Invalid username or password."}), 400

    # Store username in session
    session['username'] = username
    conn.close()
    
    return jsonify({"message": "Login successful!"}), 200

# User logout endpoint
@app.route("/api/logout", methods=["POST"])
def logout():
    session.pop('username', None)
    return jsonify({"message": "Logout successful!"}), 200

# Rent laptop endpoint
@app.route("/api/rent", methods=["POST"])
def rent_laptop():
    try:
        # Get data from the request
        data = request.get_json()
        laptop_name = data.get("laptop_name")
        days = data.get("days")
        username = data.get("username")  # Username passed in the request payload

        # Check if laptop_name, days, and username are provided
        if not laptop_name or not days or not username:
            return jsonify({"message": "Laptop name, rental days, and username are required!"}), 400

        # Debugging: Print received data
        print(f"Received data: {laptop_name}, {days}, {username}")

        # Insert rental details into the database
        conn = sqlite3.connect(RENTED_LAPTOPS_DB)
        c = conn.cursor()
        c.execute("INSERT INTO rented_laptops (laptop_name, username, days) VALUES (?, ?, ?)",
                  (laptop_name, username, days))
        conn.commit()
        conn.close()

        return jsonify({"message": f"Laptop '{laptop_name}' rented successfully for {days} days!"}), 200

    except Exception as e:
        # Log the error
        print(f"Error occurred: {str(e)}")
        return jsonify({"message": "An error occurred while processing the rental."}), 500




if __name__ == "__main__":
    app.run(debug=True)
