import { useState } from 'react';
import Head from 'next/head';
import { configureAccount } from '@utils/cloudAccountHelpers';
import useToast from '@components/toast/hooks/useToast';
import TencentAccountDetails from '@components/account-details/TencentAccountDetails';

import OnboardingWizardLayout, {
  LeftSideLayout,
  RightSideLayout
} from '../../../components/onboarding-wizard/OnboardingWizardLayout';
import PurplinCloud from '../../../components/onboarding-wizard/PurplinCloud';
import CredentialsButton from '../../../components/onboarding-wizard/CredentialsButton';
import { allProviders } from '../../../utils/providerHelper';

export default function TencentCredentials() {
  const provider = allProviders.TENCENT;

  const { setToast } = useToast();

  const [hasError, setHasError] = useState(false);

  return (
    <div>
      <Head>
        <title>Setup Tencent - Komiser</title>
        <meta name="description" content="Setup Tencent - Komiser" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <OnboardingWizardLayout>
        <LeftSideLayout
          title="Configure your Tencent account"
          progressBarWidth="45%"
        >
          <div className="leading-6 text-gray-900/60">
            <div className="font-normal">
              Tencent Cloud is China&apos;s leading public cloud service
              provider (CSP). Tencent Cloud is a secure, reliable and
              high-performance public CSP that integrates Tencent&apos;s
              infrastructure building capabilities with the advantages of its
              massive user platform and ecosystem.
            </div>
            <div>
              Read our guide on{' '}
              <a
                target="_blank"
                href="https://docs.komiser.io/configuration/cloud-providers/tencent"
                className="text-komiser-600"
                rel="noreferrer"
              >
                adding a Tencent account to Komiser.
              </a>
            </div>
          </div>

          <form
            onSubmit={event =>
              configureAccount(event, provider, setToast, setHasError)
            }
          >
            <TencentAccountDetails hasError={hasError} />
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
