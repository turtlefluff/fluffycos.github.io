import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const CLIENT_ID = "ASq1mMaQlLU1x3L_t28NYonRdwx_TVi2yJ9_rRTJoTxorIEcnky6YGROl_b0St3m1pv0espAEr9VlBFr";
const CLIENT_SECRET = "EGqSGh3Yyrubhdsg9bb71F6b1GLspMFToJyGDLI6rblZXIsk4Yg6eotKZUpbeKooKnDQVu_lalLtGyu2";
const PAYPAL_API = "https://api-m.sandbox.paypal.com"; // switch to api-m.paypal.com for live

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
    console.error(err);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

app.listen(3000, () => console.log("✅ Server running at http://localhost:3000"));
