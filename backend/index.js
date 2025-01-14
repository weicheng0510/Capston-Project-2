const app = require('./app')
const connectDB = require('./config/db');


// Set the port for the server, default to 5001 if not specified in environment
const PORT = 5001 || process.env.PORT;

// Connect to the database and start the server
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log("Successfully connected to the database.");
            console.log(`Server is running on PORT: ${PORT}`);
        });
    })
    .catch(err => {
        console.error("Failed to connect to the database:", err.message);
        process.exit(1); // Exit the application if the database connection fails
    });

