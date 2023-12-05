const uuid = require('uuid');
const path = require('path');
const fs = require('fs');

function saveStaticImg(img){
    let fileName = uuid.v4() + '.jpg'
    img.mv(path.resolve(__dirname, '..', 'static', fileName))
    return fileName;
}

function deleteStaticPhoto(photoPath) {
    try {
        fs.unlinkSync(photoPath);
    } catch (error) {
        console.error(`Ошибка при удалении файла: ${error}`);
    }
}

function checkAndUpdateImg( old, product, obj){
    let arrImg = [];

    const oldImgArray = JSON.parse(old);
    const removedImages = product.imgs.filter((img) => !oldImgArray.includes(img));
    if(removedImages.length > 0){
        removedImages.forEach(item=>{
            deleteStaticPhoto(path.join(__dirname, '..', 'static', item));
        })
    }
    arrImg = [...oldImgArray];

    if(obj !== null && obj.img){
        if(Array.isArray(obj.img)){
            obj.img.forEach(img=>{
                arrImg.push(saveStaticImg(img))
            })
        }else{
            arrImg.push(saveStaticImg(obj.img))
        } 
    }

    return arrImg;
}

function saveImg(img){
    let arrImg = [];
    if(Array.isArray(img)){
        img.forEach(img=>{
            arrImg.push(saveStaticImg(img))
        })
    }else{
        arrImg.push(saveStaticImg(img))
    }
    return arrImg;
}

module.exports ={
    saveImg,
    deleteStaticPhoto,
    checkAndUpdateImg,
    saveImg
};