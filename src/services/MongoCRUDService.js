const MongoUser = require('../models/mongoUser.js');

const createNewUser = async (data) => {
    try {
        // Kiểm tra email đã tồn tại chưa
        const existingUser = await MongoUser.findByEmail(data.email);
        if (existingUser) {
            throw new Error('Email đã được sử dụng');
        }

        // Tạo user mới
        const newUser = new MongoUser({
            email: data.email,
            password: data.password,
            firstName: data.firstName,
            lastName: data.lastName,
            address: data.address || '',
            phoneNumber: data.phoneNumber || '',
            gender: data.gender === '1' ? true : false,
            roleId: data.roleId || 'R3',
            positionId: data.positionId || ''
        });

        const savedUser = await newUser.save();
        console.log('✅ User created successfully:', savedUser.email);
        
        return {
            success: true,
            message: 'Tạo người dùng thành công',
            user: savedUser.toSafeObject()
        };
        
    } catch (error) {
        console.error('❌ Error creating user:', error.message);
        throw new Error(`Lỗi tạo người dùng: ${error.message}`);
    }
};

const getAllUsers = async () => {
    try {
        const users = await MongoUser.find({ isActive: true })
            .select('-password') // Loại bỏ password khỏi kết quả
            .sort({ createdAt: -1 }) // Sắp xếp theo thời gian tạo (mới nhất trước)
            .lean(); // Trả về plain JavaScript objects

        console.log(`📋 Retrieved ${users.length} users from MongoDB`);
        return users;
        
    } catch (error) {
        console.error('❌ Error getting all users:', error.message);
        throw new Error(`Lỗi lấy danh sách người dùng: ${error.message}`);
    }
};

const getUserInfoById = async (userId) => {
    try {
        if (!userId) {
            throw new Error('ID người dùng không được để trống');
        }

        const user = await MongoUser.findById(userId)
            .select('-password')
            .lean();

        if (!user) {
            throw new Error('Không tìm thấy người dùng');
        }

        console.log(`👤 Retrieved user info: ${user.email}`);
        return user;
        
    } catch (error) {
        console.error('❌ Error getting user by ID:', error.message);
        throw new Error(`Lỗi lấy thông tin người dùng: ${error.message}`);
    }
};

const updateUser = async (data) => {
    try {
        if (!data.id) {
            throw new Error('ID người dùng không được để trống');
        }

        // Tìm user cần update
        const user = await MongoUser.findById(data.id);
        if (!user) {
            throw new Error('Không tìm thấy người dùng');
        }

        // Cập nhật các trường được phép thay đổi
        const updateFields = {
            firstName: data.firstName,
            lastName: data.lastName,
            address: data.address || '',
            phoneNumber: data.phoneNumber || '',
            gender: data.gender === '1' ? true : false,
            roleId: data.roleId || user.roleId,
            positionId: data.positionId || ''
        };

        // Sử dụng findByIdAndUpdate để cập nhật
        const updatedUser = await MongoUser.findByIdAndUpdate(
            data.id,
            updateFields,
            { 
                new: true, // Trả về document sau khi update
                runValidators: true // Chạy validation
            }
        ).select('-password');

        if (!updatedUser) {
            throw new Error('Cập nhật không thành công');
        }

        console.log(`✅ User updated successfully: ${updatedUser.email}`);

        // Trả về danh sách tất cả users sau khi update
        const allUsers = await getAllUsers();
        return allUsers;
        
    } catch (error) {
        console.error('❌ Error updating user:', error.message);
        throw new Error(`Lỗi cập nhật người dùng: ${error.message}`);
    }
};

const deleteUser = async (userId) => {
    try {
        if (!userId) {
            throw new Error('ID người dùng không được để trống');
        }

        // Soft delete - chỉ đánh dấu isActive = false
        const deletedUser = await MongoUser.findByIdAndUpdate(
            userId,
            { isActive: false },
            { new: true }
        );

        if (!deletedUser) {
            throw new Error('Không tìm thấy người dùng');
        }

        console.log(`🗑️ User soft deleted: ${deletedUser.email}`);
        return {
            success: true,
            message: 'Xóa người dùng thành công'
        };
        
    } catch (error) {
        console.error('❌ Error deleting user:', error.message);
        throw new Error(`Lỗi xóa người dùng: ${error.message}`);
    }
};

// Thêm method để hard delete (xóa vĩnh viễn)
const hardDeleteUser = async (userId) => {
    try {
        if (!userId) {
            throw new Error('ID người dùng không được để trống');
        }

        const deletedUser = await MongoUser.findByIdAndDelete(userId);
        
        if (!deletedUser) {
            throw new Error('Không tìm thấy người dùng');
        }

        console.log(`💀 User permanently deleted: ${deletedUser.email}`);
        return {
            success: true,
            message: 'Xóa vĩnh viễn người dùng thành công'
        };
        
    } catch (error) {
        console.error('❌ Error hard deleting user:', error.message);
        throw new Error(`Lỗi xóa vĩnh viễn người dùng: ${error.message}`);
    }
};

// Method để tìm kiếm users
const searchUsers = async (searchTerm) => {
    try {
        const users = await MongoUser.find({
            isActive: true,
            $or: [
                { email: { $regex: searchTerm, $options: 'i' } },
                { firstName: { $regex: searchTerm, $options: 'i' } },
                { lastName: { $regex: searchTerm, $options: 'i' } },
                { phoneNumber: { $regex: searchTerm, $options: 'i' } }
            ]
        })
        .select('-password')
        .sort({ createdAt: -1 })
        .lean();

        console.log(`🔍 Search found ${users.length} users for term: "${searchTerm}"`);
        return users;
        
    } catch (error) {
        console.error('❌ Error searching users:', error.message);
        throw new Error(`Lỗi tìm kiếm người dùng: ${error.message}`);
    }
};

module.exports = {
    createNewUser,
    getAllUsers,
    getUserInfoById,
    updateUser,
    deleteUser,
    hardDeleteUser,
    searchUsers
};
