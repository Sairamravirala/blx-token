import { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import VAULT_ABI from '../contracts/vaultAbi.json'
import { Button, TextField, Box, Typography } from '@mui/material'

const VAULT_ADDRESS = import.meta.env.VITE_VAULT_CONTRACT

export default function Vault() {
  const { library, account } = useWeb3React()
  const [amount, setAmount] = useState('')
  const [rewards, setRewards] = useState('0')

  useEffect(() => {
    const fetchRewards = async () => {
      if (library && account) {
        const vault = new ethers.Contract(
          VAULT_ADDRESS,
          VAULT_ABI,
          library.getSigner()
        )
        const reward = await vault.calculateRewards(account)
        setRewards(ethers.utils.formatUnits(reward, 18))
      }
    }
    fetchRewards()
  }, [library, account])

  const deposit = async () => {
    if (!library || !account) return
    
    const vault = new ethers.Contract(
      VAULT_ADDRESS,
      VAULT_ABI,
      library.getSigner()
    )
    
    const tx = await vault.deposit(ethers.utils.parseUnits(amount, 18))
    await tx.wait()
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6">Vault (10% APY)</Typography>
      <Typography>Pending Rewards: {rewards} BLX</Typography>
      <TextField
        label="Amount to Deposit"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        fullWidth
        sx={{ mt: 2 }}
      />
      <Button 
        variant="contained" 
        onClick={deposit}
        sx={{ mt: 2 }}
      >
        Deposit
      </Button>
    </Box>
  )
}