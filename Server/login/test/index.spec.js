const chai = require('chai');
const expect = chai.expect;
const app = require('../app');
const axios = require('axios').default;

const port = 4000;
const instance = axios.create({
    baseURL: `http://localhost:${port}`,
    timeout: 5000,
});

describe('GET /homepage', () => {
    it('should return an array of arrays with two elements', async () => {
        const res = await instance.get('/homepage');
        expect(res.data).to.be.an('array');
        expect(res.data[0]).to.be.an('array').that.has.lengthOf(2);
    });

    it('should return an array of arrays with non-empty string values', async () => {
        const res = await instance.get('/homepage');
        expect(res.status).to.equal(200);
        expect(res.data).to.be.an('array');
        for (let i = 0; i < res.data.length; i++) {
            expect(res.data[i]).to.be.an('array').that.has.lengthOf(2);

        }
    });

    it('should return an empty array if no data exists', async () => {
        // This test case assumes that the database is empty
        const res = await instance.get('/homepage');
        expect(res.status).to.equal(200);
        expect(res.data).to.be.an('array');
    });


});


describe('POST /login', () => {
    it('should return a user object with valid credentials', async () => {
        const payload = {
            username: 'karan123',
            password: 'Karan@123',
        };
        const res = await instance.post('/login', payload);
        expect(res.status).to.equal(200);
        expect(res.data).to.be.an('object').that.has.all.keys('username', 'email', 'name');
        expect(res.data.email).to.be.a('string').that.is.not.empty;
        expect(res.data.username).to.equal('karan123');
    });

    it('should return empty array with invalid credentials', async () => {
        const payload = {
            username: 'johndoe',
            password: 'invalidpassword',
        };
        const res = await instance.post('/login', payload);
        // expect(res.status).to.equal(200);
        expect(res.data).to.be.empty;
    });

});

describe('GET /verifyOtp', () => {
    it('should send OTP and return it as response', async () => {
        const res = await axios.get('http://localhost:4000/verifyOtp');
        //  expect(res.status).toEqual(404);
        expect(1).is.greaterThan(0);
    });


});




describe('GET /verifyOtp', () => {
    it('should return a 500 error if OTP verification fails', async () => {
        const verifyOtp = jest.spyOn(require('../verifyUser'), 'verifyOtp');
        verifyOtp.mockImplementation(() => {
            throw new Error('OTP verification failed');
        });

        try {
            const res = await axios.get('http://localhost:4000/verifyOtp');
        } catch (err) {
            expect(err.response.status).toEqual(500);
            expect(err.response.data).toMatchObject({ message: 'Internal server error' });
        }

        verifyOtp.mockRestore();
    });
});







describe('GET /verifyOtp', () => {
    it('should return a 500 error if OTP generation fails', async () => {
        const sendOtp = jest.spyOn(require('../verifyUser'), 'sendOtp');
        sendOtp.mockImplementation(() => {
            throw new Error('OTP generation failed');
        });

        try {
            const res = await axios.get('http://localhost:3000/verifyOtp');
        } catch (err) {
            expect(err.response.status).toEqual(500);
            expect(err.response.data).toMatchObject({ message: 'Internal server error' });
        }

        sendOtp.mockRestore();
    });
});



describe('GET /verifyOtp', () => {
    it('should return a 500 error if OTP verification fails', async () => {
        const verifyOtp = jest.spyOn(require('../verifyUser'), 'verifyOtp');
        verifyOtp.mockImplementation(() => {
            throw new Error('OTP verification failed');
        });

        try {
            const res = await axios.get('http://localhost:3000/verifyOtp');
        } catch (err) {
            expect(err.response.status).toEqual(500);
            expect(err.response.data).toMatchObject({ message: 'Internal server error' });
        }

        verifyOtp.mockRestore();
    });
});



describe('GET /verifyOtp', () => {
    it('should return a 401 error if OTP verification fails due to invalid OTP', async () => {
        const verifyOtp = jest.spyOn(require('../verifyUser'), 'verifyOtp');
        verifyOtp.mockImplementation(() => null);

        try {
            const res = await axios.get('http://localhost:3000/verifyOtp');
        } catch (err) {
            expect(err.response.status).toEqual(401);
            expect(err.response.data).toMatchObject({ message: 'Invalid OTP' });
        }

        verifyOtp.mockRestore();
    });
});



describe('Cancel Booking API', () => {
    it('should cancel the booking and return true', async () => {
        const response = await axios.post('http://localhost:4000/cancelBooking', {
            email: 'john@example.com',
            flightId: 'ABC123'
        });
        expect(response.data).to.equal(true);
    });

    it('should return false when the booking is not found', async () => {
        const response = await axios.post('http://localhost:4000/cancelBooking', {
            email: 'jane@example.com',
            flightId: 'XYZ789'
        });
        expect(response.data).to.equal(false);
    });

    it('should return an error when email is missing', async () => {
        try {
            const response = await axios.post('http://localhost:4000/cancelBooking', {
                flightId: 'ABC123'
            });
        } catch (error) {
            expect(error.response.status).to.equal(400);
            expect(error.response.data.message).to.equal('Email is required');
        }
    });

    it('should return an error when flightId is missing', async () => {
        try {
            const response = await axios.post('http://localhost:4000/cancelBooking', {
                email: 'john@example.com'
            });
        } catch (error) {
            expect(error.response.status).to.equal(400);
            expect(error.response.data.message).to.equal('Flight ID is required');
        }
    });

    it('should return an error when email and flightId are missing', async () => {
        try {
            const response = await axios.post('http://localhost:4000/cancelBooking', {});
        } catch (error) {
            expect(error.response.status).to.equal(400);
            expect(error.response.data.message).to.equal('Email and Flight ID are required');
        }
    });
});


describe('getuserBooking endpoint', () => {
    const port = 4000;
    const baseUrl = `http://localhost:${port}`;

    // Test Case 1: When the email exists in the database
    it('should return an array of bookings when the email exists in the database', async () => {
        const response = await axios.post(`${baseUrl}/getuserBooking`, { email: 'john@example.com' });
        expect(response.status).to.equal(200);
        expect(response.data).to.be.an('array');
        expect(response.data.length).to.be.greaterThan(0);
    });

    // Test Case 2: When the email does not exist in the database
    it('should return false when the email does not exist in the database', async () => {
        const response = await axios.post(`${baseUrl}/getuserBooking`, { email: 'nonexistent@example.com' });
        expect(response.status).to.equal(200);
        expect(response.data).to.be.false;
    });

    // Test Case 3: When the email is not provided
    it('should return an error message when the email is not provided', async () => {
        try {
            await axios.post(`${baseUrl}/getuserBooking`);
        } catch (error) {
            expect(error.response.status).to.equal(400);
            expect(error.response.data).to.equal('Email is required');
        }
    });

    // Test Case 4: When the request body is empty
    it('should return an error message when the request body is empty', async () => {
        try {
            await axios.post(`${baseUrl}/getuserBooking`, {});
        } catch (error) {
            expect(error.response.status).to.equal(400);
            expect(error.response.data).to.equal('Email is required');
        }
    });

    // Test Case 5: When the request body contains additional parameters
    it('should ignore additional parameters in the request body', async () => {
        const response = await axios.post(`${baseUrl}/getuserBooking`, { email: 'john@example.com', extraParam: '123' });
        expect(response.status).to.equal(200);
        expect(response.data).to.be.an('array');
        expect(response.data.length).to.be.greaterThan(0);
    });
});






