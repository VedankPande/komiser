import { FormEvent } from 'react';
import { allProviders, Provider } from './providerHelper';
import settingsService from '@services/settingsService';

export interface Credentials {}

export interface AWSCredentials extends Credentials {
  source?: string;
  path?: string;
  profile?: string;
  aws_access_key_id?: string;
  aws_secret_access_key?: string;
}

export interface AzureCredentials extends Credentials {
  source?: string;
  tenantId?: string;
  clientId?: string;
  clientSecret?: string;
  subscriptionId?: string;
}

export interface CivoCredentials extends Credentials {
  source?: string;
  token?: string;
}

export interface DigitalOceanCredentials extends Credentials {
  source?: string;
  token?: string;
}

export interface KubernetesCredentials extends Credentials {
  source?: string;
  file?: string;
}

export interface LinodeCredentials extends Credentials {
  token?: string;
}

export interface TencentCredentials extends Credentials {
  token?: string;
}

export interface ScalewayCredentials extends Credentials {
  accessKey?: string;
  secretKey?: string;
  organizationId?: string;
}

export interface MongoDBAtlasCredentials extends Credentials {
  publicApiKey?: string;
  privateApiKey?: string;
  organizationId?: string;
}

export interface GCPCredentials extends Credentials {
  serviceAccountKeyPath?: string;
}

export interface OCICredentials extends Credentials {
  path?: string;
}

export const getPayloadFromForm = (formData: FormData, provider: Provider) => {
  const data = Object.fromEntries(formData.entries());

  switch (provider) {
    case allProviders.AWS:
      return {
        name: data.name,
        provider: provider,
        credentials: {
          source: data.source,
          path: data.path,
          profile: data.profile,
          aws_access_key_id: data.aws_access_key_id,
          aws_secret_access_key: data.aws_secret_access_key
        }
      };
    case allProviders.AZURE:
      return {
        name: data.name,
        provider: provider,
        credentials: {
          source: data.source,
          tenantId: data.tenantId,
          clientId: data.clientId,
          clientSecret: data.clientSecret,
          subscriptionId: data.subscriptionId
        }
      };
    case allProviders.CIVO:
      return {
        name: data.name,
        provider: provider,
        credentials: {
          source: data.source,
          token: data.token
        }
      };
    case allProviders.DIGITAL_OCEAN:
      return {
        name: data.name,
        provider: provider,
        credentials: {
          source: data.source,
          token: data.token
        }
      };
    case allProviders.KUBERNETES:
      return {
        name: data.name,
        provider: provider,
        credentials: {
          source: data.source,
          file: data.file
        }
      };
    case allProviders.LINODE:
      return {
        name: data.name,
        provider: provider,
        credentials: {
          token: data.token
        }
      };
    case allProviders.TENCENT:
      return {
        name: data.name,
        provider: provider,
        credentials: {
          token: data.token
        }
      };
    case allProviders.SCALE_WAY:
      return {
        name: data.name,
        provider: provider,
        credentials: {
          accessKey: data.accessKey,
          secretKey: data.secretKey,
          organizationId: data.organizationId
        }
      };
    case allProviders.MONGODB_ATLAS:
      return {
        name: data.name,
        provider: provider,
        credentials: {
          publicApiKey: data.publicApiKey,
          privateApiKey: data.privateApiKey,
          organizationId: data.organizationId
        }
      };
    case allProviders.GCP:
      return {
        name: data.name,
        provider: provider,
        credentials: {
          serviceAccountKeyPath: data.serviceAccountKeyPath
        }
      };
    case allProviders.OCI:
      return {
        name: data.name,
        provider: provider,
        credentials: {
          path: data.path
        }
      };
  }
};

export const configureAccount = (
  e: FormEvent<HTMLFormElement>,
  provider: Provider,
  setToast: (toast: {
    hasError: boolean;
    title: string;
    message: string;
  }) => void,
  setHasError: (value: boolean) => void
) => {
  e.preventDefault();

  if (setHasError) setHasError(false);
  const payloadJson = JSON.stringify(
    getPayloadFromForm(new FormData(e.currentTarget), provider)
  );
  settingsService.addCloudAccount(payloadJson).then(res => {
    if (res === Error || res.error) {
      if (setHasError) setHasError(true);
    } else {
      setToast({
        hasError: false,
        title: 'Cloud account added',
        message: 'The cloud account was successfully added!'
      });
    }
  });

  return true;
};
