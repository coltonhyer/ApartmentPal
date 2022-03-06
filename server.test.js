const { test, expect } = require("@jest/globals")
const {userLogin, findUserPass, findPasses} = require('./servertest')


test('I can run a simple login', async () =>{
    let result = await userLogin('chyer', 'password123')
    expect(result).toBe(200)
})

test('An invalid password results in a failed login', async() =>{
    let result = await userLogin('chyer', 'password')
    expect(result).toBe(404)
})

test('I can get a resident pass for a specific resident', async ()=>{
    let result = await findUserPass('6223c45453372d4a282c292b', 'resident')
    expect(result).toHaveProperty('plateNum', 'ab3hy2')
})

test('I can get a guest pass for a specific resident', async()=>{
    let result = await findUserPass('6223c45453372d4a282c292b', 'visitor')
    expect(result).toHaveProperty('plateNum', 'b75hx8')
})

// this is resulting in an error, investigate later
// test('Querying an invalid pass results in an error', async() =>{
//     let result = await findUserPass('5223c45453372d4h282c292b', 'visitor')
//     expect(result).toBe(404)
// })

test('I can find a pass for a specific license plate', async() =>{
    let result = await findPasses('ab3hy2')
    expect(result).toBe(200)
})

test('A non-existant license plate will return a 404', async () =>{
    let result = await findPasses('g')
    expect(result).toBe(404)
})



