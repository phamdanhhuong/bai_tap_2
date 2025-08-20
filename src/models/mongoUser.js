const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email là bắt buộc'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function(v) {
                return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: 'Email không hợp lệ'
        }
    },
    password: {
        type: String,
        required: [true, 'Mật khẩu là bắt buộc'],
        minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự']
    },
    firstName: {
        type: String,
        required: [true, 'Tên là bắt buộc'],
        trim: true,
        maxlength: [50, 'Tên không được vượt quá 50 ký tự']
    },
    lastName: {
        type: String,
        required: [true, 'Họ là bắt buộc'],
        trim: true,
        maxlength: [50, 'Họ không được vượt quá 50 ký tự']
    },
    address: {
        type: String,
        trim: true,
        maxlength: [200, 'Địa chỉ không được vượt quá 200 ký tự']
    },
    phoneNumber: {
        type: String,
        trim: true,
        validate: {
            validator: function(v) {
                return !v || /^[\+]?[\d\s\-\(\)]{10,15}$/.test(v);
            },
            message: 'Số điện thoại không hợp lệ'
        }
    },
    gender: {
        type: Boolean,
        default: true // true = Nam, false = Nữ
    },
    image: {
        type: String,
        default: null
    },
    roleId: {
        type: String,
        enum: ['R1', 'R2', 'R3', ''],
        default: 'R3' // R1: Admin, R2: Doctor, R3: Patient
    },
    positionId: {
        type: String,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true, // Tự động thêm createdAt và updatedAt
    versionKey: false // Loại bỏ __v field
});

// Virtual field để lấy tên đầy đủ
userSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

// Virtual field để lấy text giới tính
userSchema.virtual('genderText').get(function() {
    return this.gender ? 'Nam' : 'Nữ';
});

// Virtual field để lấy text vai trò
userSchema.virtual('roleText').get(function() {
    const roles = {
        'R1': 'Admin',
        'R2': 'Doctor', 
        'R3': 'Patient'
    };
    return roles[this.roleId] || 'Unknown';
});

// Middleware để hash password trước khi save
userSchema.pre('save', async function(next) {
    // Chỉ hash password nếu nó được modify
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method để so sánh password
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error(error);
    }
};

// Static method để tìm user theo email
userSchema.statics.findByEmail = function(email) {
    return this.findOne({ email: email.toLowerCase() });
};

// Method để convert thành object an toàn (loại bỏ password)
userSchema.methods.toSafeObject = function() {
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
};

// Thêm index cho performance
userSchema.index({ email: 1 });
userSchema.index({ roleId: 1 });
userSchema.index({ createdAt: -1 });

const MongoUser = mongoose.model('User', userSchema, 'users');

module.exports = MongoUser;
