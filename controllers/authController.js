const UserModel = require('../models/user-model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator');

const generateAccessToken = (id, email)=>{
    return jwt.sign({_id: id, email}, process.env.SECRET_KEY, {expiresIn:'24h'})
}

class AuthController {
    async registration(req,res){
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).json({message: 'Ошибка при регистрации', errors})
            }
            const {password, email} = req.body;
            const candidate = await UserModel.findOne({email});
            if(candidate){
                return res.status(400).json({message: 'Пользователь с таким email уже существует'})
            }
            const hashPassword = await bcrypt.hash(password, 8);
            const user = new UserModel({password: hashPassword, email});
            await user.save();
            const token = generateAccessToken(user._id, user.email)
            return res.json({token})
        } catch (e) {
            res.status(400).json({message: 'Registration error'})
        }
    }
    async login(req, res){
        try {
            const {email, password} = req.body;
            const user = await UserModel.findOne({email})
            if(!user){
                return res.status(400).json({message: `Пользователь с таким ${email} не найден`})
            }
            const validPassword = bcrypt.compareSync(password, user.password);
            if(!validPassword){
                return res.status(400).json({message: 'Некорректный email или password'})
            }
            const token = generateAccessToken(user._id, user.email)
            return res.json({token})
        } catch (e) {
            res.status(400).json({message: 'Login error'})
        }
    }
    async check(req, res){
        const token = generateAccessToken(req.user._id, req.user.email);
        return res.json({token});
    }
}

module.exports = new AuthController();