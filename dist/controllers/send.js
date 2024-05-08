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
exports.sendTokens = void 0;
const db_1 = __importDefault(require("../db"));
const utils_1 = require("../utils");
const ethers_1 = require("ethers");
const constants_1 = require("../constants");
function sendTokens(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { referral_code, event_id } = req.body;
            if (!referral_code || !event_id) {
                res.status(400).send({
                    "error": "Bad Request"
                });
                return;
            }
            const wallets = yield db_1.default.query(`
            SELECT wallet_id FROM influencers WHERE referral_code = $1;
        `, [referral_code]);
            const wallet_id = wallets.rows[0].wallet_id;
            const amounts = yield db_1.default.query(`
            SELECT reward_per_sell FROM events WHERE id = $1;
        `, [event_id]);
            const amount = amounts.rows[0].reward_per_sell;
            const { web3Signer } = yield (0, utils_1.connectEVM)();
            const tokenContract = new ethers_1.ethers.Contract(constants_1.FEST_TOKEN_ADDRESS, constants_1.ERC20ABI, web3Signer);
            const tx = yield tokenContract.functions.mint(wallet_id, ethers_1.ethers.utils.parseEther(String(amount)));
            yield tx.wait();
            res.status(200).send({
                "tx_id": tx.hash
            });
        }
        catch (err) {
            console.log(err);
            res.status(500).send({
                "error": "Internal Server Error"
            });
        }
    });
}
exports.sendTokens = sendTokens;
