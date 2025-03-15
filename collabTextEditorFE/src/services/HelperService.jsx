// RSA keys are generated in Array Buffer, convert to readable Base64 format
export const arrayBufferToBase64 = (arrayBuffer) => {
    let binary = '';
    const bytes = new Uint8Array(arrayBuffer);
    const length = bytes.byteLength;
    for (let i = 0; i < length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
};

// Convert Base64 to PEM format 
export const base64ToPem = (base64Key) => {
    const pemHeader = "-----BEGIN PUBLIC KEY-----\n";
    const pemFooter = "\n-----END PUBLIC KEY-----";
    const key = base64Key.match(/.{1,64}/g).join("\n"); // Split into lines of 64 characters
    return pemHeader + key + pemFooter;
};

// Convert Base64 to PEM format for private key
export const base64ToPemPrivateKey = (base64Key) => {
  const pemHeader = "-----BEGIN PRIVATE KEY-----\n";
  const pemFooter = "\n-----END PRIVATE KEY-----";
  const key = base64Key.match(/.{1,64}/g).join("\n"); // Split into lines of 64 characters
  return pemHeader + key + pemFooter;
};

// PEM to array buffer (Public key pem to array buffer for AES encryption)
export const pemToArrayBuffer = (pem,type) => {
  let pemHeader;
  let pemFooter;
  if(type == 'public'){
    // Remove the PEM headers and footers
    pemHeader = '-----BEGIN PUBLIC KEY-----';
    pemFooter = '-----END PUBLIC KEY-----';
  }else{
    pemHeader = '-----BEGIN PRIVATE KEY-----';
    pemFooter = '-----END PRIVATE KEY-----';
  }
    let pemContents = pem.replace(pemHeader, '').replace(pemFooter, '');
    pemContents = pemContents.replace(/\s+/g, '');  // Remove any extra spaces or newlines
  
    // Decode the Base64 string to an ArrayBuffer
    const binaryDerString = atob(pemContents);
    const binaryArray = new Uint8Array(binaryDerString.length);
    for (let i = 0; i < binaryDerString.length; i++) {
      binaryArray[i] = binaryDerString.charCodeAt(i);
    }
  
    return binaryArray.buffer;  // Return as ArrayBuffer
};

// Base 64 back to Array Buffer
export const base64ToArrayBuffer = (base64) => {
  // Decode the Base64 string to a binary string
  const binaryString = window.atob(base64);

  // Create a new ArrayBuffer with the same length as the binary string
  const arrayBuffer = new ArrayBuffer(binaryString.length);

  // Create a Uint8Array view on the ArrayBuffer
  const uint8Array = new Uint8Array(arrayBuffer);

  // Fill the ArrayBuffer with the binary data
  for (let i = 0; i < binaryString.length; i++) {
      uint8Array[i] = binaryString.charCodeAt(i);
  }

  return arrayBuffer;
};