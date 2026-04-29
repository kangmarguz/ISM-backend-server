import prisma from '../config/prismaclient.js';

export const createProduct = async (req, res, next) => {
    console.log(req.body);

    res.json({
        message: 'Product created successfully',
        data: req.body,
    });
};

export const createVanBooking = async (req, res, next) => {
    try {
        const { people } = req.body;

        const result = await prisma.task.create({
            data: {
                startDate: req.body.start,
                endDate: req.body.end,
                description: req.body.detail,
                assignedToId: req.body.user.id,
                taskImages: {
                    create: people.map((item) => ({
                        url: item.role + ' ' + item.name,
                        description: item.refID,
                    })),
                },
            },
        });

        res.json({
            status: {
                code: '200',
                message: 'create success.',
            },
            result: {
                id: result.id,
            },
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const getHistory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await prisma.task.findMany({
            where: {
                assignedToId: id,
                status: {
                    in: ['COMPLETED', 'PENDING'],
                },
            },
            select: {
                id: true,
                description: true,
                startDate: true,
                taskImages: {
                    select: {
                        id: true,
                        url: true,
                    },
                },
            },
        });
        console.log(result);
        res.json({ status: { code: '200', message: 'success' }, result });
    } catch (error) {
        console.log(error);
        next(error);
    }
};
