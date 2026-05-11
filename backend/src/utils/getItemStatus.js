
const getItemStatus = (expiryDate) => {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);

    const diffTime = expiry - today;

    const diffDays = diffTime/ (1000*60*60*24);

    if(diffDays < 0) {
        return 'expired';
    }

    if(diffDays <= 3) {
        return 'expiring-soon'
    }

    return 'fresh';
}

module.exports = getItemStatus;