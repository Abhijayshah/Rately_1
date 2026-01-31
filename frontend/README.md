# Shop Rating System - Frontend

A modern React-based frontend application for the Shop Rating System, built with React 18, Tailwind CSS, and modern UI components.

## Features

### User Management
- **Authentication**: Secure login and registration system
- **Role-based Access**: Support for Admin, Store Owner, and Normal User roles
- **Protected Routes**: Route protection based on user authentication and authorization

### Admin Features
- **User Management**: Create, view, and manage all users
- **Store Management**: Create, view, and manage all stores
- **Dashboard**: Overview of system statistics and activities

### Store Owner Features
- **Store Dashboard**: View store ratings and customer feedback
- **Rating Analytics**: Detailed view of store performance and ratings
- **Customer Reviews**: View and respond to customer ratings

### Normal User Features
- **Store Discovery**: Browse and search available stores
- **Rating System**: Rate and review stores with 1-5 star ratings
- **Rating History**: View and manage personal rating history
- **Store Details**: View detailed store information and ratings

### UI/UX Features
- **Responsive Design**: Mobile-first responsive design
- **Modern UI**: Clean and intuitive user interface
- **Loading States**: Smooth loading indicators and transitions
- **Error Handling**: Comprehensive error handling and user feedback
- **Toast Notifications**: Real-time feedback for user actions

## Technology Stack

- **React 18**: Latest React with hooks and modern features
- **React Router DOM**: Client-side routing and navigation
- **Tailwind CSS**: Utility-first CSS framework for styling
- **React Hook Form**: Efficient form handling and validation
- **Axios**: HTTP client for API communication
- **Lucide React**: Modern icon library
- **React Toastify**: Toast notifications

## Project Structure

```
frontend/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── ProtectedRoute.js
│   │   ├── layout/
│   │   │   └── Layout.js
│   │   └── ui/
│   │       ├── Button.js
│   │       ├── Input.js
│   │       ├── Select.js
│   │       ├── Modal.js
│   │       ├── Table.js
│   │       ├── Loading.js
│   │       └── StarRating.js
│   ├── contexts/
│   │   └── AuthContext.js
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.js
│   │   │   └── Register.js
│   │   ├── admin/
│   │   │   ├── Users.js
│   │   │   └── Stores.js
│   │   ├── user/
│   │   │   ├── Stores.js
│   │   │   └── Ratings.js
│   │   ├── storeOwner/
│   │   │   └── StoreOwnerDashboard.js
│   │   ├── Dashboard.js
│   │   ├── Settings.js
│   │   └── Unauthorized.js
│   ├── services/
│   │   └── api.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on `http://localhost:5000`

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm start
   ```

3. **Open your browser**:
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## Configuration

### API Configuration

The frontend is configured to proxy API requests to the backend server running on `http://localhost:5000`. This is configured in `package.json`:

```json
{
  "proxy": "http://localhost:5000"
}
```

### Environment Variables

Create a `.env` file in the frontend directory for environment-specific configurations:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_APP_NAME=Shop Rating System
```

## Key Components

### Authentication Context
- Manages user authentication state
- Provides login, logout, and user management functions
- Handles token storage and API authentication

### Protected Routes
- Implements role-based access control
- Redirects unauthorized users
- Supports multiple authorization levels

### UI Components
- **Button**: Customizable button with variants and loading states
- **Input**: Form input with validation and error handling
- **Modal**: Reusable modal component for dialogs
- **Table**: Data table with sorting and pagination
- **StarRating**: Interactive star rating component

### API Service
- Centralized API communication
- Request/response interceptors
- Error handling and authentication

## User Roles and Permissions

### Admin
- Full system access
- User and store management
- System analytics and reports

### Store Owner
- Manage own store information
- View store ratings and reviews
- Respond to customer feedback

### Normal User
- Browse and search stores
- Rate and review stores
- Manage personal rating history

## Demo Credentials

### Admin Account
- **Email**: admin@example.com
- **Password**: Admin123!

### Store Owner Account
- **Email**: store1@example.com
- **Password**: Store123!

### Normal User Account
- **Email**: user1@example.com
- **Password**: User123!

## Development Guidelines

### Code Style
- Use functional components with hooks
- Follow React best practices
- Use Tailwind CSS for styling
- Implement proper error handling

### Component Structure
- Keep components small and focused
- Use custom hooks for complex logic
- Implement proper prop validation
- Follow consistent naming conventions

### State Management
- Use React Context for global state
- Use local state for component-specific data
- Implement proper loading and error states

## Testing

```bash
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.