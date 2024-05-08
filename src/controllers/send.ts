import { Request, Response } from "express";
import connection from "../db";
import { connectEVM } from "../utils";
import { ethers } from "ethers";
import { ERC20ABI, FEST_TOKEN_ADDRESS } from "../constants";


export async function sendTokens(req: Request, res: Response) {
    try{

        const {referral_code, event_id } = req.body;

        if (!referral_code || !event_id){
            res.status(400).send({
                "error": "Bad Request"
            });
            return;
        }

        const wallets = await connection.query(`
            SELECT wallet_id FROM influencers WHERE referral_code = $1;
        `,[referral_code]);

        const wallet_id = wallets.rows[0].wallet_id;

        const amounts = await connection.query(`
            SELECT reward_per_sell FROM events WHERE id = $1;
        `,[event_id]);

        const amount = amounts.rows[0].reward_per_sell;


        const {web3Signer} = await connectEVM() as any;

        const tokenContract = new ethers.Contract(FEST_TOKEN_ADDRESS, ERC20ABI, web3Signer);

        const tx = await tokenContract.functions.mint(wallet_id, ethers.utils.parseEther(String(amount)));
        await tx.wait();

        res.status(200).send({
            "tx_id": tx.hash
        });


    } catch(err){
        console.log(err);
        res.status(500).send({
            "error": "Internal Server Error"
        });
    }
}