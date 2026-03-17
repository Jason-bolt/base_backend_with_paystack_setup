import { ICreateUser, IUser } from "../types";

interface IService {
  signUpUser: (data: ICreateUser) => Promise<IUser>;
  loginUser: (email: string) => Promise<{ token: string }>;
  initiatePasswordReset: (
    email: string
  ) => Promise<{ userId: string; resetToken: string }>;
  resetPassword: (
    email: string,
    password: string
  ) => Promise<IUser>;
  // getUser: (id: string) => Promise<IUser>;
  // getUsers: (data: IGetUsersFilter) => Promise<IUser[]>;
  // updateUser: (id: string, data: IUpdateUser) => Promise<IUser>;
  // deleteUser: (id: string) => Promise<IUser>;
}

export default IService;
