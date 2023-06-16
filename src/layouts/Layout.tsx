import {
  Box,
  Button,
  CloseButton,
  Drawer,
  DrawerContent,
  Flex,
  HStack,
  Icon,
  Link,
  useColorMode,
  useDisclosure,
  useColorModeValue,
  IconButton,
} from '@chakra-ui/react'

import { FiGitCommit, FiGitMerge, FiMenu, FiCpu } from 'react-icons/fi'
import { useRouter } from 'next/router'
import { IoMdMoon, IoMdSunny } from 'react-icons/io'

export default function Layout({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  
  return (
    <Flex
      flexDirection="column"
      minH="100vh"
      bg={useColorModeValue('gray.100', 'gray.900')}
    >
      <SidebarContent onClose={() => onClose} display="none" />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} onClick={onClose} />
        </DrawerContent>
      </Drawer>
      
      <MobileNav
       onOpen={onOpen}
      />
      <Box flex="1" ml={{ base: 0 }} p="4">
        {children}
      </Box>
      <Box>
       
      </Box>
    </Flex>
  )
}

const MobileNav = ({ onOpen, ...rest }) => {
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
     <Flex gap={{ base: 2, md: 4 }} align="center" mr="4" h="100%">
        <IconButton
          display={{ base: 'flex' }}
          onClick={onOpen}
          variant="outline"
          aria-label="open menu"
          icon={<FiMenu />}
        />
        </Flex>

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

const SidebarContent = ({ onClose, ...rest }) => {
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full' }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Flex display={{ base: 'flex' }} h="100%" align="center">
        </Flex>
        <CloseButton onClick={onClose} />
      </Flex>
      <NavItem icon={FiGitCommit} hrefPath="/migrate">
        Migrate From MongoDB
      </NavItem>
      <NavItem icon={FiGitMerge} hrefPath={'/import'}>
        Import into MongoDB
      </NavItem>
      <NavItem icon={FiCpu} hrefPath={'/deal_fvm'}>
        Migrate with a deal 
      </NavItem>
      
    </Box>
  )
}

const NavItem = ({ icon, hrefPath = '/', children, ...rest }) => {
  const router = useRouter()

  return (
    <Link
      onClick={() => router.push(`${hrefPath}`)}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
      cursor={'pointer'}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'brand.400',
          color: 'white',
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  )
}