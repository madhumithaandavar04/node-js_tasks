import Joi from "joi";
/**
 * get the validate schema and return the validate function
 * @param {*} schema 
 * @returns validateSignup function
 */
const validator = (schema) => {
    return (payload) => {
return schema.validate(payload);
}
}
//signup Schema
const signupSchema = Joi.object({
   employeeId:Joi.number().required(), 
   realName:Joi.string().required(),
   nickName:Joi.string().required(),
   dob:Joi.string().required(),
    hobbies:Joi.string().required()
})

const validateSignup = validator(signupSchema);

export default validateSignup;
