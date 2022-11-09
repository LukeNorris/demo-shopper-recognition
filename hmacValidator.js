import crypto from 'crypto'

const hmacValidator = (req) => {
    const key = process.env.HMAC_KEY;
    const r = req.body.notificationItems[0].NotificationRequestItem
    console.log(r)
    let hmc = r.additionalData.hmacSignature
    let pspReference = r.pspReference || ""
    let originalReference = r.originalReference || ""
    let merchantAccountCode = r.merchantAccountCode || ""
    let merchantReference = r.merchantReference || ""
    let value = r.amount.value.toString() || ""
    let currency = r.amount.currency || ""
    let eventCode = r.eventCode || ""
    let success = r.success || ""
  
    let payload =  pspReference + ":" + originalReference + ":" + merchantAccountCode + ":" + merchantReference + ":" + value + ":" + currency + ":" + eventCode + ":" + success
    console.log("payload", payload)
    function hmacValidation(payload, key){
        const rawKey = Buffer.from(key, "hex");
        return crypto.createHmac("sha256", rawKey).update(payload, "utf8").digest("base64");
    }
    console.log("hmac from notfication: " + hmc);
    console.log("generated hmac from my server: " + hmacValidation(payload, key));
  
    return hmacValidation(payload, key) == hmc? true : false
  };
  
export default hmacValidator