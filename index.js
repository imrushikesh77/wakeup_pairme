import fetch from 'node-fetch';
import cron from 'node-cron';
import express from 'express';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Server is awake!');
});

const wakeUp = () => {
    fetch('https://pairme.onrender.com')
        .then((response) => {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.indexOf('application/json') !== -1) {
                return response.json();
            } else {
                return response.text();
            }
        })
        .then((data) => {
            if (typeof data === 'object') {
                console.log("Server is awake!");
            } else {
                console.log("Server is awake! (non-JSON response)");
            }
        })
        .catch((error) => console.error("Error waking up server:", error));
};

// Schedule the wakeUp function to run every 30 seconds
cron.schedule('*/30 * * * * *', () => {
    console.log('Pinging server...');
    wakeUp();
});

console.log('Server script running...');

app.listen(3000, () => {
    console.log('Server is running...');
});
