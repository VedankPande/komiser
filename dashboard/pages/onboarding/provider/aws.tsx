import { useState } from 'react';
import Head from 'next/head';

import { configureAccount } from '@utils/cloudAccountHelpers';

import { allProviders } from '../../../utils/providerHelper';

import OnboardingWizardLayout, {
  LeftSideLayout,
  RightSideLayout
} from '../../../components/onboarding-wizard/OnboardingWizardLayout';
import PurplinCloud from '../../../components/onboarding-wizard/PurplinCloud';
import CredentialsButton from '../../../components/onboarding-wizard/CredentialsButton';
import AwsAccountDetails from '../../../components/account-details/AwsAccountDetails';
import Toast from '../../../components/toast/Toast';
import useToast from '../../../components/toast/hooks/useToast';

export default function AWSCredentials() {
  const provider = allProviders.AWS;

  const { toast, setToast, dismissToast } = useToast();

  const [hasError, setHasError] = useState(false);

  return (
    <div>
      <Head>
        <title>Setup AWS - Komiser</title>
        <meta name="description" content="Setup AWS - Komiser" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <OnboardingWizardLayout>
        <LeftSideLayout
          title="Configure your AWS account"
          progressBarWidth="45%"
        >
          <div className="leading-6 text-gray-900/60">
            <div className="font-normal">
              AWS is a cloud computing platform that provides infrastructure
              services, application services, and developer tools provided by
              Amazon.
            </div>
            <div>
              Read our guide on{' '}
              <a
                target="_blank"
                href="https://docs.komiser.io/configuration/cloud-providers/aws"
                className="text-komiser-600"
                rel="noreferrer"
              >
                adding an AWS account to Komiser.
              </a>
            </div>
          </div>
          <form
            onSubmit={event =>
              configureAccount(event, provider, setToast, setHasError)
            }
          >
            <AwsAccountDetails hasError={hasError} />
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
