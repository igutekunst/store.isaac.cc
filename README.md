

isaac.cc is home page for Programming Reality

Web store for isaac.cc
store.isaac.cc


Sells a handful of products
Static product pages

js and css bundle, package.js with custom build.js

Bootstrap, maybe react

Backend to store

Users
    Cart

Orders
Products
This is somehow kept up to date during build process. Maybe build process syncs with database? Some kind of UUIDS? 

Login
    Username, password
    email code
    JWT

## Description and Plan for Building the Site

### Description
The isaac.cc web store is an online platform for Programming Reality, offering a variety of products through static product pages. The site utilizes modern web technologies such as JavaScript, CSS, and Bootstrap, with potential integration of React for dynamic components. The backend infrastructure supports user management, shopping cart functionality, order processing, and product management. Security features include user authentication via username/password and email code, with JWT for session management.

### Plan

1. **Frontend Development**
    - **Static Pages**: Create static product pages using HTML, CSS, and Bootstrap for responsive design.
    - **JavaScript and CSS Bundling**: Use a custom build.js script to bundle JavaScript and CSS files, optimizing for performance.
    - **React Integration**: Optionally integrate React for dynamic components such as the shopping cart and user login.

2. **Backend Development**
    - **User Management**: Implement user registration, login, and authentication using JWT for secure session management.
    - **Shopping Cart**: Develop cart functionality to allow users to add, remove, and update products in their cart.
    - **Order Processing**: Create order management system to handle order creation, payment processing, and order tracking.
    - **Product Management**: Build an admin interface for managing product listings, including adding, updating, and deleting products.

3. **Database Integration**
    - **Data Sync**: Ensure the build process syncs with the database, possibly using UUIDs to maintain consistency.
    - **Database Schema**: Design a database schema to store user information, product details, orders, and cart data.

4. **Security**
    - **Authentication**: Implement secure authentication mechanisms, including username/password and email code verification.
    - **Authorization**: Use JWT to manage user sessions and protect sensitive endpoints.

5. **Deployment**
    - **Build Process**: Automate the build process to bundle assets and sync with the database.
    - **Hosting**: Deploy the site on a reliable hosting platform, ensuring scalability and performance.

6. **Maintenance**
    - **Updates**: Regularly update dependencies and libraries to maintain security and performance.
    - **Monitoring**: Implement monitoring tools to track site performance and user activity.

By following this plan, we can build a robust and secure web store for isaac.cc, providing a seamless shopping experience for users.




