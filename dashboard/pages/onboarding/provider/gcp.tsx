import { useState } from 'react';
import Head from 'next/head';
import GcpAccountDetails from '@components/account-details/GcpAccountDetails';
import { configureAccount } from '@utils/cloudAccountHelpers';

import { allProviders } from '../../../utils/providerHelper';

import OnboardingWizardLayout, {
  LeftSideLayout,
  RightSideLayout
} from '../../../components/onboarding-wizard/OnboardingWizardLayout';
import PurplinCloud from '../../../components/onboarding-wizard/PurplinCloud';
import CredentialsButton from '../../../components/onboarding-wizard/CredentialsButton';
import Toast from '../../../components/toast/Toast';
import useToast from '../../../components/toast/hooks/useToast';

export default function GcpCredentials() {
  const provider = allProviders.GCP;

  const { toast, setToast, dismissToast } = useToast();

  const [hasError, setHasError] = useState(false);

  return (
    <div>
      <Head>
        <title>Setup GCP - Komiser</title>
        <meta name="description" content="Setup GCP - Komiser" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <OnboardingWizardLayout>
        <LeftSideLayout
          title="Configure your GCP account"
          progressBarWidth="45%"
        >
          <div className="leading-6 text-gray-900/60">
            <div className="font-normal">
              GCP is a cloud computing platform that provides infrastructure
              services, application services, and developer tools provided by
              Google.
            </div>
            <div>
              Read our guide on{' '}
              <a
                target="_blank"
                href="https://docs.komiser.io/configuration/cloud-providers/gcp"
                className="text-komiser-600"
                rel="noreferrer"
              >
                adding an GCP account to Komiser.
              </a>
            </div>
          </div>
          <form
            onSubmit={event =>
              configureAccount(event, allProviders.GCP, setToast, setHasError)
            }
          >
            <GcpAccountDetails hasError={hasError} />
            <CredentialsButton />
          </form>
        </LeftSideLayout>

        <RightSideLayout>
          <div className="relative">
            <PurplinCloud provider={provider} />
          </div>
        </RightSideLayout>
      </OnboardingWizardLayout>

      {/* Toast component */}
      {toast && <Toast {...toast} dismissToast={dismissToast} />}
    </div>
  );
}
