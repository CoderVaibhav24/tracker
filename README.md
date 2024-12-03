# Personal Finance Tracker App

The Personal Finance Tracker App is a full-stack application designed to help users manage their personal finances effectively. With this app, users can add, update, and delete expenses and incomes, view their financial data filtered by date, and monitor their total spending or earnings. The application ensures data security with user-specific isolation and JWT-based authentication.

## Features

- **User Authentication**: Secure registration and login using encrypted passwords and JWT tokens.
- **Expense Management**: Add, update, delete, and view expenses.
- **Income Management**: Add, update, delete, and view incomes.
- **Date-Filtered Reports**: View total expenses and incomes for a specific date range.
- **User-Specific Data**: Each user can only access their own financial data.
- **Modern UI**: Built using React with a responsive and user-friendly interface.

## Getting Started

Follow these steps to set up the project locally for development or testing.

### Prerequisites

Ensure you have the following installed on your system:

- **Java 17 or later** (backend uses Spring Boot)
- **Node.js 16 or later** (for React frontend)
- **PostgreSQL** (database)

Install dependencies for the frontend and backend:

```bash
# Frontend
npm install

# Backend
mvn install
```

### Installing

Clone the repository:

```bash
git clone https://github.com/YourGitHubUsername/personal-finance-tracker.git
cd personal-finance-tracker
```

Set up the database:

- Create a PostgreSQL database (`personal_finance_tracker`).
- Update the database connection settings in `application.properties`:

```bash
spring.datasource.url=jdbc:postgresql://localhost:5432/personal_finance_tracker
spring.datasource.username=your_username
spring.datasource.password=your_password
```

Run the backend:

```bash
cd back-end
mvn spring-boot:run
```

Run the frontend:

```bash
cd front-end
npm start
```

Access the application at [http://localhost:3000](http://localhost:3000).

## Deployment

To deploy the application, you can use platforms like Heroku, AWS, or Vercel. Update the configuration as needed for the respective deployment platform.

## Built With

### Backend

- **Spring Boot** - Framework for backend development
- **PostgreSQL** - Database for storing user-specific financial data
- **JWT (JSON Web Tokens)** - Secure user authentication
- **Lombok** - Simplified Java development

### Frontend

- **React** - User interface
- **Vite** - Development environment for React
- **Axios** - HTTP requests
- **CSS Modules** - Styling

## Folder Structure

```bash
personal-finance-tracker/
│
├── back-end/                  # Spring Boot backend
│   ├── src/                   # Java source files
│   ├── target/                # Compiled files
│   ├── pom.xml                # Maven dependencies
│
├── front-end/                 # React frontend
│   ├── src/                   # React source files
│   ├── public/                # Static assets
│   ├── package.json           # Node.js dependencies
│
└── README.md                  # Project documentation
```

## Authors

- **Vaidehi** - Full Stack - [GitHub](https://github.com/ihediav-1408)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- **Spring Boot Documentation** for backend inspiration.
- **React Documentation** for frontend development.
- **JWT Documentation** for secure user authentication.
- **Community contributions** for supporting best practices in full-stack development.

