// Model/paypal.js
const paypal = require('@paypal/checkout-server-sdk');

const environment = new paypal.core.SandboxEnvironment(
  'ATjm3r8Bnsd8hY6G6tcSBkCKshfPK1YjhJmERxskMnEDmGn3fo6EfEh89ztAX-ERd_oK-u_G4BVPViCG',  // client id from app hopeconnect in paypal
  'EAZPjspkShgD1Saok_achafYVGp4HTQ-FxsxcN-NYvLwh3V1qKS0qyvNqYQtEFp59TUtrKw5NLx1fyuZ'   // client secret from app hopeconnect in paypal
);
const client = new paypal.core.PayPalHttpClient(environment);     //انشااء عميل 

module.exports = client;
