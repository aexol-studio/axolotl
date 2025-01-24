import { AuthorizedUserMutation, DeleteAccountError } from '@/src/models.js';
import { MongoOrb, UserModel } from '../orm.js';

export const deleteAccount = async (currentUser: UserModel): Promise<AuthorizedUserMutation['deleteAccount']> => {
  try {
    await MongoOrb('UserCollection').collection.findOne({ _id: currentUser._id });
    await MongoOrb('UserAuthorizationCollection').collection.findOne({ userId: currentUser._id });
  } catch (e) {
    return {
      result: false,
      hasError: DeleteAccountError.CANNOT_FIND_USER,
    };
  }
  return await Promise.all([
    MongoOrb('UserAuthorizationCollection').collection.deleteOne({ userId: currentUser._id }),
    MongoOrb('SocialCollection').collection.deleteOne({ userId: currentUser._id }),
    MongoOrb('RefreshTokenCollection').collection.deleteMany({ userId: currentUser._id }),
    MongoOrb('UserCollection').collection.deleteOne({ _id: currentUser._id }),
  ]).then(([userAuthResult, socialResult, _, userResult]) => {
    const userCollectionsDeleted = userAuthResult.deletedCount === 1 || socialResult.deletedCount === 1;

    const userDeleted = userResult.deletedCount === 1;
    const allDeleted = userDeleted && userCollectionsDeleted;

    return {
      result: allDeleted,
      ...(!allDeleted && {
        hasError: DeleteAccountError.CANNOT_DELETE_ALL_ELEMENTS,
      }),
    };
  });
};
