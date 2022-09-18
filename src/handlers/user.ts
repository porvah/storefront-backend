import express  from "express";
import { User, UserStore } from "../models/user";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config();
const tokenSecret = process.env.SECRETTOKEN as string;

const userStore = new UserStore();

const index = async (req: express.Request, res: express.Response) => {

    const usersList = await userStore.index();
    res.json(usersList);
}

const show = async (req: express.Request, res: express.Response) => {
    try{
        const shownUser = await userStore.show(req.body.id);
        res.json(shownUser);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
    
}
const create = async (req: express.Request, res: express.Response) =>{
    try {
        const newUser: User = {
            id: req.body.id,
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: req.body.password
        }

        const user = await userStore.create(newUser);
        const jwtoken = jwt.sign({ user }, tokenSecret )
        console.log(jwtoken);
        res.json(jwtoken)
    }catch(error){
        res.status(400).send(error);
    }
}
const authentication = async (req: express.Request, res: express.Response) => {
    try {
        const userName = req.body.username
        const password = req.body.password
        const user = await userStore.auth(userName, password);
        res.json(user)
    }catch(error){
        res.status(400).send(error);
    }
}


const users_routes = (app: express.Application) => {
    app.get("/users", index);
    app.get("/users/:id", show);   
    app.post("/users", create);
    app.post("/users/auth", authentication)
}
export default users_routes;