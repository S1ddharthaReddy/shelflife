
const Item = require('../models/Item');
const getItemStatus = require('../utils/getItemStatus');
const Household = require('../models/Household');

const createItem = async (req, res) => {
    try {
        const user = req.user;

        if(!user.householdId){
            return res.status(400).json({message:"Join a household first"});
        }

        const { name, category, quantity, expiryDate} = req.body;

        if(!name || !expiryDate) {
            return res.status(400).json({
                message: "Name and expiry date are required"
            });
        }

        const item = await Item.create({
            householdId: user.householdId,
            addedBy: user._id,
            name,
            category,
            quantity,
            expiryDate
        });

        const itemObj = item.toObject();

        itemObj.displayStatus = getItemStatus(item.expiryDate);

        res.status(201).json(itemObj);
    }
    catch(error) {
        res.status(500).json({
            message: error.message
        });
    }
}

const getItems = async (req, res) => {
    try {
        const user = req.user;

        if(!user.householdId) {
            return res.status(400).json({message:"Join a household first"})
        }

        const { category, status } = req.query;

        const query = {
            householdId: user.householdId
        }

        if(category) {
            query.category = category;
        }

        const items = await Item.find(query)
            .sort({ expiryDate: 1 });

        let formattedItems = items.map(item => {
            const itemObj = item.toObject();

            if(item.status) {
                itemObj.displayStatus = item.status;
            }
            else{
                itemObj.displayStatus = getItemStatus(item.expiryDate);
            }

            return itemObj;
        });

        if(status) {
            formattedItems = formattedItems.filter(
                item => item.displayStatus === status
            );
        }

        res.json(formattedItems)
    }
    catch(error) {
        res.status(500).json({
            message: error.message
        });
    }
}

const updateItem = async (req, res) => {
    try {
        const user = req.user;

        const item = await Item.findById(req.params.id);

        if(!item) {
            return res.status(404).json({
                message: 'Item not found'
            })
        }

        if(item.householdId.toString() !== user.householdId.toString()) {
            return res.status(403).json({
                message: 'Access denied'
            });
        }

        const household = await Household.findById(user.householdId);

        // Check if creator
        const isCreator =
            item.addedBy.toString() ===
            user._id.toString();

        // Check if admin
        const isAdmin =
            household.admin.toString() ===
            user._id.toString();

        // Authorization check
        if (!isCreator && !isAdmin) {
            return res.status(403).json({
                message: 'Not allowed to edit this item'
            });
        }

        // Extract fields
        const {
            name,
            category,
            quantity,
            expiryDate
        } = req.body;

        // Update only provided fields
        if (name) item.name = name;

        if (category) item.category = category;

        if (quantity) item.quantity = quantity;

        if (expiryDate) item.expiryDate = expiryDate;

        // Save updates
        await item.save();

        // Convert to plain object
        const itemObj = item.toObject();

        // Compute status
        if (item.status) {
            itemObj.displayStatus = item.status;
        } else {
            itemObj.displayStatus =
                getItemStatus(item.expiryDate);
        }

        res.json(itemObj);
    }
    catch(error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const deleteItem = async (req, res) => {
    try {
        const user = req.user;

        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                message: 'Item not found'
            });
        }

        // Same household check
        if (
            item.householdId.toString() !==
            user.householdId.toString()
        ) {
            return res.status(403).json({
                message: 'Access denied'
            });
        }

        const household = await Household.findById(
            user.householdId
        );

        const isCreator =
            item.addedBy.toString() ===
            user._id.toString();

        const isAdmin =
            household.admin.toString() ===
            user._id.toString();

        if (!isCreator && !isAdmin) {
            return res.status(403).json({
                message: 'Not allowed to delete'
            });
        }

        await item.deleteOne();

        res.json({
            message: 'Item deleted'
        });

    } catch(error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const updateItemStatus = async (req, res) => {
    try {
        const user = req.user;

        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                message: 'Item not found'
            });
        }

        // Same household security
        if (
            item.householdId.toString() !==
            user.householdId.toString()
        ) {
            return res.status(403).json({
                message: 'Access denied'
            });
        }

        const { status } = req.body;

        // Only allow these statuses
        if (
            status !== 'used' &&
            status !== 'wasted'
        ) {
            return res.status(400).json({
                message: 'Invalid status'
            });
        }

        item.status = status;

        await item.save();

        res.json(item);

    } catch(error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createItem, getItems, deleteItem, updateItem, updateItemStatus
};