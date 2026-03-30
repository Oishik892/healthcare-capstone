# 🏥 Health Care Capstone

## 📖 Overview

The **Health Care Capstone** is a full-stack web application designed to streamline healthcare processes, improve patient management, and provide a seamless interface for healthcare providers and patients. This project serves as a capstone, demonstrating a complete client-server architecture.

## ✨ Features

* **Patient Management:** Easily register, view, and manage patient records.
* **Appointment Scheduling:** Interface to book, update, and track medical appointments.
* **Responsive UI:** A clean, accessible, and responsive frontend built with JavaScript, HTML, and CSS.
* **Secure Backend API:** Node.js powered server handling data storage, retrieval, and business logic.
* **Role-based Access:** (If applicable) Distinct workflows for patients, doctors, and administrators.

## 🛠️ Technologies Used

### Frontend (`/client`)
* **React** - JavaScript library for building the user interfaces.
* **React Router** - Standard routing library for navigating between pages in the React application.
* **JavaScript (ES6+)** - Core logic and DOM manipulation.
* **HTML5 & CSS3** - Page structure and styling.

### Backend (`/server`)
* **Node.js** - Server runtime environment.
* **Express.js** - Web framework for building the RESTful APIs.
* **PostgreSQL** - Powerful, open-source object-relational database system.
* **Prisma** - Next-generation Node.js ORM used to interact with the database efficiently.
## 📂 Project Structure

The repository is structured as a monorepo, separating the frontend and backend environments:

```text
health-care-capstone/
├── client/                 # Frontend source code, UI components, and styles
│   ├── package.json        # Client dependencies
│   └── ...
├── server/                 # Backend REST API, database models, and server logic
│   ├── package.json        # Server dependencies
│   └── ...
├── .gitignore              # Ignored files and directories
├── package.json            # Root project configuration and scripts
└── package-lock.json       # Dependency tree lockfile
```
## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites

Ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v14 or higher)
* npm (comes with Node.js)
* *(Optional)* A running instance of your database (e.g., MongoDB local server or URI)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Oishik892/healthcare-capstone
   cd healthcare-capstone
   ```
### Install Root Dependencies:
```bash
  npm install
```
### Install Server Dependencies:
```bash
cd server
npm install

```
### Install Client Dependencies:
```bash
cd client
npm install
```
### Configuration:
* Create a ```.env``` file in the ```/server``` directory.
* Add your environment variables (Example):
  ```bash
  PORT=5000
  DATABASE_URL=https://healthcare-capstone.onrender.com/api
  JWT_SECRET=xfdsagaADFSFbv
  ```

### 💻 Usage

To run both the client and the server concurrently, return to the root directory and run:

```bash
npm run dev
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the [issues page]https://github.com/Oishik892/healthcare-capstone/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License
Distributed under the MIT License. See LICENSE.txt for more information.
