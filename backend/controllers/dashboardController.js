const { Lead } = require("../schemas/leadSchema");
const { Contact } = require("../schemas/contactSchema");
const { Deal } = require("../schemas/dealSchema");

async function summary(req, res) {
  const [
    totalLeads,
    totalContacts,
    totalDeals,
    wonDeals,
    lostDeals,
    pipeline,
    stageCounts
  ] = await Promise.all([
    Lead.countDocuments(),
    Contact.countDocuments(),
    Deal.countDocuments(),
    Deal.find({ stage: "Won" }).select("value"),
    Deal.find({ stage: "Lost" }).select("value"),
    Deal.aggregate([
      { $match: { stage: { $in: ["New", "In Progress"] } } },
      { $group: { _id: null, value: { $sum: "$value" } } }
    ]),
    Deal.aggregate([
      { $group: { _id: "$stage", count: { $sum: 1 }, value: { $sum: "$value" } } },
      { $sort: { _id: 1 } }
    ])
  ]);

  const wonRevenue = wonDeals.reduce((sum, d) => sum + d.value, 0);
  const lostValue = lostDeals.reduce((sum, d) => sum + d.value, 0);

  res.json({
    totalLeads,
    totalContacts,
    totalDeals,
    wonCount: wonDeals.length,
    lostCount: lostDeals.length,
    wonRevenue,
    lostValue,
    pipelineValue: pipeline[0]?.value || 0,
    stageCounts
  });
}

module.exports = { summary };
