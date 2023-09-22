import { useState } from 'react';
import Head from 'next/head';
import { configureAccount } from '@utils/cloudAccountHelpers';
import useToast from '@components/toast/hooks/useToast';
import CivoAccountDetails from '@components/account-details/CivoAccountDetails';

import { allProviders } from '../../../utils/providerHelper';

import OnboardingWizardLayout, {
  LeftSideLayout,
  RightSideLayout
} from '../../../components/onboarding-wizard/OnboardingWizardLayout';
import PurplinCloud from '../../../components/onboarding-wizard/PurplinCloud';
import CredentialsButton from '../../../components/onboarding-wizard/CredentialsButton';

export default function CivoCredentials() {
  const provider = allProviders.CIVO;

  const { setToast } = useToast();

  const [hasError, setHasError] = useState(false);

  return (
    <div>
      <Head>
        <title>Setup Civo - Komiser</title>
        <meta name="description" content="Setup Civo - Komiser" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <OnboardingWizardLayout>
        <LeftSideLayout
          title="Configure your Civo account"
          progressBarWidth="45%"
        >
          <div className="leading-6 text-gray-900/60">
            <div className="font-normal">
              Civo is the first cloud native service provider powered only by
              Kubernetes.
            </div>
            <div>
              Read our guide on{' '}
              <a
                target="_blank"
                href="https://docs.komiser.io/docs/cloud-providers/civo"
                className="text-komiser-600"
                rel="noreferrer"
              >
                adding a CIVO account to Komiser.
              </a>
            </div>
          </div>

          <form
            onSubmit={event =>
              configureAccount(event, provider, setToast, setHasError)
            }
          >
            <CivoAccountDetails hasError={hasError} />
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
