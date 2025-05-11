import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import BLX_ABI from '../contracts/blxAbi.json'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'

const BLX_ADDRESS = import.meta.env.VITE_BLX_CONTRACT

export default function TokenDashboard() {
  const { library, account } = useWeb3React()
  const [balance, setBalance] = useState('0')

  useEffect(() => {
    const fetchBalance = async () => {
      if (library && account) {
        const contract = new ethers.Contract(
          BLX_ADDRESS,
          BLX_ABI,
          library.getSigner()
        )
        const bal = await contract.balanceOf(account)
        setBalance(ethers.utils.formatUnits(bal, 18))
      }
    }
    fetchBalance()
  }, [library, account])

  return (
    <Card sx={{ p: 3, mt: 2 }}>
      <Typography variant="h5">BLX Token Dashboard</Typography>
      <Typography variant="body1">
        Your Balance: {balance} BLX
      </Typography>
    </Card>
  )
}