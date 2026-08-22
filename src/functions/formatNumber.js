export default function formatNumber(number, min = 2, max = 2) {
    if (typeof number !== 'number' || isNaN(number)) {
        try {
            return Number(number).toLocaleString('en-US', {minimumFractionDigits: min, maximumFractionDigits: max});
        } catch (error) {
            
        }
    } else{
        return number.toLocaleString('en-US', {minimumFractionDigits: min, maximumFractionDigits: max});
    }
}