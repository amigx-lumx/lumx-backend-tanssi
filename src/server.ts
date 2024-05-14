import dotenv from "dotenv";
const path = process.env.NODE_ENV === "test" ? ".env.test" : ".env";

dotenv.config({ path });

import express from 'express';
import cors from 'cors';
import { createVault, getVaults, vetVaultByAddress } from "./controllers/hodlcoin";




const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 4000;

app.post("/vault", async (req, res) => await createVault(req, res));
app.get("/vaults", async (req, res) => await getVaults(req, res));
app.get("/vault/:vaultAddress", async (req, res) => await vetVaultByAddress(req, res));


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
