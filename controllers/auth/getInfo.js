const getInfo = async (req, res) => {
    const { userName, email, _id: id } = req.user;
    res.status(201).json({
        token,
        user: {
            email,
            id,
            userName,
        },
    });
};
export default getInfo;
