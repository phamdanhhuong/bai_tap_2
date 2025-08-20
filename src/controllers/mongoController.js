const MongoUser = require("../models/mongoUser.js");
const MongoCRUDService = require("../services/MongoCRUDService.js");

const getMongoHomePage = async (req, res) => {
    try {
        let users = await MongoUser.find({ isActive: true }).select('-password');
        console.log("-------- MONGODB USERS --------");
        console.log(`Found ${users.length} users in MongoDB`);
        console.log("-------------------------------");
        
        return res.render("mongo/homepage.ejs", { 
            data: JSON.stringify(users, null, 2),
            userCount: users.length 
        });
    } catch (error) {
        console.error("Error fetching MongoDB users:", error);
        return res.status(500).render("mongo/homepage.ejs", { 
            error: "Lỗi kết nối MongoDB: " + error.message,
            data: null,
            userCount: 0
        });
    }
};

const getMongoCRUD = (req, res) => {
    return res.render("mongo/crud.ejs");
};

const getMongoFindAllCrud = async (req, res) => {
    try {
        let data = await MongoCRUDService.getAllUsers();
        return res.render("mongo/findAllUser.ejs", { datalist: data });
    } catch (error) {
        console.error("Error fetching MongoDB users:", error);
        return res.render("mongo/findAllUser.ejs", { 
            datalist: [],
            error: "Lỗi lấy danh sách người dùng: " + error.message
        });
    }
};

const postMongoCRUD = async (req, res) => {
    try {
        console.log("📝 Received request body:", req.body);
        console.log("📝 Body keys:", Object.keys(req.body || {}));
        console.log("📝 Email field:", req.body?.email);
        
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Không nhận được dữ liệu từ form"
            });
        }
        
        let result = await MongoCRUDService.createNewUser(req.body);
        console.log("✅ MongoDB user created:", result.message);
        
        return res.status(201).json({
            success: true,
            message: result.message,
            redirect: '/mongo/get-crud'
        });
        
    } catch (error) {
        console.error("❌ Error creating MongoDB user:", error);
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getMongoEditCRUD = async (req, res) => {
    let userId = req.query.id;  
    if (userId) {
        try {
            let userData = await MongoCRUDService.getUserInfoById(userId);
            return res.render("mongo/editUser.ejs", { data: userData });
        } catch (error) {
            console.error("Error fetching user for edit:", error);
            return res.status(404).render("mongo/editUser.ejs", { 
                data: null,
                error: "Không tìm thấy người dùng: " + error.message
            });
        }
    } else {
        return res.status(400).send("Thiếu ID người dùng");
    }
};

const putMongoCRUD = async (req, res) => {
    try {
        let allUsers = await MongoCRUDService.updateUser(req.body);
        return res.render("mongo/findAllUser.ejs", { 
            datalist: allUsers,
            successMessage: "Cập nhật người dùng thành công!"
        });
    } catch (error) {
        console.error("Error updating MongoDB user:", error);
        return res.status(500).render("mongo/findAllUser.ejs", { 
            datalist: [],
            error: "Lỗi cập nhật người dùng: " + error.message
        });
    }
};

const deleteMongoCRUD = async (req, res) => {
    let userId = req.query.id;
    if (userId) {
        try {
            await MongoCRUDService.deleteUser(userId);
            return res.json({
                success: true,
                message: "Xóa người dùng thành công"
            });
        } catch (error) {
            console.error("Error deleting MongoDB user:", error);
            return res.status(500).json({
                success: false,
                message: "Lỗi xóa người dùng: " + error.message
            });
        }
    } else {
        return res.status(400).json({
            success: false,
            message: "Thiếu ID người dùng"
        });
    }
};

const searchMongoCRUD = async (req, res) => {
    try {
        const searchTerm = req.query.q || '';
        let data;
        
        if (searchTerm.trim()) {
            data = await MongoCRUDService.searchUsers(searchTerm);
        } else {
            data = await MongoCRUDService.getAllUsers();
        }
        
        return res.render("mongo/findAllUser.ejs", { 
            datalist: data,
            searchTerm: searchTerm
        });
    } catch (error) {
        console.error("Error searching MongoDB users:", error);
        return res.render("mongo/findAllUser.ejs", { 
            datalist: [],
            searchTerm: req.query.q || '',
            error: "Lỗi tìm kiếm: " + error.message
        });
    }
};

module.exports = {
    getMongoHomePage,
    getMongoCRUD,
    getMongoFindAllCrud,
    postMongoCRUD,
    getMongoEditCRUD,
    putMongoCRUD,
    deleteMongoCRUD,
    searchMongoCRUD
};
