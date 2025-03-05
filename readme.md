# Natours Vest App

## Description

Natours Vest App is a server-side rendered web application designed to sell touristic tours. The app allows users to browse and book various tours, providing a seamless experience for adventure seekers.

## Features

- Browse and search for touristic tours
- Book tours online
- Secure authentication and user management
- User reviews and ratings

## Technologies Used

- **Node.js** (Server-side JavaScript runtime)
- **Express.js** (Web framework for Node.js)
- **MongoDB** (NoSQL database for data storage)
- **Mongoose** (MongoDB object modeling for Node.js)
- **Pug** (Template engine for server-side rendering)
- **JWT Authentication** (User authentication and security)
- **Stripe** (Online payment by card)

## Installation

### Prerequisites

Make sure you have the following installed on your system:

- Node.js
- MongoDB

### Steps

1. Clone the repository:

   ```sh
   git clone https://github.com/Teodora3120/Natours-Web-App.git

   ```

2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables:
   Create a `config.env` file and add the necessary configurations such as:

   ```sh
    NODE_ENV=development
    ADDRESS=127.0.0.1
    PORT=3000
    DATABASE=
    DB_USERNAME=
    DB_PASSWORD=

    JWT_SECRET=
    JWT_EXPIRES_IN=30d
    JWT_COOKIE_EXPIRES_IN=30

    EMAIL_USERNAME=
    EMAIL_PASSWORD=
    EMAIL_HOST=
    EMAIL_PORT=

    EMAIL_FROM=

    SENDGRID_USERNAME=
    SENDGRID_PASSWORD=


    STRIPE_SECRET_KEY=
   ```

4. Start the application:
   ```sh
   npm run start:dev
   ```
5. Open the application in your browser:
   ```sh
   http://127.0.0.1:3000
   ```

## API Endpoints

- `GET /` - Home page
- `GET /tours` - List all available tours
- `GET /tours/:slug` - View a specific tour
- `POST /signup` - User registration
- `POST /login` - User login
- `GET /me` - User profile

## License

This project is licensed under the MIT License.
