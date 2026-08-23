1.Health Check TDD
    prompt-"okay as we done with the setup of the backend,lets do the first tdd-by checking the end point is working or not-give me the code to text the health.test.js code in tests"
2.DataBase Creation:
    prompt-"the first tdd is done,now lets the development process-begin with registration befor that tell me how to set up the DB in POSTGRESQL and the connection setup"
3.DataBase Setup:
    prompt-"tell me the commands in SQLShell to verify"
4.Error Correction:
    prompt:"og
PS C:\Users\tanis\OneDrive\Desktop\DriveCore\backend> node -v
v20.12.2
PS C:\Users\tanis\OneDrive\Desktop\DriveCore\backend> npm -v
10.5.0
PS C:\Users\tanis\OneDrive\Desktop\DriveCore\backend> this is the error soleve and tell me why it has come"

6.Login:
    prompt-""I have implemented user login with JWT authentication, and the successful login test is passing. What should I test next to make the authentication functionality more robust?"

    "I have tested successful login and incorrect password handling. What is another important authentication test case I should add?"

Middleware:
    prompt:"let's implement the authentication middleware and then immediately start the actual DriveCore core feature."
Vehicle Creation:
    prompt-"My DriveCore application needs a vehicle management feature. Help me follow TDD by first writing a failing Jest and Supertest test for POST /api/vehicles. An authenticated user should be able to add a vehicle with brand, model, year, mileage, and fuelType. After the RED test fails, provide the minimum implementation required to make the test pass"

User Vehicles:
    prompt:"Help me quickly follow TDD for retrieving vehicles in my DriveCore application. First write a failing Jest and Supertest test for GET /api/vehicles. The endpoint should require authentication and return only the vehicles belonging to the logged-in user. Then provide the minimum implementation needed to make the test pass"

Vehicle Service Records:
    prompt-"My DriveCore application can create and retrieve vehicles. Help me add vehicle service and maintenance records using a quick TDD approach. First write a failing Jest and Supertest test for POST /api/vehicles/:id/services. The authenticated user should only be able to add a service record to their own vehicle. After the test fails, provide the minimum Prisma schema and Express implementation needed to make it pass."

    "A ServiceRecord model was added with a relationship to Vehicle. A test was created for adding a service record to an authenticated user's vehicle. The protected API endpoint was then implemented using Prisma"

Vehicle Service History:
    prompt-"I have already implemented adding service records to a vehicle in my DriveCore backend. I now want to add a feature that allows an authenticated user to view the complete service history of their own vehicle. Help me follow TDD by writing the test first, then implementing only the required Express and Prisma code to make the test pass."

Service Reminders:
    prompts:""I want to add a service reminder feature to my DriveCore backend. An authenticated user should be able to view upcoming vehicle services based on the nextServiceDate stored in service records. test for GET /api/reminders and then implementing the minimum Express and Prisma code required to make the test pass."

Update Vehicle:
    prompt-"I want to add an update feature to my DriveCore backend. An authenticated user should be able to update only their own vehicle details. Help me follow TDD by first writing a failing test for PUT /api/vehicles/:id, and then provide the minimum Express and Prisma implementation required to make the test pass."

Delete Vehicle:
    prompt:"I want to complete the vehicle CRUD operations in my DriveCore backend by adding a delete feature. An authenticated user should only be able to delete their own vehicle. Help me follow TDD by first writing a failing test for DELETE /api/vehicles/:id and then implementing the minimum Express and Prisma code required to make the test pass."

 Frontend Setup with React-
    prompt:"Help me quickly create a React frontend using Vite and connect it to my existing backend APIs. I want to build pages for user authentication, vehicle management, service records, service history, and service reminders."


Frontend:
- Create or update the VehicleDetails page.
- Fetch and display the selected vehicle details.
- Add a form to create a new service record.
- Include fields for service type, description, service date, next service date, and cost.
- Display the service history below the form.
- Show a success message after adding a service record.
- Refresh the service history after a new record is added.
- Ensure only authenticated users can access their vehicle data.
- Display statuses such as "Overdue by X days", "Due today", and "Due in X days".
- Sort reminders by the nearest service date.
- Add navigation from the Dashboard to the Service Reminders page.
- Add a button to return to the Dashboard.





- User registration and login
- JWT authentication
- Vehicle inventory
- Vehicle make
- Vehicle model
- Category
- Price
- Quantity
- Search and filtering
- Purchase functionality
- Admin vehicle management
- Admin restocking
- Admin deletion

I want to remove the old service and reminder features because they are not part of the Car Dealership Inventory System requirements.