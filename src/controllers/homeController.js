import db from "../models";
import CRUDService from "../services/CRUDService";

const getHomePage = async (req, res) => {
    try {
        let users = await db.User.findAll();
        console.log("-----------------------------");
        console.log(users);
        console.log("-----------------------------");
        
        return res.render("homepage.ejs", { data: JSON.stringify(users) });
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).send("Internal Server Error");
    }
};

const getAboutPage = (req, res) => {
    return res.render("test/about.ejs");
};

const getCRUD = (req, res) => {
    return res.render("crud.ejs");
};

const getFindAllCrud = async (req, res) => {
    try {
        let data = await CRUDService.getAllUsers();
        return res.render("users/findAllUser.ejs", { datalist: data });
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).send("Internal Server Error");
    }
};

const postCRUD = async (req, res) => {
    let message = await CRUDService.createNewUser(req.body);
    console.log(message);
    return res.send("Post CRUD from server");
};

const getEditCRUD = async (req, res) => {
    let userId = req.query.id;  
    if (userId) {
        let userData = await CRUDService.getUserInfoById(userId);
        return res.render("users/editUser.ejs", { data: userData });
    } else {
        return res.send("User not found");
    }
};

const putCRUD = async (req, res) => {
    let data = req.body;
    try {
        let allUsers = await CRUDService.updateUser(data);
        return res.render("users/findAllUser.ejs", { datalist: allUsers });
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).send("Internal Server Error");
    }
};

const deleteCRUD = async (req, res) => {
    let userId = req.query.id;
    if (userId) {
        try {
            await CRUDService.deleteUser(userId);
            return res.send("Delete user successfully");
        } catch (error) {
            console.error("Error deleting user:", error);
            return res.status(500).send("Internal Server Error");
        }
    } else {
        return res.send("User not found");
    }
};

export default {
    getHomePage,
    getAboutPage,
    getCRUD,
    getFindAllCrud,
    postCRUD,
    getEditCRUD,
    putCRUD,
    deleteCRUD
};
