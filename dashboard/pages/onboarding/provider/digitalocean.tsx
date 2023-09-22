import { useState } from 'react';
import Head from 'next/head';
import { configureAccount } from '@utils/cloudAccountHelpers';
import DigitalOceanAccountDetails from '@components/account-details/DigitalOceanAccountDetails';
import useToast from '@components/toast/hooks/useToast';

import { allProviders } from '../../../utils/providerHelper';

import OnboardingWizardLayout, {
  LeftSideLayout,
  RightSideLayout
} from '../../../components/onboarding-wizard/OnboardingWizardLayout';
import CredentialsButton from '../../../components/onboarding-wizard/CredentialsButton';
import PurplinCloud from '../../../components/onboarding-wizard/PurplinCloud';

export default function DigitalOceanCredentials() {
  const provider = allProviders.DIGITAL_OCEAN;

  const { setToast } = useToast();

  const [hasError, setHasError] = useState(false);

  return (
    <div>
      <Head>
        <title>Setup DigitalOcean - Komiser</title>
        <meta name="description" content="Setup DigitalOcean - Komiser" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <OnboardingWizardLayout>
        <LeftSideLayout
          title="Configure your DigitalOcean account"
          progressBarWidth="45%"
        >
          <div className="leading-6 text-gray-900/60">
            <div className="font-normal">
              DigitalOcean is a cloud hosting provider that offers cloud
              computing services and Infrastructure as a Service (IaaS).
            </div>
            <div>
              Read our guide on{' '}
              <a
                target="_blank"
                href="https://docs.komiser.io/configuration/cloud-providers/digital-ocean"
                className="text-komiser-600"
                rel="noreferrer"
              >
                adding a DigitalOcean account to Komiser.
              </a>
            </div>
          </div>

          <form
            onSubmit={event =>
              configureAccount(event, provider, setToast, setHasError)
            }
          >
            <DigitalOceanAccountDetails hasError={hasError} />
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
