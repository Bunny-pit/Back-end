const mongoose = require("mongoose");

const mainhomeSchema = new mongoose.schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Mainhome = mongoose.model("Mainhome", mainhomeSchema);
module.exports = { Mainhome };
