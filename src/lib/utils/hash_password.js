import crypto from 'crypto';

export default function(password){
    const hash = crypto.createHash(password);
    hash.update(password);
    return hash.digest("hex");
}