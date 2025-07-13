import type { EncryptionService } from "../../application/services/encryptionService";
export declare class NodeCryptoEncryptionService implements EncryptionService {
    private key;
    constructor(encryptionKey: string);
    encrypt(text: string): Promise<string>;
    decrypt(encryptedText: string): Promise<string>;
}
