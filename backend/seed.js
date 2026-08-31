require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDatabase = require("./config/database");
const { Admin } = require("./schemas/adminSchema");
const { Lead } = require("./schemas/leadSchema");
const { Contact } = require("./schemas/contactSchema");
const { Deal } = require("./schemas/dealSchema");
const { ActivityLog } = require("./schemas/activitySchema");
const { Notification } = require("./schemas/notificationSchema");

async function seed() {
  await connectDatabase();

  await Promise.all([
    Admin.deleteMany({}),
    Lead.deleteMany({}),
    Contact.deleteMany({}),
    Deal.deleteMany({}),
    ActivityLog.deleteMany({}),
    Notification.deleteMany({})
  ]);

  const password = await bcrypt.hash("Admin@123", 12);
  const admin = await Admin.create({
    name: "CRM Admin",
    email: "admin@crm.local",
    password,
    role: "admin"
  });

  const agentPassword = await bcrypt.hash("Agent@123", 12);
  const agent = await Admin.create({
    name: "Sales Agent",
    email: "agent@crm.local",
    password: agentPassword,
    role: "agent"
  });

  const leads = await Lead.insertMany([
    {
      firstName: "Aarav",
      lastName: "Sharma",
      email: "aarav@example.com",
      phone: "9876543210",
      company: "Acme Technologies",
      source: "Website",
      status: "Qualified",
      assignedTo: agent._id,
      createdBy: admin._id
    },
    {
      firstName: "Priya",
      lastName: "Rao",
      email: "priya@example.com",
      phone: "9876501234",
      company: "Bright Retail",
      source: "Referral",
      status: "Contacted",
      assignedTo: agent._id,
      createdBy: admin._id
    }
  ]);

  const contacts = await Contact.insertMany([
    {
      firstName: "Rahul",
      lastName: "Mehta",
      email: "rahul@example.com",
      phone: "9999999999",
      company: "Nova Systems",
      jobTitle: "Procurement Head",
      assignedTo: agent._id,
      createdBy: admin._id
    },
    {
      firstName: "Sneha",
      lastName: "Iyer",
      email: "sneha@example.com",
      phone: "8888888888",
      company: "Urban Labs",
      jobTitle: "Operations Manager",
      assignedTo: agent._id,
      createdBy: admin._id
    }
  ]);

  await Deal.insertMany([
    {
      title: "Nova CRM Subscription",
      contact: contacts[0]._id,
      company: contacts[0].company,
      value: 125000,
      stage: "Won",
      probability: 100,
      expectedCloseDate: new Date(),
      assignedTo: agent._id,
      createdBy: admin._id
    },
    {
      title: "Urban Labs Expansion",
      contact: contacts[1]._id,
      company: contacts[1].company,
      value: 85000,
      stage: "In Progress",
      probability: 60,
      expectedCloseDate: new Date(Date.now() + 30 * 86400000),
      assignedTo: agent._id,
      createdBy: admin._id
    },
    {
      title: "Acme Enterprise Package",
      contact: contacts[0]._id,
      company: "Acme Technologies",
      value: 210000,
      stage: "New",
      probability: 20,
      expectedCloseDate: new Date(Date.now() + 60 * 86400000),
      assignedTo: agent._id,
      createdBy: admin._id
    }
  ]);

  await ActivityLog.create({
    user: admin._id,
    userName: admin.name,
    action: "SEED",
    entityType: "System",
    description: "Initial CRM demo data created"
  });

  console.log("Seed completed.");
  console.log("Admin: admin@crm.local / Admin@123");
  console.log("Agent: agent@crm.local / Agent@123");
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
