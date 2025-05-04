export default function formatNumber(number) {
    if (typeof number !== 'number' || isNaN(number)) {
        try {
            return Number(number).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        } catch (error) {
            
        }
    } else{
        return number.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    }
}