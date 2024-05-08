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
exports.connectEVM = void 0;
const ethers_1 = require("ethers");
function connectEVM() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const httpProviderWeb3 = String(process.env.PROVIDER_URL);
            const web3Provider = new ethers_1.ethers.providers.JsonRpcProvider(httpProviderWeb3);
            const account = ethers_1.ethers.utils.HDNode.fromMnemonic(String(process.env.MNEMONIC));
            const web3Signer = new ethers_1.ethers.Wallet(account, web3Provider);
            const signerAddress = web3Signer.address;
            ethers_1.logger.info(`Connected to EVM with address ${signerAddress}.`);
            return {
                web3Provider,
                web3Signer,
                signerAddress
            };
        }
        catch (err) {
            console.error(err);
            return null;
        }
    });
}
exports.connectEVM = connectEVM;
