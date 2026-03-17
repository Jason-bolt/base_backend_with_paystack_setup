interface IGetUsersFilter {
  name?: string;
  email?: string;
  createdAt?: Date;
  sort?: {
    createdAt?: "asc" | "desc";
  };
  limit?: number;
  offset?: number;
}

interface IUser {
  id: string;
  name: string;
  firebaseUid?: string;
  email: string;
  password?: string;
  createdAt: string;
  updatedAt: string;
}

interface ICreateUser {
  name: string;
  firebaseUid?: string;
  email: string;
  password?: string;
  confirmPassword?: string;
}

interface IUserTokenData {
  id: string;
  email: string;
  name: string;
}

interface IUpdateUser {
  name?: string;
  email?: string;
  password?: string;
}

export { IGetUsersFilter, IUser, ICreateUser, IUpdateUser, IUserTokenData };
