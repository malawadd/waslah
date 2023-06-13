import {
  Badge,
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react'
import { useDatabaseMigrationStore } from 'contexts/useDatabaseMigrationStore'
import { useCallback, useEffect, useRef, useState } from 'react'
import { migrateIPFSToMongDB } from 'services/migrate-mongo'
import { useRouter } from 'next/router'
import { object, string } from 'yup'
import { RiEyeCloseLine } from 'react-icons/ri'
import { MdOutlineRemoveRedEye } from 'react-icons/md'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'

const formSchema = object({
  selectedSDB: string().nullable(),
  dbUser: string().required('Required.'),
  dbPassword: string().nullable(),

  
})

interface FormValues {
  selectedSDB: null
  dbUser: string
  dbPassword: string

}

export default function MongoStepProceedToImport({
  handlePreviousStepClick,
  currentDb,
}) {
  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(formSchema),
    defaultValues: { dbPassword: null, dbUser: null },
  })

  const [show, setShow] = useState(false)


  const handleClick = () => setShow(!show)

  const brandStars = useColorModeValue('brand.500', 'brand.400')
  const textColor = useColorModeValue('navy.700', 'white')


  const [loading, setLoading] = useState(false)
  const toast = useToast()

  const { selectedCollections, spheronstoreDatabases, mongoHost } =
    useDatabaseMigrationStore()

  const handleStartMigrationClick = useCallback(
    async ({ dbPassword, dbUser, selectedSDB }: FormValues) => {


      let mongoConfig = {
        host: mongoHost,
        dbName: currentDb,
        selectedCollections,
      }

      let cid = {
        dbName: null,
        dbHost: null,
        dbUser,
        dbPassword:null,
      }

 
      console.log(cid)

      setLoading(true)

      try {
        let response = await migrateIPFSToMongDB({
          mongoConfig,
          cid,
        })
        console.log('Migration complete', response)
        const { success, error, migratedCollections } = response || {}
        setLoading(false)
        const errors = []

        if (response.message === 'All JSON files inserted into MongoDB successfully'){
          toast({
            title:
              `Successfully migrated into MongoDB Collections` +
              (errors.length > 0 ? `\nErrors: ${errors}` : ''),
            isClosable: true,
            duration: 15000,
            status: 'success',
          })
        } else {
          toast({
            title: 'An error was encountered during migration',
            isClosable: true,
            status: 'error',
          })
        }
        
        
        
        // await router.push('/dashboard')
      } catch (err) {
        console.log(err)
        setLoading(false)
        toast({
          title: 'An error was encountered during migration',
          isClosable: true,
          status: 'error',
        })
      }
    },
    [mongoHost, selectedCollections, currentDb]
  )



  return (
    <Box>
      <Text>Selected Collections</Text>
      <Stack direction="row" my={2}>
        {selectedCollections?.map((collectionName, i) => (
          <Badge key={i}>{collectionName}</Badge>
        ))}
      </Stack>


      {mongoHost.length > 0 ? (
        <>
          <form
            onSubmit={handleSubmit(handleStartMigrationClick)}
            style={{ marginTop: 24 }}
          >
            <FormControl isInvalid={!!errors.selectedSDB} mb="24px">
              <FormLabel
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                {...register('selectedSDB')}
              >
              </FormLabel>
              
              
              <FormErrorMessage>
                {errors.selectedSDB && (errors.selectedSDB?.message as any)}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.dbUser} mb="24px">
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
              >
                Enter the cid for your data  <Text color={brandStars}> *</Text>
              </FormLabel>
              <Input
                {...register('dbUser')}
                variant="auth"
                fontSize="sm"
                placeholder="aiirtbk3zxrzygudmvsontcxacqjxyccm..."
                fontWeight="500"
                size="lg"
                autoComplete={'dbUser'}
              />
              <FormErrorMessage>
                {errors.dbUser && errors.dbUser.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.dbPassword} mb="24px">
              <FormLabel
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                {...register('dbPassword')}
              >
              </FormLabel>
             
      
              <FormErrorMessage>
                {errors.dbPassword && errors.dbPassword.message}
              </FormErrorMessage>
            </FormControl>

            <Box textAlign={'center'}>
              <Button
                isLoading={loading}
                loadingText={'Migrating Data'}
                type="submit"
                colorScheme={'mongo'}
                style={{ margin: 10 }}
              >
                Start Migrating Data
              </Button>
            </Box>
          </form>
        </>
      ) : (
        <Text>
           not supposed to see this 
        </Text>
      )}

        
      <Box mt={2}>
        <Button onClick={handlePreviousStepClick}>Prev Step</Button>
      </Box>
    </Box>
  )
}
