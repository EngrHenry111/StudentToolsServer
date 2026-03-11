import bcrypt from "bcryptjs";

const hashPassword = async () => {

 const password = "logicgate"; // your login password

 const hashed = await bcrypt.hash(password,10);

 console.log(hashed);

};

hashPassword();