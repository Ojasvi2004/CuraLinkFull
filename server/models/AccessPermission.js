const mongoose = require("mongoose");

const accessPermissionSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
      index: true,
    },

    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true,
    },

    accessType: {
      type: String,
      enum: ["ALL", "LIMITED"],
      default: "ALL",
    },

    grantedAt: {
      type: Date,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "EXPIRED"],
      default: "PENDING",
      index: true,
    },

    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, 
  }
);


accessPermissionSchema.index(
  { doctorId: 1, patientId: 1, status: 1 },
  { unique: false }
);


accessPermissionSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);


accessPermissionSchema.pre("save", function (next) {
  if (this.isModified("status") && this.status === "APPROVED") {
    this.grantedAt = new Date();
  }
  next();
});

module.exports = mongoose.model(
  "AccessPermission",
  accessPermissionSchema
);