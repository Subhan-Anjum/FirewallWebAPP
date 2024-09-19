const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { connection } = require('../../utils/database');
const logs = require('./backendLogs');

function GenerateToken(user) {
    const payload = {
        role: user.Role,
        id: user.Id,
    };
    const token = jwt.sign(payload, '123456asdfghjkljasjdhgasdyt6rt2376tuasgd');
    return token;
}

async function Login(req, response) {
    const email = req.body.email;
    const password = crypto.createHash('sha256').update(req.body.password).digest('hex');

    connection.query(`SELECT * FROM users WHERE email='${email}' and password='${password}' and Role='User' and Active=true`, (err, res) => {
        if (err) {
            logs.saveLogs(err.message, '/login');
            return;
        }
        else {
            if (res.length == 0) {
                console.log("Login Failed");
                return response.status(200).json({ message: "invalid" });
            }
            else {
                console.log("Login Success");
                var token = GenerateToken(res);
                console.log(token);
                return response.status(200).json({
                    message: 'success',
                    email: email,
                    userid: res[0].Id,
                    token: token,

                });
            }
        }
    })
}

module.exports = {
    Login,
}
