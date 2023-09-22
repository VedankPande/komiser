import { useState } from 'react';
import Head from 'next/head';
import AzureAccountDetails from '@components/account-details/AzureAccountDetails';
import { configureAccount } from '@utils/cloudAccountHelpers';
import useToast from '@components/toast/hooks/useToast';

import { allProviders } from '../../../utils/providerHelper';

import OnboardingWizardLayout, {
  LeftSideLayout,
  RightSideLayout
} from '../../../components/onboarding-wizard/OnboardingWizardLayout';
import PurplinCloud from '../../../components/onboarding-wizard/PurplinCloud';
import CredentialsButton from '../../../components/onboarding-wizard/CredentialsButton';

export default function AzureCredentials() {
  const provider = allProviders.AZURE;

  const { setToast } = useToast();

  const [hasError, setHasError] = useState(false);

  return (
    <div>
      <Head>
        <title>Setup Azure - Komiser</title>
        <meta name="description" content="Setup Azure - Komiser" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <OnboardingWizardLayout>
        <LeftSideLayout
          title="Configure your Microsoft Azure account"
          progressBarWidth="45%"
        >
          <div className="leading-6 text-gray-900/60">
            <div className="font-normal">
              Microsoft Azure is Microsoft&apos;s public cloud computing
              platform. It provides a broad range of cloud services, including
              compute, analytics, storage and networking. Users can pick and
              choose from these services to develop and scale new applications
              or run existing applications in the public cloud.
            </div>
            <div>
              Read our guide on{' '}
              <a
                target="_blank"
                href="https://docs.komiser.io/configuration/cloud-providers/azure"
                className="text-komiser-600"
                rel="noreferrer"
              >
                adding an Azure account to Komiser.
              </a>
            </div>
          </div>

          <form
            onSubmit={event =>
              configureAccount(event, provider, setToast, setHasError)
            }
          >
            <AzureAccountDetails hasError={hasError} />
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
