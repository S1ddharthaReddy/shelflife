
const Item = require('../models/Item');
const getItemStatus = require('../utils/getItemStatus');

const getDashboardStats = async (req, res) => {
    try {
        const user = req.user;

        if(!user.householdId){
            return res.status(400).json({
                message: 'Join a household first'
            })
        }

        const items = await Item.find({
            householdId: user.householdId
        });

        let fresh = 0;
        let expiringSoon = 0;
        let expired = 0;
        let used = 0;
        let wasted = 0;

        items.forEach(item => {

            // Permanent statuses
            if (item.status === 'used') {
                used++;
                return;
            }

            if (item.status === 'wasted') {
                wasted++;
                return;
            }

            // Dynamic statuses
            const displayStatus =
                getItemStatus(item.expiryDate);

            if (displayStatus === 'fresh') {
                fresh++;
            }

            if (displayStatus === 'expiring-soon') {
                expiringSoon++;
            }

            if (displayStatus === 'expired') {
                expired++;
            }
        });

        const totalCompleted = used + wasted;

        let wasteScore = 0;

        if (totalCompleted > 0) {
            wasteScore = Math.round(
                (used / totalCompleted) * 100
            );
        }

        res.json({
            fresh,
            expiringSoon,
            expired,
            used,
            wasted,
            wasteScore
        });
    }
    catch(error) {
        res.status(500).json({
            message: error.message
        });
    }
}

const getExpiringItems = async (req, res) => {
    try {
        const user = req.user;

        if (!user.householdId) {
            return res.status(400).json({
                message: 'Join a household first'
            });
        }

        const now = new Date();

        const tomorrow = new Date();

        tomorrow.setDate(tomorrow.getDate() + 1);

        const items = await Item.find({
            householdId: user.householdId,

            expiryDate: {
                $gte: now,
                $lte: tomorrow
            },

            status: {
                $nin: ['used', 'wasted']
            }
        }).sort({ expiryDate: 1 });

        const formattedItems = items.map(item => {
            const itemObj = item.toObject();

            itemObj.displayStatus =
                getItemStatus(item.expiryDate);

            return itemObj;
        });

        res.json(formattedItems);

    } catch(error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getDashboardStats,
    getExpiringItems
};