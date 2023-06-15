import {
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  useToast,
} from '@chakra-ui/react'
import { GrFormNextLink, GrHost } from 'react-icons/gr'
import { useState } from 'react'
import { TbPlugConnected } from 'react-icons/tb'
import { testConnectToDB } from 'services/migrate-mongo'
import { useDatabaseMigrationStore } from 'contexts/useDatabaseMigrationStore'

// @ts-ignore
import { ConnectButton  } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi'

// @todo: extend from Stepper.Step
export default function WalletButton({ handleNextStepClick }) {
  const [readyToConnect, setReadyToConnect] = useState(false)
  const { address,isConnected } = useAccount()
  const [loadingTest, setLoadingTest] = useState(false)
  const toast = useToast()
  const { mongoHost, setMongoHost } = useDatabaseMigrationStore()

  const customToast = ({ text, status = 'info' }) => {
    return toast({
      title: text,
      status: status,
      isClosable: true,
      position: 'bottom-left',
    })
  }

  

  return (
    <Stack px={5}>
      <FormControl id="host">
        
      </FormControl>
      <Flex align={'center'} justify={'space-between'}>
         <ConnectButton  chainStatus="name"  />
        <Button
          onClick={handleNextStepClick}
          disabled={!isConnected}
          rightIcon={<GrFormNextLink />}
        >
          Next Step
        </Button>
      </Flex>
    </Stack>
  )
}
