import express from "express";
import fetch from "node-fetch";

const app = express();

const CLIENT_ID = "YOUR_PAYPAL_CLIENT_ID";
const CLIENT_SECRET = "YOUR_PAYPAL_CLIENT_SECRET";
const PAYPAL_API = "https://api-m.sandbox.paypal.com"; // use api-m.paypal.com for live

async function getAccessToken() {
  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Authorization": "Basic " + Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  });
  const data = await res.json();
  return data.access_token;
}

app.get("/product/:id", async (req, res) => {
  try {
    const token = await getAccessToken();
    const productRes = await fetch(`${PAYPAL_API}/v2/catalogs/products/${req.params.id}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const productData = await productRes.json();
    res.json(productData);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
