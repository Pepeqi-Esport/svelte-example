import * as fs from "fs";
import * as crypto from "crypto";

let ALGORITHM = "aes-256-cbc";
let action = process.argv[2];

interface EncryptedPayload {
  iv: string;
  value: string;
}

function getFlagValue(flagName: string): string | undefined {
  let args = process.argv;

  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith(`--${flagName}=`)) {
      return args[i].split("=")[1];
    }
    if (args[i] === `--${flagName}` && args[i + 1]) {
      return args[i + 1];
    }
  }

  return undefined;
}

function getFileNames(): { targetSource: string; targetEncrypted: string } {
  let envFlag = getFlagValue("env");

  let targetSource = envFlag ? `.env.${envFlag}` : ".env";
  let targetEncrypted = `${targetSource}.encrypted`;

  return { targetSource, targetEncrypted };
}

function parseKeyToBuffer(keyString: string): Buffer {
  let cleanKey = keyString.startsWith("base64:") ? keyString.substring(7) : keyString;
  let keyBuffer = Buffer.from(cleanKey, "base64");

  if (keyBuffer.length !== 32) {
    console.error("\x1b[31m%s\x1b[0m", `Error: Key base64 must be 32 bytes! (Result: ${keyBuffer.length} bytes).`);
    process.exit(1);
  }

  return keyBuffer;
}

function encrypt(): void {
  let { targetSource, targetEncrypted } = getFileNames();

  if (!fs.existsSync(targetSource)) {
    console.error(`\x1b[31mError: File ${targetSource} not found.\x1b[0m`);
    process.exit(1);
  }

  let inputKey = getFlagValue("key");
  let keyBuffer: Buffer;
  let displayKey: string;

  if (inputKey) {
    keyBuffer = parseKeyToBuffer(inputKey);
    displayKey = inputKey;
  } else {
    let rawKey = crypto.randomBytes(32);
    keyBuffer = rawKey;
    displayKey = `base64:${rawKey.toString("base64")}`;
  }

  let iv: Buffer = crypto.randomBytes(16);
  let text: string = fs.readFileSync(targetSource, "utf8");
  let cipher = crypto.createCipheriv(ALGORITHM, keyBuffer, iv);

  let encrypted: string = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  let payload: EncryptedPayload = {
    iv: iv.toString("hex"),
    value: encrypted,
  };

  fs.writeFileSync(targetEncrypted, JSON.stringify(payload, null, 2));

  console.log("\x1b[32m%s\x1b[0m", `✔ File ${targetSource} successfully encrypted!`);
  console.log(`-> Saved to: ${targetEncrypted}`);

  if (inputKey) {
    console.log("\x1b[34m%s\x1b[0m", `-> Using custom Base64 key.`);
  } else {
    console.log("\x1b[33m%s\x1b[0m", `-> New automatic key (Save secret!): ${displayKey}`);
  }
}

function decrypt(): void {
  let { targetSource, targetEncrypted } = getFileNames();

  if (!fs.existsSync(targetEncrypted)) {
    console.error(`\x1b[31mError: File ${targetEncrypted} not found.\x1b[0m`);
    process.exit(1);
  }

  let keyString: string | undefined = getFlagValue("key") || process.env.APP_KEY;

  if (!keyString) {
    console.error("\x1b[31m%s\x1b[0m", "Error: Decryption key not specified!");
    console.error("Please run the command with the --key flag.");
    process.exit(1);
  }

  try {
    let keyBuffer = parseKeyToBuffer(keyString);
    let fileContent: string = fs.readFileSync(targetEncrypted, "utf8");
    let payload: EncryptedPayload = JSON.parse(fileContent);

    let iv: Buffer = Buffer.from(payload.iv, "hex");
    let encryptedValue: string = payload.value;

    let decipher = crypto.createDecipheriv(ALGORITHM, keyBuffer, iv);
    let decrypted: string = decipher.update(encryptedValue, "hex", "utf8");
    decrypted += decipher.final("utf8");

    fs.writeFileSync(targetSource, decrypted);
    console.log("\x1b[32m%s\x1b[0m", `✔ File ${targetEncrypted} successfully decrypted to ${targetSource}!`);
  } catch (e) {
    console.error("\x1b[31m%s\x1b[0m", "Decryption Failed: Your Base64 key is wrong or data is corrupt.");
    process.exit(1);
  }
}

if (action === "encrypt") {
  encrypt();
} else if (action === "decrypt") {
  decrypt();
} else {
  console.log("Use one of the following arguments: encrypt OR decrypt");
}
