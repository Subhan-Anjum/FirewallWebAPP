const { connection } = require('../../utils/database');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const logs=require('./backendLogs');

async function buyProduct(req, response) {
    const productId = req.body.productId;
    const userId = req.body.userId;
    const quantity = req.body.quantity;
    const price = req.body.price;
    const image = req.body.image;
    console.log(productId);

    connection.query(`SELECT * FROM inventory WHERE Id=${productId}`, async (err, res) => {
        if(err) {
            logs.saveLogs(err.message,'/buyProduct');
            return;
        }
        else {
            if (res[0].quantity - quantity < 0) {
                return response.status(200).json({ message: "outofstock" });
            } else {
                    const session = await stripe.checkout.sessions.create({
                        payment_method_types: ['card'],
                        line_items: [
                            {
                                price_data: {
                                    currency: 'pkr',
                                    product_data: {
                                        name: 'Product',
                                        images:[`http://localhost:4000/images/${image}`],
                                    },
                                    unit_amount: price*100, 
                                },
                                quantity: quantity,
                            },
                        ],
                        mode: 'payment',
                        success_url: `http://localhost:4000/buy?session_id={CHECKOUT_SESSION_ID}&productId=${productId}&userId=${userId}&quantity=${quantity}&price=${price}`,
                        cancel_url: 'http://localhost:3000/cancel',
                    });
                    response.status(200).json({ sessionUrl: session.url });
            }
        }
    });
}

module.exports = {
    buyProduct,
};
