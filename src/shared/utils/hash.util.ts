import { createHash } from "crypto";

export class HashUtil {

    static bucket(input: string): number {

        let hash = 5381;

        for (let i = 0; i < input.length; i++) {
            hash = (hash * 33) ^ input.charCodeAt(i);
        }

        return (hash >>> 0) % 100;
    }

    static sha256(value: string): string {
        return createHash("sha256")
            .update(value)
            .digest("hex");
    }
}