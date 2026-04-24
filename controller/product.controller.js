export const createProduct = async (req, res, next) => {
    res.json({
        message: 'Product created successfully',
        data: req.body
    });
}