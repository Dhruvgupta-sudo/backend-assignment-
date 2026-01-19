const app = require('./src/app');
const connectDB = require('./src/db/config');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// Connect to Database
connectDB();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
