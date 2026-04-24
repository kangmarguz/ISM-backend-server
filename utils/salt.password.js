import bcrypt from 'bcrypt';

export const saltPassword = async (password)=> {
    const saltRounds = parseInt(process.env.SALTED_ENCODE);
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
}