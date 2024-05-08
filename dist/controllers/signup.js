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
exports.signup = void 0;
const db_1 = __importDefault(require("../db"));
const ethers_1 = require("ethers");
function signup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //get body from request
            const { email, name, password } = req.body;
            if (!email) {
                res.status(400).send({
                    "error": "Bad Request"
                });
                return;
            }
            const newWallet = ethers_1.ethers.Wallet.createRandom();
            const walletId = newWallet.address;
            const walletAddress = newWallet.address;
            const walletPrivateKey = newWallet.privateKey;
            //generate a random code with 8 characters
            const referralCode = Math.random().toString(36).substring(2, 10);
            yield db_1.default.query(`
      INSERT INTO influencers(
        name, password, email, wallet_id, wallet_address, referral_code, private_key
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7
      );
    `, [name, password, email, walletId, walletAddress, referralCode, walletPrivateKey]);
            res.status(200).send({
                "wallet_id": walletId,
                "wallet_address": walletAddress,
                "referral_code": referralCode
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).send({
                "error": "Internal Server Error"
            });
        }
    });
}
exports.signup = signup;
