"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
dotenv_1.default.config({ path });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const hodlcoin_1 = require("./controllers/hodlcoin");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const port = process.env.PORT || 4000;
app.post("/vault", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, hodlcoin_1.createVault)(req, res); }));
app.get("/vaults", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, hodlcoin_1.getVaults)(req, res); }));
app.get("/vault/:vaultAddress", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, hodlcoin_1.vetVaultByAddress)(req, res); }));
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
