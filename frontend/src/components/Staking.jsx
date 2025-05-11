import { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import STAKING_ABI from '../contracts/stakingAbi.json'
import { Button, TextField, Box, Typography } from '@mui/material'

const STAKING_ADDRESS = import.meta.env.VITE_STAKING_CONTRACT

export default function Staking() {
  const { library, account } = useWeb3React()
  const [amount, setAmount] = useState('')
  const [staked, setStaked] = useState('0')
  const [rewards, setRewards] = useState('0')

  useEffect(() => {
    const fetchStakingInfo = async () => {
      if (library && account) {
        const staking = new ethers.Contract(
          STAKING_ADDRESS,
          STAKING_ABI,
          library.getSigner()
        )
        
        const stake = await staking.stakes(account)
        setStaked(ethers.utils.formatUnits(stake.amount, 18))
        
        const reward = await staking.calculateReward(account)
        setRewards(ethers.utils.formatUnits(reward, 18))
      }
    }
    fetchStakingInfo()
  }, [library, account])

  const stakeTokens = async () => {
    if (!library || !account) return
    
    const staking = new ethers.Contract(
      STAKING_ADDRESS,
      STAKING_ABI,
      library.getSigner()
    )
    
    const tx = await staking.stake(ethers.utils.parseUnits(amount, 18))
    await tx.wait()
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6">Staking (10% APR)</Typography>
      <Typography>Staked: {staked} BLX</Typography>
      <Typography>Rewards: {rewards} BLX</Typography>
      <TextField
        label="Amount to Stake"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        fullWidth
        sx={{ mt: 2 }}
      />
      <Button 
        variant="contained" 
        onClick={stakeTokens}
        sx={{ mt: 2 }}
      >
        Stake
      </Button>
    </Box>
  )
}