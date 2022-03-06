const axios = require('axios')


async function userLogin(username, password){
    return await axios.get(`http://localhost:3000/logins?username=${username}&password=${password}`).then(res=>{return res.status}).catch((err)=>{return err.response.status})
}

async function findUserPass(id,type){
    return await axios.get(`http://localhost:3000/passes/${type}/${id}`).then(res=>{return res.data}).catch((err)=>{return err.response.status})
}

async function findPasses(plate){
    return await axios.get(`http://localhost:3000/passes?plate=${plate}`).then(res=>{return res.status}).catch((err)=>{return err.response.status})
}

module.exports = {
    userLogin,
    findUserPass,
    findPasses
}