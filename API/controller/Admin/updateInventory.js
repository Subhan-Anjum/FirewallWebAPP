const jwt = require('jsonwebtoken');
const strftime = require('strftime');
const { connection } = require('../../utils/database');
const logs=require('../Users/backendLogs');

async function updateInventory(req, response) {
  try {
    const name = req.body.name;
    const price = req.body.price;
    const stock = req.body.stock;
    const description = req.body.description;
    const brand = req.body.brand;
    const id = req.query.id;
    const now = new Date();
    const dateCreated = strftime('%Y-%m-%d %H:%M:%S', now);
    let oldValue={};

    connection.query(`SELECT * FROM inventory WHERE Id=${id}`,(err,res)=>{
      if(err) {
        logs.saveLogs(err.message,'/updateInventory');
        return;
      }
      else{
        oldValue=res[0];
        connection.query('INSERT INTO inventory_audit (userid, action, oldValue, newValue,dated) VALUES (?, ?, ?, ?,?)', [1, 'UPDATE', JSON.stringify(oldValue), JSON.stringify({ name:name,price:price,stock:stock,description:description,brand:brand }),dateCreated], (err, auditResult) => {
          if(err) {
            logs.saveLogs(err.message,'/updateInventory');
            return;
          }
          else{
              const brandQuery = `SELECT * FROM brands WHERE brandName = ?`;

              connection.query(brandQuery, [brand], (err, brandResult) => {
                if(err) {
                  logs.saveLogs(err.message,'/updateInventory');
                  return;
                }
      
                if (brandResult.length === 0) {
                  return response.status(404).json({ message: 'Brand not found' });
                }
      
                const updateQuery = req.file
                  ? `UPDATE inventory SET name=?, image=?, price=?, stock=?, description=?, brandId=?, updatedAt=? WHERE Id=?`
                  : `UPDATE inventory SET name=?, price=?, stock=?, description=?, brandId=?, updatedAt=? WHERE Id=?`;
      
                const updateParams = req.file
                  ? [name, req.file.filename, price, stock, description, brandResult[0].Id, dateCreated, id]
                  : [name, price, stock, description, brandResult[0].Id, dateCreated, id];
      
                connection.query(updateQuery, updateParams, (err, updateResult) => {
                  if(err) {
                    logs.saveLogs(err.message,'/updateInventory');
                    return;
                  }
                return response.status(200).json({ message: 'updated' });
                });
            });
          }   
      });
      }
    })
  } catch (error) {
    console.error('Unhandled error:', error);
    return response.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports = {
  updateInventory,
};
