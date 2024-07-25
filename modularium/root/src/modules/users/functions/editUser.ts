import { EditUserError } from '@/src/modules/users/models.js';
import { MongoOrb, UserModel } from '@/src/modules/users/orm.js';

export const editUser = async ({
  userId,
  update,
}: {
  userId: string;
  update: Omit<Partial<UserModel>, 'createdAt' | '_id'>;
}) => {
  if (update.username) {
    const existingUser = await MongoOrb('UserCollection').collection.findOne({
      username: update.username,
      userId: { $ne: userId },
    });
    if (existingUser) {
      return { hasError: EditUserError.USERNAME_ALREADY_TAKEN };
    }
  }
  await MongoOrb('UserCollection').collection.updateOne(
    {
      _id: userId,
    },
    {
      $set: {
        ...update,
      },
    },
  );
  return { result: true };
};
