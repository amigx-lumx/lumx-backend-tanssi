import { ethers } from "ethers";
import { Request, Response } from "express";
import { connectEVM } from "../utils";
import { ERC20ABI, FEST_TOKEN_ADDRESS } from "../constants";


export async function getBalanceByWalletId(req: Request, res: Response) {
    try{

        const { walletId } = req.params;

        if(!walletId) {
            return res.status(400).send({
                "error": "WalletId is required"
            })
        }

        if(!ethers.utils.isAddress(walletId)){
            return res.status(400).send({
                "error": "WalletId is not an address"
            })
        }

        const {web3Provider} = await connectEVM() as any;

        const tokenContract = new ethers.Contract(FEST_TOKEN_ADDRESS, ERC20ABI, web3Provider);

        const balanceBigNumber = await tokenContract.balanceOf(walletId);
        const balance = ethers.utils.formatEther(balanceBigNumber[0]);


        res.status(200).send({
            "balance": balance
        });



    } catch(err) {
        console.log(err);
        res.status(500).send({
            "error": "Internal Server Error"
        });
    }
}

export async function withdraw(req: Request, res: Response) {
    try{

        const { wallet_id, amount } = req.body;

        if(!wallet_id || !amount) {
            return res.status(400).send({
                "error": "Bad Request"
            })
        }


        const {web3Signer} = await connectEVM() as any;

        const amountBigNumber = ethers.utils.parseEther(String(amount));

        const tokenContract = new ethers.Contract(FEST_TOKEN_ADDRESS, ERC20ABI, web3Signer);

        const tx = await tokenContract.functions.transferFrom(wallet_id, process.env.TREASURY_ADDRESS, amountBigNumber);
        await tx.wait();
        

        res.status(200).send({
            "tx_id": tx.hash
        });

    } catch(err) {
        console.log(err);
        res.status(500).send({
            "error": "Internal Server Error"
        });
    }
}