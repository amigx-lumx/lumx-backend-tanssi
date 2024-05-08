import { Request, Response } from "express";
import connection from "../db";
import { ethers } from "ethers";



export async function signup(req: Request, res: Response) {
  try{
    //get body from request
    const { email, name, password} = req.body;
    if(!email){
      res.status(400).send({
        "error": "Bad Request"
      });
      return;
    }

    const newWallet = ethers.Wallet.createRandom();

    const walletId = newWallet.address;
    const walletAddress = newWallet.address;
    const walletPrivateKey = newWallet.privateKey;



    //generate a random code with 8 characters
    const referralCode = Math.random().toString(36).substring(2, 10);

    await connection.query(`
      INSERT INTO influencers(
        name, password, email, wallet_id, wallet_address, referral_code, private_key
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7
      );
    `,[name, password, email, walletId, walletAddress, referralCode, walletPrivateKey]);


    res.status(200).send({
        "wallet_id": walletId,
        "wallet_address": walletAddress,
        "referral_code": referralCode
    });

  } catch (error) {
    console.error(error);
    res.status(500).send({
        "error": "Internal Server Error"
    });
  }
}