import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react'
import { IoMdMoon, IoMdSunny } from 'react-icons/io'
export default function Layout({ children }) {
  return (
    <Flex
      flexDirection="column"
      minH="100vh"
      bg={useColorModeValue('gray.100', 'gray.900')}
    >
      
      <MobileNav/>
      <Box flex="1" ml={{ base: 0 }} p="4">
        {children}
      </Box>
      <Box>
       
      </Box>
    </Flex>
  )
}



const MobileNav = ({  ...rest }) => {
  const navbarIcon = useColorModeValue('brand.500', 'white')
  const { colorMode, toggleColorMode } = useColorMode()
  

  return (
    <Flex
      ml={{ base: 0 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between' }}
      {...rest}
    >
     

      <HStack spacing={{ base: '2', md: '6' }}>
       
        <Button
          variant="no-hover"
          bg="transparent"
          p="0px"
          minW="unset"
          minH="unset"
          h="18px"
          w="max-content"
          onClick={toggleColorMode}
          display={{ base: 'none', md: 'unset' }}
        >
          <Icon
            h="18px"
            w="18px"
            color={navbarIcon}
            as={colorMode === 'light' ? IoMdMoon : IoMdSunny}
          />
        </Button>
        
      </HStack>
    </Flex>
  )
}
