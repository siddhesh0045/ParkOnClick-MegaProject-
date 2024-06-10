const admin = require('firebase-admin');
const serviceAccount = require('./demo1-7687f-firebase-adminsdk-iii0w-4c634ac409.json');
const serviceAccount = require('./testdata-1c6d3-firebase-adminsdk-1hv8k-2a1b0c1268.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://testdata-1c6d3-default-rtdb.asia-southeast1.firebasedatabase.app'
});
const db = admin.database();
const ref = db.ref('station1');

module.exports = async function fetchCount() {
    try {
        const snapshot = await ref.once('value');
        const data = snapshot.val();
        let count = 0;
        for (const slot in data) {
            if (data[slot] === 0) {
                count++;
            }
        }
        return count;
    } catch (error) {
        console.error('Error fetching count:', error);
        throw error;
    }
};
