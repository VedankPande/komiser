import { useState } from 'react';
import Head from 'next/head';
import { configureAccount } from '@utils/cloudAccountHelpers';
import useToast from '@components/toast/hooks/useToast';
import LinodeAccountDetails from '@components/account-details/LinodeAccountDetails';

import { allProviders } from '../../../utils/providerHelper';

import OnboardingWizardLayout, {
  LeftSideLayout,
  RightSideLayout
} from '../../../components/onboarding-wizard/OnboardingWizardLayout';
import PurplinCloud from '../../../components/onboarding-wizard/PurplinCloud';
import CredentialsButton from '../../../components/onboarding-wizard/CredentialsButton';

export default function LinodeCredentials() {
  const provider = allProviders.LINODE;

  const { setToast } = useToast();

  const [hasError, setHasError] = useState(false);

  return (
    <div>
      <Head>
        <title>Setup Linode - Komiser</title>
        <meta name="description" content="Setup Linode - Komiser" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <OnboardingWizardLayout>
        <LeftSideLayout
          title="Configure your Linode account"
          progressBarWidth="45%"
        >
          <div className="leading-6 text-gray-900/60">
            <div className="font-normal">
              Linode is a global cloud hosting provider offering
              infrastructure-as-a-service solutions. It provides virtual
              servers, storage, and related services for deploying and managing
              applications in the cloud.
            </div>
            <div>
              Read our guide on{' '}
              <a
                target="_blank"
                href="https://docs.komiser.io/configuration/cloud-providers/linode"
                className="text-komiser-600"
                rel="noreferrer"
              >
                adding a Linode account to Komiser.
              </a>
            </div>
          </div>

          <form
            onSubmit={event =>
              configureAccount(event, provider, setToast, setHasError)
            }
          >
            <LinodeAccountDetails hasError={hasError} />
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
