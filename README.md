DriveCore – Car Dealership Inventory Management System

DriveCore is a full-stack Car Dealership Inventory Management System designed to help dealerships manage their vehicle inventory efficiently. The application provides secure authentication, vehicle management, inventory tracking, purchasing, restocking, search functionality, and an AI-powered inventory assistant.

The project follows a modern full-stack architecture with a React frontend, Node.js and Express backend, PostgreSQL database, Prisma ORM, JWT authentication, and Mistral AI integration.

Features:

1.Authentication
      User registration
      User login
      JWT-based authentication
      Protected API routes
      User session management using local storage
      Role-based access control for administrators
2.Vehicle Management
      Add new vehicles
      View all available vehicles
      View individual vehicle details
      Edit vehicle information
      Delete vehicles
      Unique vehicle IDs
      Vehicle information includes:
      Make
      Model
      Category
      Price
      Quantity
3.Search and Filtering
        Vehicles can be searched and filtered using:
        
        Make
        Model
        Category
        Minimum price
        Maximum price
4.Inventory Management
        Purchase vehicles
        Automatically decrease vehicle quantity after purchase
        Prevent purchases when stock reaches zero
        Display an out-of-stock state
        Admin-only vehicle restocking
        Admin-only vehicle deletion
5.Dashboard
        The DriveCore dashboard provides an overview of dealership inventory, including:
        
        Total number of vehicles
        Total stock available
        Total inventory value
        Low-stock vehicle count
        Vehicle management actions
        Search and filtering functionality
        Purchase functionality
        Admin inventory controls
6.AI-Powered Inventory Assistant

        DriveCore includes an AI assistant powered by Mistral.
        
        The assistant can analyze the current dealership inventory and answer questions such as:
        
        Which vehicles are low in stock?
        What is the total inventory value?
        Which vehicle categories have the highest availability?
        Which models should be restocked?
        What inventory trends can be identified?
        
        The AI assistant only uses the inventory data provided by the application and is instructed not to invent vehicle information.


Tech Stack
  Frontend
      React
      Vite
      Tailwind CSS
      Axios
      React Router
      Lucide React
  Backend
      Node.js
      Express.js
      Prisma ORM
      JWT Authentication
      bcrypt
  Database
        PostgreSQL
  Artificial Intelligence
      Mistral AI


Installation and Setup
  Prerequisites

    Make sure the following are installed:

        Node.js
        npm
        PostgreSQL
        Git

        1.Clone the Repository
        2.Backend Setup
          -cd backend
          -npm install
        3.Create .env file
            DATABASE_URL="your_postgresql_connection_string"

            JWT_SECRET="your_jwt_secret"
              
            MISTRAL_API_KEY="your_mistral_api_key"

        4.npx prisma migrate dev
        5.npx prisma generate
        6.npm run dev
        (http://localhost:5000)

        7.Front end SetUp
          -cd frontend
          -npm install
          -npm install lucide-react
          -npm run dev
          (http://localhost:5173)


AI Assistant

The DriveCore AI Assistant is integrated with Mistral AI.

When a user submits a question, the backend:

Retrieves the current vehicle inventory.
Sends the inventory data along with the user's question to the AI model.
Uses a system prompt to restrict the AI to the available inventory data.
Returns a formatted response to the frontend.

The AI assistant can provide:

Low-stock analysis
Inventory summaries
Vehicle comparisons
Category analysis
Restocking recommendations
Inventory insights

The assistant is designed not to perform actions such as modifying, deleting, purchasing, or restocking vehicles.


SCREENSHOTS ADDED IN THE REPO


**My AI Usage**

AI tools were used throughout the development of DriveCore as development assistants. All generated suggestions were reviewed, understood, modified where necessary, and integrated into the project by me.

ChatGPT

ChatGPT was used for:

Planning the overall project structure
Understanding REST API design
Debugging frontend and backend errors
Improving React components
Designing the dashboard interface
Tailwind CSS styling suggestions
Implementing authentication flows
Connecting frontend functionality to backend API endpoints
Debugging vehicle editing and API issues
Designing the AI assistant integration
Writing and improving documentation
Understanding testing and Test-Driven Development concepts

ChatGPT was primarily used as a development assistant for problem-solving, debugging, code explanations, and UI improvements.

Blackbox AI

Blackbox AI was used during development for:

Code suggestions
Exploring implementation approaches
Understanding unfamiliar code patterns
Debugging and development assistance
Improving development productivity

The generated suggestions were reviewed before being incorporated into the project.

Gemini

Gemini was used for:

Brainstorming technical approaches
Exploring alternative implementation ideas
Understanding AI and API integration concepts
Debugging selected development issues
Comparing possible approaches during development

Its suggestions were used as references and were reviewed before implementation.

Mistral AI

Mistral was used as the core AI model powering the DriveCore AI Assistant.

The Mistral model receives the current dealership inventory and answers user questions based on that available data.

It is used for:

Inventory analysis
Low-stock identification
Vehicle comparisons
Inventory insights
Restocking recommendations
Category and stock analysis

The AI assistant is constrained through a system prompt to avoid inventing vehicle information and to answer based only on the provided inventory data.

**Author**

Tanishqa Kalidindi

DriveCore was developed as a full-stack Car Dealership Inventory Management System demonstrating REST API development, database integration, authentication, authorization, React frontend development, Tailwind CSS, AI integration, and modern development workflows.

  
        
