import { Step, Steps, useSteps } from 'chakra-ui-steps'

import { Box } from '@chakra-ui/react'
import Layout from 'layouts/Layout'
//

import Head from 'next/head'
import { useState } from 'react'
import axios from 'axios'

import MongoStepConfigureDb from 'components/wallet/mongo-step-configure-db'
import MongoStepSelectDb from 'components/mongo/mongo-step-select-db'
import MongoStepSelectCollections from 'components/mongo/mongo-step-select-collections'
import MongoStepProceedToImport from 'components/wallet/tableland'
import { useDatabaseMigrationStore } from 'contexts/useDatabaseMigrationStore'
import { NextPageWithLayout } from 'types/Layout'
// @ts-ignore
import { ConnectButton  } from '@rainbow-me/rainbowkit';
import WalletButton from 'components/wallet/wallet'

const Connection: NextPageWithLayout = () => {
  const { nextStep, prevStep, setStep, reset, activeStep } = useSteps({
    initialStep: 0,
  })

  const [databases, setDatabases] = useState([])
  const [collections, setCollections] = useState([])
  const [currentDb, setCurrentDb] = useState([])
  const host = useDatabaseMigrationStore(({ mongoHost }) => mongoHost)

  const getDbs = async () => {
    let resp = await axios.post(`/api/mongodb/details/get-dbs`, { host })
    setDatabases(resp.data)
  }

  const getCollections = async () => {
    let resp = await axios.post(`/api/mongodb/details/get-collections`, {
      host,
      db: currentDb,
    })
    setCollections(resp.data)
  }

  const onClickNextToStep2 = async () => {
    nextStep()
  }

  const onClickNextToStep3 = async () => {
    await getDbs()
    nextStep()
  }

  const onClickNextToStep4 = async () => {
    const collections = await getCollections()
    console.log(collections)
    nextStep()
  }

  const steps = [
    {
        label: 'Connect Wallet ',
        content: (
            <WalletButton handleNextStepClick={onClickNextToStep2} />
        ),
      },
    {
      label: 'Add Mongo DB Host',
      content: (
        <MongoStepConfigureDb 
        handlePreviousStepClick={prevStep}
        handleNextStepClick={onClickNextToStep3} />
      ),
    },
    {
      label: 'Select Database',
      content: (
        <MongoStepSelectDb
          databases={databases}
          currentDb={currentDb}
          setCurrentDb={setCurrentDb}
          handlePreviousStepClick={prevStep}
          handleNextStepClick={onClickNextToStep4}
        />
      ),
    },
    {
      label: 'Select Collections',
      content: (
        <MongoStepSelectCollections
          collections={collections}
          handlePreviousStepClick={prevStep}
          handleNextStepClick={nextStep}
        />
      ),
    },
    {
      label: 'Start Migrating',
      content: (
        <MongoStepProceedToImport
          handlePreviousStepClick={prevStep}
          currentDb={currentDb}
        />
      ),
    },
  ]

  return (
    <Box>
      <Head>
        <title>Waslah | MongoDB Migration with Deal</title>
      </Head>

      <Steps activeStep={activeStep} colorScheme={'mongo'}>
        {steps.map(({ label, content }) => (
          <Step label={label} key={label}>
            <Box style={{ padding: 40 }}>{content}</Box>
          </Step>
        ))}
      </Steps>
    </Box>
  )
}

Connection.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

export default Connection
