import User from "./models/user.js";

const user = new User({
    email: "Nirmal@domain.com",
    role:"owner",
});

try{
    await user.validate();
}catch(error){
    console.error("Validation error:", error.message);
}

console.log(user.email);

