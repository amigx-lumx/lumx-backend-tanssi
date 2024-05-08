import { ethers, logger } from "ethers";

export async function connectEVM(): Promise<{
    web3Provider: ethers.providers.JsonRpcProvider,
    web3Signer: ethers.Signer,
    signerAddress: string
} | null>{
    try{
        const httpProviderWeb3:string  = String(process.env.PROVIDER_URL);
        const web3Provider = new ethers.providers.JsonRpcProvider(httpProviderWeb3);

        const account = ethers.utils.HDNode.fromMnemonic(String(process.env.MNEMONIC)); 

        const web3Signer = new ethers.Wallet(account, web3Provider);

        const signerAddress = web3Signer.address;
        logger.info(`Connected to EVM with address ${signerAddress}.`);
        
        return {
            web3Provider,
            web3Signer,
            signerAddress
        }

    } catch(err){
        console.error(err);
        return null;
    }
}
