import mongoose from 'mongoose';
import mongooseSequence from 'mongoose-sequence';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; 

const AutoIncrement = mongooseSequence(mongoose); // Initialize the plugin

const userSchema = new mongoose.Schema({
    userId: {
        type: Number,
        unique: true, // Ensure the userId is unique
        required: false,
    },
    userName: {
        type: String,
        required: true,
        minlength: [2, "Username is required"],
    },
    firstName: {
        type: String,
        required: true,
        minlength: [2, "First Name is required"],
    },
    lastName: {
        type: String,
        required: true,
        minlength: [2, "Last Name is required"],
    },
    gender: {
        type: String,
        required: true,
        enum: ["Male", "Female"],
    },
    phone: {
        type: String,
        required: true,
        minlength: [2, "Phone number is required"],
    },
    userPass: {
        type: String,
        required: true,
        minlength: [6, "Password must be at least 6 characters"],
        select: false,
    },
    role: {
        type: String,
        required: true,
        enum: ["Patient", "Doctor", "Admin", "Manager", "Nurse", "Cleaner", "Receptionist"],
    },
    currentCondition: { type: String }, // for patients
    admissionDate: { type: Date }, // for patients
    assignedEmployee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // employee reference
    medicalHistory: { type: String }, // for patients
    assignedHospital: [{ type: String }], // for admin
    assignedManagers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // For admin
    assignedDepartments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Department' }], // For managers
    doctorDepartment: { type: String }, // For doctors
    shifts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shift' }], // For employees
}, {
    timestamps: true,
});

// Apply the auto-increment plugin to the userId field
userSchema.plugin(AutoIncrement, { inc_field: 'userId' }); // Auto-increment userId

// Hashing the password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("userPass")) {
        return next();
    }
    this.userPass = await bcrypt.hash(this.userPass, 10);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.userPass);
};

// Generate JWT
userSchema.methods.generateJsonWebToken = function () {
    return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES,
    });
};

const User = mongoose.model('User', userSchema);
export default User;
