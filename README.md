# Project Name: Parts Search

An ecommerce website platform for buying and selling car parts. This application allows users to browse, upload, and manage car part listings, along with features like cart management and role-based access control.

## Tech Stack

### Backend
- **Node.js**: Runtime environment.
- **Express.js**: Framework for building APIs and server-side logic.
- **MongoDB**: Database for storing product, user, and cart data.
- **Mongoose**: ODM library for MongoDB.
- **JWT**: Authentication mechanism.

### Frontend
- **React**: Library for building the user interface.
- **Vite**: Development tool for fast builds.
- **Tailwind CSS**: Styling framework for modern and responsive design.

### Others
- **Render**: Deployment platform.
- **Cloudinary**: Image storage and management.

---

## Features

### Backend
- **User Management**: User sign-up, login, role-based access control.
- **Product Management**: CRUD operations for products.
- **Cart Management**: Add/remove items, update quantities.
- **Search & Filter**: Search and filter products by brand and category.

### Frontend
- **Responsive Design**: Mobile-friendly and desktop-ready UI.
- **Product Browsing**: View detailed product pages and similar items.
- **User Roles**: Admin panel for managing users and products.
- **Dynamic Cart**: Manage items in the cart with live updates.

---

## Live URL

https://parts-search.onrender.com/


---

## Installation Instructions

### Prerequisites
- Node.js (v14+)
- npm (v6+)
- MongoDB
- Cloudinary account

### Backend Setup
1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo/backend
   ```
2. **Install Dependencies**
   ```bash
   npm install
   ```
3. **Configure Environment Variables**
   Create a `.env` file in the `backend` directory with the following:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```
4. **Run the Server**
   ```bash
   npm start
   ```

### Frontend Setup
1. **Navigate to the Frontend Directory**
   ```bash
   cd ../frontend
   ```
2. **Install Dependencies**
   ```bash
   npm install
   ```
3. **Configure Environment Variables**
   Create a `.env` file in the `frontend` directory with the following:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
4. **Run the Frontend**
   ```bash
   npm run dev
   ```

---

## Usage

1. **Browse Products**: Search for car parts by category, brand, or name.
2. **Add to Cart**: Select items and manage quantities in the cart.
3. **Admin Role**:
   - Add, update, or delete products.
   - Manage users and assign roles.

---

## Folder Structure

### Backend
- **`controller/`**: Business logic for products and users.
- **`middleware/`**: Authentication and authorization handlers.
- **`models/`**: Mongoose schemas for database entities.
- **`routes/`**: API endpoints.
- **`config/`**: Database and other configurations.

### Frontend
- **`src/components/`**: Reusable UI components.
- **`src/pages/`**: Application pages (e.g., Home, Product Detail, Cart).
- **`src/store/`**: State management using Redux.
- **`src/helpers/`**: Utility functions (e.g., image handling, local storage).

---

## Contributing

Contributions are welcome! Follow these steps:
1. Fork the repository.
2. Create a new branch.
3. Make your changes and test them.
4. Submit a pull request with a detailed description of your changes.

---

## Contact

Created by Wei-Yuan Cheng. For questions or suggestions, email me at [sknc1993@gmail.com].
