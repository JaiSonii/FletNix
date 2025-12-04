# FletNix 🎬

**FletNix** is a full-stack movie and TV show discovery application designed to solve the "what to watch" dilemma. It allows users to browse, search, and filter a vast database of Netflix titles, featuring intelligent age-based content restrictions, genre-based recommendations, and real-time external reviews.

Built with **FastAPI** (Python) and **Next.js** (TypeScript), following the *Zen of Python* principles: Simple, Explicit, and Readable.

-----

## 🚀 Features

This project implements all requirements specified in the assessment:

### 🔐 Authentication & Security

  * **User Registration/Login:** Secure email/password authentication using **JWT (JSON Web Tokens)**.
  * **Password Hashing:** Passwords are hashed using `bcrypt` before storage.
  * **Age Gating:** Users must provide their age during registration.

### 🔍 Discovery & Navigation

  * **Global Search:** Search specifically by **Title** or **Cast** members.
  * **Smart Filtering:** Filter content by Type (Movie vs. TV Show).
  * **Pagination:** Efficient server-side pagination (15 items per page) to handle large datasets.

### 🛡️ Age Restriction Logic

  * **Child Safety:** Users under **18 years old** are automatically restricted from viewing content rated "R", "NC-17", or "TV-MA". This logic is enforced at the API level.

### 📝 Details & Insights

  * **Rich Detail View:** Comprehensive view including cast, director, duration, and description.
  * **External Reviews (OMDb):** Integrates with the OMDb API to display real-time **IMDb Ratings** and reviews.
  * **Recommendations:** An algorithmic recommendation engine suggesting similar shows based on genres.

### 🎨 UI/UX

  * **Modern Interface:** Built with **Tailwind CSS** and **Shadcn UI** for a clean, responsive aesthetic.
  * **Mobile Friendly:** Fully responsive layout for desktop and mobile devices.

-----

## 🛠️ Tech Stack

### Backend (Server)

  * **Framework:** FastAPI (Python 3.12)
  * **Database:** MongoDB (via Motor - Async Driver)
  * **Validation:** Pydantic V2
  * **Testing:** Pytest & Playwright (End-to-End)
  * **Containerization:** Docker

### Frontend (Client)

  * **Framework:** Next.js 15 (App Router)
  * **Language:** TypeScript
  * **Styling:** Tailwind CSS, Tailwind Animate
  * **Components:** Shadcn UI (Radix Primitives)
  * **State/Network:** Axios, React Hooks

-----

## ⚙️ Setup & Installation

You can run FletNix using **Docker** (Recommended) or **Manually**.

### Prerequisites

  * **Data Source:** Ensure you have the `netflix_titles.csv` file (provided in assessment).
  * **OMDb API Key:** Get a free key from [omdbapi.com](http://www.omdbapi.com/apikey.aspx) to enable reviews.

-----

### Option 1: Docker Setup (Recommended)

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd fletnix
    ```

2.  **Configure Environment:**
    Create a `.env` file in the `server/` directory:

    ```env
    # server/.env
    MONGO_URI=mongodb://mongo:27017
    DB_NAME=fletnix
    SECRET_KEY=your_super_secret_key_here
    ALGORITHM=HS256
    ACCESS_TOKEN_EXPIRE_MINUTES=60
    OMDB_API_KEY=your_omdb_api_key
    FRONTEND_URL=http://localhost:3000
    ```

3.  **Place Data File:**
    Move your `netflix_titles.csv` file into `server/data_ingestion/` or the root of server depending on where the script looks. (Based on code, place it in `server/`).

4.  **Run with Docker Compose:**

    ```bash
    cd server
    docker-compose up --build
    ```

    *This starts the API, MongoDB, and Client.*

5.  **Seed the Database:**
    Once the containers are running, open a new terminal to load the data:

    ```bash
    # Identify the container ID or name (usually fletnix_api)
    docker exec -it fletnix_api python data_ingestion/load_data.py
    ```

6.  **Access the App:**

      * **Frontend:** [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000)
      * **API Docs:** [http://localhost:8000/docs](https://www.google.com/search?q=http://localhost:8000/docs)

-----

### Option 2: Manual Local Setup

#### 1\. Database

Ensure you have a local MongoDB instance running (default port `27017`).

#### 2\. Server (FastAPI)

Navigate to the server directory:

```bash
cd server
```

Create a virtual environment and install dependencies:

```bash
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install .
```

Create `.env` file in `server/`:

```env
MONGO_URI=mongodb://localhost:27017
DB_NAME=fletnix
SECRET_KEY=dev_secret
OMDB_API_KEY=your_key
FRONTEND_URL=http://localhost:3000
```

Load the data:

```bash
# Ensure netflix_titles.csv is in the server folder
python data_ingestion/load_data.py
```

Start the server:

```bash
python main.py
```

#### 3\. Client (Next.js)

Navigate to the client directory:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start the frontend:

```bash
npm run dev
```

-----

## 🧪 Testing

The project includes End-to-End (E2E) tests using **Playwright** and **Pytest** to verify API endpoints and Auth flows.

To run the tests (Server must be running):

```bash
cd server
pytest
```

**Test Coverage:**

  * `test_health_check`: Verifies API status.
  * `test_login_flow`: Registers and authenticates a user.
  * `test_search_movies`: Verifies search logic.
  * `test_age_restriction`: **Crucial.** Creates a user under 18 and validates they cannot find 'R' or 'TV-MA' content.
  * `test_get_details`: Verifies data retrieval and structure.

-----

## 📂 Project Structure

```text
.
├── client/                 # Next.js Frontend
│   ├── app/                # App Router Pages (Login, Home, Details)
│   ├── components/         # Reusable UI Components (Navbar, Cards)
│   ├── lib/                # API utilities and Types
│   └── public/             # Static assets
│
├── server/                 # FastAPI Backend
│   ├── app/
│   │   ├── models/         # Pydantic Models (Validation)
│   │   ├── routers/        # API Endpoints (Auth, Shows)
│   │   ├── services/       # Business Logic (Auth, OMDB, DB access)
│   │   ├── database.py     # Mongo connection
│   │   └── main.py         # App entry point
│   ├── data_ingestion/     # Scripts to load CSV to Mongo
│   ├── tests/              # Playwright/Pytest suites
│   ├── Dockerfile          # Server container config
│   └── docker-compose.yml  # Orchestration
```

-----

## 🧘 The Zen of Python Implementation

  * **Explicit is better than implicit:** The codebase uses strict typing with Pydantic (`app/models`) to define exactly what data is expected.
  * **Sparse is better than dense:** Routes are separated into dedicated files (`routers/auth.py`, `routers/shows.py`) rather than one massive `main.py`.
  * **Errors should never pass silently:** Comprehensive error handling in `services/` ensures failed logins or missing data return appropriate HTTP codes.

-----

## 📸 API Documentation

Once the server is running, visit **[http://localhost:8000/docs](https://www.google.com/search?q=http://localhost:8000/docs)** to see the interactive Swagger UI.

**Key Endpoints:**

  * `POST /auth/register`: Create account (Requires `age`).
  * `POST /auth/login`: Get JWT Token.
  * `GET /shows/`: Get paginated list (params: `page`, `type_filter`, `search_query`).
  * `GET /shows/{id}`: Get details + Recommendations + Reviews.