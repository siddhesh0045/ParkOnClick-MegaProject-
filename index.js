
const express = require("express");
const con = require("./connection");
const app = express();
const path = require("path");
const session = require("express-session");
const admin = require('firebase-admin');
// const serviceAccount = require('./demo1-7687f-firebase-adminsdk-iii0w-4c634ac409.json');
// testdata-1c6d3-firebase-adminsdk-1hv8k-2a1b0c1268.json
const serviceAccount = require('./testdata-1c6d3-firebase-adminsdk-1hv8k-2a1b0c1268.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://testdata-1c6d3-default-rtdb.asia-southeast1.firebasedatabase.app'
});
const db = admin.database();
const ref = db.ref('station1');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// serve static files from a specific directory
app.use(express.static(path.join(__dirname, "public")));
// serve static files from a specific directory
app.use(express.static(path.join(__dirname, "veiws")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// use express-session
app.use(
    session({
        secret: "easy_park",
        resave: false,
        saveUninitialized: false,
    })
);
app.set("view engine", "ejs");
const port = 2000;

// Define API endpoint for fetching count value
// app.get('/fetchCount', async (req, res) => {
//     try {
//         const snapshot = await ref.once('value');
//         const data = snapshot.val();
//         let count = 0;
//         for (const slot in data) {
//             if (data[slot] === 1) {
//                 count++;
//             }
//         }
//         res.json({ count });
//     } catch (error) {
//         console.error('Error fetching count:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });


app.get('/fetchCount', async (req, res) => {
    try {
        // Get the location query parameter from the request
        const location = req.query.location;

        // Define the Firebase reference based on the location
        let refPath;
        if (location === 'SFC Mall Parking') {
            refPath = 'station1'; // Firebase reference for SFC Mall Parking
        } else if (location === 'Ganesh Mandir Parking') {
            refPath = 'station2'; // Firebase reference for Ganesh Mandir Parking
        } else {
            return res.status(400).json({ error: 'Invalid location' });
        }

        // Retrieve data from Firebase based on the reference
        const snapshot = await db.ref(refPath).once('value');
        const data = snapshot.val();

        // Count the available slots
        let count = 0;
        for (const slot in data) {
            if (data[slot] === 1) {
                count++;
            }
        }

        // Send the count as JSON response
        res.json({ count });
    } catch (error) {
        console.error('Error fetching count:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});




















// Endpoint to fetch slot status
app.get('/fetchSlotStatus', async (req, res) => {
    try {
        const snapshot = await ref.once('value');
        const data = snapshot.val();
        res.json(data); // Assuming data is already structured with slot numbers as keys and status (1 for free, 0 for occupied)
    } catch (error) {
        console.error('Error fetching slot status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.get('/fetchSlotStatus2', async (req, res) => {
    try {
        const snapshot = await db.ref('station2').once('value');
        const data = snapshot.val();
        res.json(data); // Assuming data is already structured with slot numbers as keys and status (1 for free, 0 for occupied)
    } catch (error) {
        console.error('Error fetching slot status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// app.get('/fetchSlotStatus', async (req, res) => {
//     try {
//         // Get the location query parameter from the request
//         const location = req.query.location;
//         console.log(location)
//         // Define the Firebase reference based on the location
//         let refPath;
//         if (location === 'SFC Mall Parking') {
//             refPath = 'station1'; // Firebase reference for SFC Mall Parking
//         } else if (location === 'Ganesh Mandir Parking') {
//             refPath = 'station2'; // Firebase reference for Ganesh Mandir Parking
//         } else {
//             return res.status(400).json({ error: 'Invalid location' });
//         }

//         // Retrieve data from Firebase based on the reference
//         const snapshot = await db.ref(refPath).once('value');
//         const data = snapshot.val();

//         // Send the slot status data as JSON response
//         res.json(data);
//     } catch (error) {
//         console.error('Error fetching slot status:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });




// Define API endpoint for booking seats
app.post('/bookSeats', async (req, res) => {
    try {
        // Get the selected seats, start time, and end time from the request body
        const { seats, startTime, endTime } = req.body;

        // Validate input data
        if (!Array.isArray(seats) || seats.length === 0) {
            return res.status(400).json({ error: "No seats selected for booking." });
        }
        if (!startTime || !endTime) {
            return res.status(400).json({ error: "Please provide both start and end times." });
        }

        // Check if selected seats are available
        const snapshot = await ref.once('value');
        const data = snapshot.val();

        const unavailableSeats = seats.filter(seat => data[seat] !== 1);

        if (unavailableSeats.length > 0) {
            return res.status(400).json({ error: "Some selected seats are not available for booking." });
        }

        // Update the status of selected seats to booked (0)

        // Respond with success message
        return res.status(200).json({ message: "Seats booked successfully!" });

    } catch (error) {
        console.error('Error booking seats:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});




app.post('/bookSeats2', async (req, res) => {
    try {
        // Get the selected seats, start time, and end time from the request body
        const { seats, startTime, endTime } = req.body;

        // Validate input data
        if (!Array.isArray(seats) || seats.length === 0) {
            return res.status(400).json({ error: "No seats selected for booking." });
        }
        if (!startTime || !endTime) {
            return res.status(400).json({ error: "Please provide both start and end times." });
        }

        // Check if selected seats are available
        const snapshot = await db.ref('station2').once('value');
        const data = snapshot.val();

        const unavailableSeats = seats.filter(seat => data[seat] !== 1);

        if (unavailableSeats.length > 0) {
            return res.status(400).json({ error: "Some selected seats are not available for booking." });
        }

        // Update the status of selected seats to booked (0)

        // Respond with success message
        return res.status(200).json({ message: "Seats booked successfully!" });

    } catch (error) {
        console.error('Error booking seats:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});






app.post('/bookSeatsConfirmation', async (req, res) => {
    try {
        // Get the selected seats, start time, and end time from the request body
        const { seats, startTime, endTime } = req.body;
        console.log(seats);

        // Check if selected seats are available
        const snapshot = await ref.once('value');
        const data = snapshot.val();


        // Update the status of selected seats to booked (0)
        const updates = {};
        seats.forEach(seat => {
            updates[seat] = 2;
        });
        await ref.update(updates);

        // Respond with success message
        return res.status(200).json({ message: "Seats booked successfully!" });

    } catch (error) {
        console.error('Error booking seats:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/bookSeatsConfirmation2', async (req, res) => {
    try {
        // Get the selected seats, start time, and end time from the request body
        const { seats, startTime, endTime } = req.body;
        console.log(seats);

        // Check if selected seats are available
        const snapshot = await db.ref('station2').once('value');
        const data = snapshot.val();


        // Update the status of selected seats to booked (0)
        const updates = {};
        seats.forEach(seat => {
            updates[seat] = 2;
        });
        await ref.update(updates);

        // Respond with success message
        return res.status(200).json({ message: "Seats booked successfully!" });

    } catch (error) {
        console.error('Error booking seats:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/confirmation', (req, res) => {
    res.sendFile(path.join(__dirname, 'veiws', 'confirmation.html'));
});
app.get('/thanks', (req, res) => {
    res.sendFile(path.join(__dirname, 'veiws', 'thanks.html'));
});

app.get('/api/user', (req, res) => {
    // Check if the user is logged in (i.e., session contains user email)
    if (!req.session.user || !req.session.user.email) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    const email = req.session.user.email;

    // Query database to fetch user information based on email
    const sql = "SELECT * FROM users WHERE email = ?";
    con.query(sql, [email], (err, result) => {
        if (err) {
            console.error('Error fetching user information:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Return user information as JSON response
        res.json(result[0]);
    });
});
// Define your existing routes here
const auth = require("./auth");
app.use("/", auth);

// Confirmation message that port is running
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


