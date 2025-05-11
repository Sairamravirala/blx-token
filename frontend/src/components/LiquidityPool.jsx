import { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import POOL_ABI from '../contracts/poolAbi.json'
import { Button, TextField, Box, Typography } from '@mui/material'

const POOL_ADDRESS = import.meta.env.VITE_POOL_CONTRACT

export default function LiquidityPool() {
  const { library, account } = useWeb3React()
  const [blxAmount, setBlxAmount] = useState('')
  const [ethAmount, setEthAmount] = useState('')

  const addLiquidity = async () => {
    if (!library || !account) return
    
    const poolContract = new ethers.Contract(
      POOL_ADDRESS,
      POOL_ABI,
      library.getSigner()
    )
    
    const tx = await poolContract.addLiquidity(
      ethers.utils.parseUnits(blxAmount, 18),
      ethers.utils.parseUnits(ethAmount, 18)
    )
    await tx.wait()
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6">Add Liquidity</Typography>
      <TextField
        label="BLX Amount"
        value={blxAmount}
        onChange={(e) => setBlxAmount(e.target.value)}
        fullWidth
        sx={{ mt: 2 }}
      />
      <TextField
        label="ETH Amount"
        value={ethAmount}
        onChange={(e) => setEthAmount(e.target.value)}
        fullWidth
        sx={{ mt: 2 }}
      />
      <Button 
        variant="contained" 
        onClick={addLiquidity}
        sx={{ mt: 2 }}
      >
        Add Liquidity
      </Button>
    </Box>
  )
}