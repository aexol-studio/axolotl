import { changePasswordWithToken } from '@/src/modules/users/functions/changePasswordWithToken.js';
import { editUser } from '@/src/modules/users/functions/editUser.js';
import { mustBeUser } from '@/src/modules/users/functions/mustBeUser.js';
import { passwordLogin } from '@/src/modules/users/functions/passwordLogin.js';
import { refreshToken } from '@/src/modules/users/functions/refreshToken.js';
import { register } from '@/src/modules/users/functions/register.js';
import { requestForgotPassword } from '@/src/modules/users/functions/requestForgotPassword.js';
import { verifyEmail } from '@/src/modules/users/functions/verifyEmail.js';
import { changePasswordWhenLogged } from '@/src/modules/users/functions/changePasswordWhenLogged.js';
import { integrateSocialAccount } from '@/src/modules/users/functions/integrateSocialAccount.js';
import { deleteAccount } from '@/src/modules/users/functions/deleteAccount.js';
export const UsersModule = {
  deleteAccount,
  editUser,
  mustBeUser,
  register,
  changePasswordWithToken,
  changePasswordWhenLogged,
  verifyEmail,
  passwordLogin,
  refreshToken,
  requestForgotPassword,
  integrateSocialAccount,
};
