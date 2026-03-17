interface IService {
  initializeTransaction: (data: any) => Promise<void>;
  verifyTransaction: (reference: string) => Promise<void>;
}

export default IService;