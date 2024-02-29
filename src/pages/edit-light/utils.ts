import { ClientRequest } from '@services/client';
import { CollectionEntity } from '@services/data-contracts';
import { bridge } from '@webview-bridge/react-native';
type AppBridgeType = {
  setCollectionInfo: (
    collectionInfo: CollectionEntity | undefined,
  ) => Promise<void>;
  setUserInfo: (userInfo: any) => Promise<void>;
};
const appBridge = bridge<AppBridgeType>(({ get, set }) => {
  return {
    modifyCollectionName: async (
      userId: string,
      collectionId: string,
      data: any,
    ) => {
      console.log('xxxxxxxxxx');
      const client = await ClientRequest();
      return await client.collectionControllerModifyName(
        userId,
        collectionId,
        data,
      );
    },
    data: { userInfo: {}, collectionInfo: {} },
    async setUserInfo(userInfo) {
      set({
        data: {
          userInfo,
        },
      });
    },
    async setCollectionInfo(collectionInfo) {
      set({
        data: {
          collectionInfo,
        },
      });
    },
  };
});
export { appBridge };
