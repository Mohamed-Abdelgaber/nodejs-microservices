export interface ProductTypeProviderService {
  isValueSupported(value: string): Promise<boolean>;
}
