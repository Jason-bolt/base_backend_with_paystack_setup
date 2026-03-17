interface IService {
  create: (data: any) => Promise<void>;
  read: (id: string) => Promise<void>;
  update: (id: string, data: any) => Promise<void>;
  delete: (id: string) => Promise<void>;
}

export default IService;