require('dotenv').config({ path: `${process.cwd()}/.env` });

const express = require('express');

const authRouter = require('./router/authRoute');

const app = express();

app.use(express.json());


app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'welcome rest!'
    });

});



// all routes will be here //

app.use('/api/v1/auth', authRouter);

const PORT = process.env.APP_PORT || 4000;

app.listen(PORT, () => {
    console.log('server is running');
}
    

)