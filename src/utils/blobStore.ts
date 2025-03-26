import { getStore } from '@netlify/blobs';

/**
 * Helper function to get the Blob Store client.
 * This handles store initialization with the appropriate namespace.
 */
export const getSubscriberBlobStore = () => {
  try {
    return getStore({
      name: `${process.env.MAILING_LIST_NAME}-subscribers`,
    });
  } catch (error) {
    console.error('Failed to initialize Netlify Blob Store:', error);
    return null;
  }
};

/**
 * Type definition for subscriber data stored in the blob store
 */
export interface SubscriberData {
  email: string;
  timestamp: string;
}
