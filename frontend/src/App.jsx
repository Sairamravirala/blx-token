import './App.css'
import WalletConnector from './components/WalletConnector'
import TokenDashboard from './components/TokenDashboard'
import LiquidityPool from './components/LiquidityPool'
import Vault from './components/Vault'
import Staking from './components/Staking'
import { Web3ReactProvider } from '@web3-react/core'
import { ethers } from 'ethers'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function getLibrary(provider) {
  return new ethers.providers.Web3Provider(provider)
}

function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <div className="app-container">
        <WalletConnector />
        <TokenDashboard />
        <LiquidityPool />
        <Vault />
        <Staking />
        <ToastContainer position="bottom-right" />
      </div>
    </Web3ReactProvider>
  )
}

export default App