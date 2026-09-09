const mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [3, "Name must be at least 3 characters long"],
    required: [true, "Name is required"],
  },
  number: {
    type: String,
    required: [true, "Number is required"],
    validate: {
      validator: function (value) {
        return /^\d{2,3}-\d+$/.test(value) && value.length >= 8;
      },
      message: (props) =>
        `${props.value} is not a valid phone number`,
    },
  },
});

module.exports = mongoose.model("Person", personSchema);