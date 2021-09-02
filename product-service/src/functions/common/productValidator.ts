export default ({title, price, description, img_url, count}: any): { isValid: boolean, reason?: string } => {
    const reasons = []

    if(!(typeof title === "string" && title.length > 0)) {
        reasons.push("title must be an non-empty string");
    }

    if(price) {
        if(!(typeof price === 'number' && !isNaN(price) && Number.isInteger(price) && price >= 0)) {
            reasons.push("price must be non-negative number");
        }
    }

    if(count) {
        if(!(typeof count === 'number' && !isNaN(price) && Number.isInteger(count) && count >= 0)) {
            reasons.push("count must be non-negative integer or null")
        }
    }

    if(description) {
        if(typeof description !== 'string') {
            reasons.push("description must be string");
        }
    }

    if(img_url) {
        if(typeof img_url !== 'string') {
            reasons.push("img_url must be string");
        }
    }

    if(reasons.length > 0) {
        return {
            isValid: false,
            reason: reasons.join('\n')
        }
    } else return {
        isValid: true
    }
}
