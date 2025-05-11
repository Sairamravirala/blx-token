import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { ethers } from 'ethers'
import Button from '@mui/material/Button'

export const injected = new InjectedConnector({ 
  supportedChainIds: [1, 11155111] // Mainnet + Sepolia
})

export default function WalletConnector() {
  const { activate, deactivate, active, account } = useWeb3React()

  const connectWallet = async () => {
    try {
      await activate(injected)
    } catch (error) {
      console.error('Connection error:', error)
    }
  }

  return (
    <div className="wallet-connector">
      {active ? (
        <Button 
          variant="contained" 
          color="error"
          onClick={deactivate}
        >
          Disconnect {account.slice(0, 6)}...{account.slice(-4)}
        </Button>
      ) : (
        <Button 
          variant="contained" 
          color="primary"
          onClick={connectWallet}
        >
          Connect Wallet
        </Button>
      )}
    </div>
  )
}