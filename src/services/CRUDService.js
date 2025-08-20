import bcrypt from 'bcrypt';
import db from '../models/index.js';

const salt = bcrypt.genSaltSync(10);
const createNewUser = async (data) => {
    try {
        let hashPasswordFromBcrypt = await hashUserPassword(data.password);
        await db.User.create({
            email: data.email,
            password: hashPasswordFromBcrypt,
            firstName: data.firstName,
            lastName: data.lastName,
            address: data.address,
            phoneNumber: data.phoneNumber,
            gender: data.gender==='1' ? true : false,
            roleId: data.roleId,
        });
    } catch (error) {
        throw error;
    }
};

const hashUserPassword = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, salt, (err, hash) => {
            if (err) reject(err);
            resolve(hash);
        });
    });
};

const getAllUsers = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                raw: true,
            });
            resolve(users);
        } catch (error) {
            reject(error);
        }
    });
};
const getUserInfoById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId },
                raw: true,
            });
            resolve(user);
        } catch (error) {
            reject(error);
        }
    });
};

const updateUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: data.id },
            });
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                await user.save();
                let allUsers = await db.User.findAll({
                    raw: true,
                });
                resolve(allUsers);
            } else {
                reject(new Error('User not found'));
            }
        } catch (error) {
            reject(error);
        }
    });
};

const deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId },
            });
            if (user) {
                await user.destroy();
                resolve('User deleted successfully');
            } else {
                reject(new Error('User not found'));
            }
        } catch (error) {
            reject(error);
        }
    });
};

export default {
    createNewUser,
    getAllUsers,
    getUserInfoById,
    updateUser,
    deleteUser
};
