import { useState } from 'react';
import Head from 'next/head';
import { configureAccount } from '@utils/cloudAccountHelpers';
import useToast from '@components/toast/hooks/useToast';
import MongoDbAtlasAccountDetails from '@components/account-details/MongoDBAtlasAccountDetails';

import { allProviders } from '../../../utils/providerHelper';

import OnboardingWizardLayout, {
  LeftSideLayout,
  RightSideLayout
} from '../../../components/onboarding-wizard/OnboardingWizardLayout';
import PurplinCloud from '../../../components/onboarding-wizard/PurplinCloud';
import CredentialsButton from '../../../components/onboarding-wizard/CredentialsButton';

export default function MongoDBAtlasCredentials() {
  const provider = allProviders.TENCENT;

  const { setToast } = useToast();

  const [hasError, setHasError] = useState(false);

  return (
    <div>
      <Head>
        <title>Setup MongoDB Atlas - Komiser</title>
        <meta name="description" content="Setup MongoDB Atlas - Komiser" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <OnboardingWizardLayout>
        <LeftSideLayout
          title="Configure your MongoDB Atlas account"
          progressBarWidth="45%"
        >
          <div className="leading-6 text-gray-900/60">
            <div className="font-normal">
              MongoDB Atlas is a fully managed cloud database service provided
              by MongoDB, Inc. It allows users to run their MongoDB databases on
              popular cloud providers such as AWS, Google Cloud, and Azure.
            </div>
            <div>
              Read our guide on{' '}
              <a
                target="_blank"
                href="https://docs.komiser.io/configuration/cloud-providers/mongodb-atlas"
                className="text-komiser-600"
                rel="noreferrer"
              >
                adding a MongoDB Atlas account to Komiser.
              </a>
            </div>
          </div>

          <form
            onSubmit={event =>
              configureAccount(event, provider, setToast, setHasError)
            }
          >
            <MongoDbAtlasAccountDetails hasError={hasError} />
            <CredentialsButton />
          </form>
        </LeftSideLayout>

        <RightSideLayout>
          <div className="relative">
            <PurplinCloud provider={provider} />
          </div>
        </RightSideLayout>
      </OnboardingWizardLayout>
    </div>
  );
}
