import { Request, Response } from "express";
import connection from "../db";
import { ethers } from "ethers";
import { ERC20Abi } from "../utils/abis/ERC20";


export async function createVault(req: Request, res: Response) {
  try{

    const {
      name,
      symbol,
      chainId,
      address,
      coin,
      vaultCreatorTreasury,
      devTreasury,
      reserveFee,
      vaultCreatorFee,
      devFee,
    } = req.body;

    const provider = new ethers.providers.JsonRpcProvider(`https://scroll-sepolia.blockpi.network/v1/rpc/public`);

    const ERC20Contract = new ethers.Contract(coin, ERC20Abi, provider);

    const assetName  = await ERC20Contract.functions.name();

    connection.query(`
      INSERT INTO vaults(name, symbol, chain_id, address, coin_contract, coin_name, vault_creator_treasury, dev_treasury, reserve_fee, vault_creator_fee, dev_fee)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `, [name, symbol, chainId, address, coin, assetName, vaultCreatorTreasury, devTreasury, reserveFee, vaultCreatorFee, devFee]);

    return res.status(201).send({
      "message": "Vault created successfully"
    });

    } catch(err){

    // string memory name, string memory symbol, 
    //     address _coin, address _vaultCreatorTreasury,address _devTreasury, 
    //     uint256 _reserveFee, uint256 _vaultCreatorFee, uint256 _devFee,
    //     uint256 _initialReserve
    console.error(err);
    return res.status(500).send({
      "error": "Internal Server Error"
    });
  }
}

export async function getVaults(req: Request, res: Response) {
  try{
    const vaults = await connection.query(`
      SELECT * FROM vaults
    `);

    return res.status(200).send({
      "vaults": vaults.rows
    });

  } catch(err){
    console.error(err);
    return res.status(500).send({
      "error": "Internal Server Error"
    });
  }
}

export async function vetVaultByAddress(req: Request, res: Response) {
  try{
    const { vaultAddress } = req.params;

    console.log(vaultAddress);

    const vault = await connection.query(`
      SELECT * FROM vaults WHERE address = $1
    `, [vaultAddress]);

    console.log(vault);

    if(vault.rows.length === 0){
      return res.status(404).send({
        "error": "Vault not found"
      });
    }

    return res.status(200).send({
      "vault": vault.rows[0]
    });

  } catch(err){
    console.error(err);
    return res.status(500).send({
      "error": "Internal Server Error"
    });
  }
}

