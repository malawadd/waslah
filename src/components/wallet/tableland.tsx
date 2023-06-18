import {
  Badge,
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react'
import { useDatabaseMigrationStore } from 'contexts/useDatabaseMigrationStore'
import { useCallback, useEffect, useRef, useState } from 'react'
import { migrateMongoDBToSpheronStore } from 'services/migrate-mongo'
import { useRouter } from 'next/router'
import { object, string } from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { dealClient } from 'utils/contract'
// @ts-ignore
import { useContractWrite, useAccount, useWaitForTransaction } from 'wagmi'
const CID = require('cids')
import {carSize} from 'services/get-size'
import {currentepoch} from 'services/chainstatus'
import { Database } from "@tableland/sdk";



const formSchema = object({
  dbUser: string().required('Required.'),

})

interface FormValues {
  dbUser: string
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
    defaultValues: { dbUser: null },
  })
  const databasesRef = useRef({})
  const [show, setShow] = useState(false)
  const [spheronlink, setSpheronLink] = useState()

  const handleClick = () => setShow(!show)

  const brandStars = useColorModeValue('brand.500', 'brand.400')
  const textColor = useColorModeValue('navy.700', 'white')
  const textColorSecondary = 'gray.400'

  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const router = useRouter()
  const { address,isConnected } = useAccount()
  const { write,data } = useContractWrite({
      // @ts-ignore
      address: dealClient.address,
      // @ts-ignore
      abi: dealClient.abi,
      // @ts-ignore
      chainId: 314159 ,
      // @ts-ignore
      functionName: 'makeDealProposal',
    });
  
    const waitForTransaction =  useWaitForTransaction({
      chainId: 314159,
      hash: data?.hash,
      onSuccess(data){
        setLoading(false)
        toast({
          title:
            `deal created successfully`,
          isClosable: true,
          duration: 15000,
          status: 'success',
        })
      }
      })
  const { selectedCollections, spheronstoreDatabases, mongoHost } =
    useDatabaseMigrationStore()
  

  const handleStartMigrationClick = useCallback(
    async ({dbUser}: FormValues) => {
      let mongoConfig = {
        host: mongoHost,
        dbName: currentDb,
        selectedCollections,
      }

      let spheronStoreConfig = {
        dbName: null,
        dbHost: null,
        dbUser,
        dbPassword:null,
      }

      console.log(spheronStoreConfig)

      setLoading(true)

      try {
        let response = await migrateMongoDBToSpheronStore({
          mongoConfig,
          spheronStoreConfig,
        })
        console.log('Migration complete', response)
        setSpheronLink(response.protocolLink)
        const { success, error, migratedCollections } = response || {}
        const db = new Database(address);
        const tableName = `Waslah_${address.substring(0, 5)}`
        

        const fileUrl = response.protocolLink
        const hash = fileUrl.match(/\/([^/]+)\./)[1].split('.')[0];
        const cidHexRaw = new CID(hash).toV1().toString('base16').substring(1)
        const cidHex = "0x" + cidHexRaw
        // @ts-ignore
        const epochApi  = await currentepoch()
        let epoch = 0 
        if (epochApi != error){
           epoch = epochApi
        } else {
          epoch = 750523
        }
        console.log('epoch is ' , epoch )
        const carsize = await carSize({ string: fileUrl }) ; 
        
        const filesize = carsize.fileSize
        console.log('carsize' ,carsize )
    
        console.log('filesize is ', filesize)
        try{

            if (isConnected) {
                const extraParamsV1 = [fileUrl, 10000, false, false]
                const DealRequestStruct = await [
                    cidHex,
                    filesize,
                    false,
                    hash,
                    epoch+26024, //startEpoch + 24 hours 
                    epoch+182168, // end epoch -  one week 
                    0,
                    0,
                    0,
                    1,
                    extraParamsV1
                  ] 
                   write({
                      args: [DealRequestStruct],
                      from: address
                    });

                  console.log('done')
                  

            }
            

        } catch(error){
            console.log(error)
        }

        
                        const { meta: Waslah } = await db
                        .prepare(
                          `
                          CREATE TABLE 
                          ${tableName}
                      (   
                          addr TEXT,
                          hash TEXT,
                          url TEXT
                      );
                      `
                        )
                        .run();

                      await Waslah.txn.wait();
                       console.log(Waslah.txn.name);
                      let tableId =  Waslah.txn.name;

                      toast({
                        title:
                          `Table ${tableId} created successfully, please approve table interaction `,
                        isClosable: true,
                        duration: 5000,
                        status: 'success',
                      })

                      const { meta: addtoTable } = await db
                      .prepare(
                        `INSERT INTO ${tableId} (addr,hash,url) VALUES
                      ( ?,?,?);
                      `
                      )
                      .bind(
                        address,
                        hash,
                        fileUrl
                      )
                      .run();
                    // Wait for transaction finality
                    await addtoTable.txn.wait();

                    await console.log(addtoTable.txn.name);

                    const { results } = await db.prepare(`SELECT * FROM ${tableId};`).all();

                    toast({
                      title:
                        `reading table "${results}"`,
                      isClosable: true,
                      duration: 15000,
                      status: 'success',
                    })

        const errors = []
        const collections = (migratedCollections || [])
          .reduce((acc, resultForCollection) => {
            if (resultForCollection.success) {
              acc.push(resultForCollection.collection)
            } else {
              errors.push(
                `${resultForCollection.collection}: ${resultForCollection.error}`
              )
            }
            return acc
          }, [])
          .join(', ')
        toast({
          title:
            `deal created successfully andd MongoDB Collections "${response.protocolLink}"` +
            (errors.length > 0 ? `\nErrors: ${errors}` : ''),
          isClosable: true,
          duration: 15000,
          status: 'success',
        })
        
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
    [mongoHost, selectedCollections, currentDb, toast]
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
            <FormControl isInvalid={!!errors.dbUser} mb="24px">
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
              >
                Enter your Spheron token<Text color={brandStars}>*</Text>
              </FormLabel>
              <Input
                {...register('dbUser')}
                variant="auth"
                fontSize="sm"
                placeholder="I1NiIsInR5cCI6IkpXVC..."
                fontWeight="500"
                size="lg"
                autoComplete={'dbUser'}
              />
              <FormErrorMessage>
                {errors.dbUser && errors.dbUser.message}
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
