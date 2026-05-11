
const Household = require("../models/Household");
const User = require("../models/User");
const generateInviteCode = require("../utils/generateInviteCode");

const createHousehold = async (req, res) => {
    try {
        const user = req.user

        if(user.householdId) {
            return res.status(400).json({message: "Already in a household"});
        }

        let inviteCode;
        let exists = true;

        while(exists) {
            inviteCode = generateInviteCode();
            exists = await Household.findOne({ inviteCode})
        }

        const household = await Household.create({
            name: req.body.name,
            inviteCode,
            members: [user._id],
            admin: user._id
        })

        user.householdId = household._id
        await user.save();

        res.status(201).json(household);
    }
    catch(error) {
        res.status(500).json({ message: error.message })
    }
}

const joinHousehold = async (req, res) => {
    try {
        const { inviteCode } = req.body;
        const user = req.user;

        if(user.householdId) {
            return res.status(400).json({message: "Already in a household"});
        }

        const household = await Household.findOne({ inviteCode });

        if(!household) {
            return res.status(404).json({message: 'Invalid invite code'})
        }

        household.members.push(user._id);
        await household.save();

        user.householdId = household._id;
        await user.save();

        res.json(household);
    }
    catch(error) {
        return res.status(500).json({message: error.message})
    }
}

const getMyHousehold = async (req, res) => {
    try {
        const user = req.user;

        if(!user.householdId) {
            return res.status(404).json({message: 'No household found'})
        }

        const household = await Household.findById(user.householdId);

        res.json(household);
    }
    catch(error) {
        res.status(500).json({message: error.message})
    }
}

const getMembers = async (req, res) => {
    try {
        const household = await Household.findById(req.params.id)
            .populate('members', 'name email')

        if(!household) {
            return res.status(404).json({ message: 'Household not found'})
        }

        res.json(household.members);

    }
    catch(error) {
        res.status(500).json({message: error.message})
    }
}

const leaveHousehold = async (req, res) => {
    try {
        const user = req.user;

        if(!user.householdId) {
            return res.status(400).json({message: 'You are not in a household'});
        }

        const household = await Household.findById(user.householdId)

        household.members = household.members.filter(
            member => member.toString() !== user._id.toString()
        )

        await household.save();

        user.householdId = null;
        await user.save();

        res.json({message: 'Left household'})
    }
    catch(error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = { createHousehold, joinHousehold, getMyHousehold, getMembers, leaveHousehold};