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
Object.defineProperty(exports, "__esModule", { value: true });
exports.withdraw = exports.getBalanceByWalletId = void 0;
const ethers_1 = require("ethers");
const utils_1 = require("../utils");
const constants_1 = require("../constants");
function getBalanceByWalletId(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { walletId } = req.params;
            if (!walletId) {
                return res.status(400).send({
                    "error": "WalletId is required"
                });
            }
            if (!ethers_1.ethers.utils.isAddress(walletId)) {
                return res.status(400).send({
                    "error": "WalletId is not an address"
                });
            }
            const { web3Provider } = yield (0, utils_1.connectEVM)();
            const tokenContract = new ethers_1.ethers.Contract(constants_1.FEST_TOKEN_ADDRESS, constants_1.ERC20ABI, web3Provider);
            const balanceBigNumber = yield tokenContract.balanceOf(walletId);
            console.log("balance", balanceBigNumber);
            const balance = ethers_1.ethers.utils.formatEther(balanceBigNumber);
            res.status(200).send({
                "balance": balance
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
exports.getBalanceByWalletId = getBalanceByWalletId;
function withdraw(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { wallet_id, amount } = req.body;
            if (!wallet_id || !amount) {
                return res.status(400).send({
                    "error": "Bad Request"
                });
            }
            const { web3Signer } = yield (0, utils_1.connectEVM)();
            const amountBigNumber = ethers_1.ethers.utils.parseEther(String(amount));
            const tokenContract = new ethers_1.ethers.Contract(constants_1.FEST_TOKEN_ADDRESS, constants_1.ERC20ABI, web3Signer);
            const tx = yield tokenContract.functions.transferFrom(wallet_id, process.env.TREASURY_ADDRESS, amountBigNumber);
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
exports.withdraw = withdraw;
