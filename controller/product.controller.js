import prisma from '../config/prismaclient.js';
import errorResponse from '../utils/error.js';

export const createProduct = async (req, res, next) => {
    res.json({
        message: 'Product created successfully',
        data: req.body,
    });
};

export const createVanBooking = async (req, res, next) => {
    try {
        const { people, user } = req.body;
        const result = await prisma.task.create({
            data: {
                title: user.name,
                startDate: req.body.start,
                endDate: req.body.end,
                description: req.body.detail,
                assignedToId: user.id,
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

export const getVanBookingHistory = async (req, res, next) => {
    try {
        const result = await prisma.task.findMany({
            where: {
                isActive: true
            }
        });
        res.json({
            status: {
                code: '200',
                message: 'create success.',
            },
            result
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const getHistory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { limit } = req.query; // ?limit=5
        const result = await prisma.task.findMany({
            where: {
                assignedToId: id,
                isActive: true,
                status: {
                    in: ['IN_PROGRESS', 'PENDING'],
                },
            },
            select: {
                id: true,
                title: true,
                description: true,
                startDate: true,
                endDate: true,
                status: true,
                taskImages: {
                    select: {
                        id: true,
                        url: true,
                        description: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'asc',
            },
            ...(limit && { take: Number(limit) }),
        });
        res.json({ status: { code: '200', message: 'success' }, result });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const deleteHistory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await prisma.task.update({
            where: {
                id,
            },
            data: {
                isActive: false,
            },
        });

        res.json({
            status: {
                code: '200',
                message: 'Delete success.',
            },
            result,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const updateBookingStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        console.log("STATUS INPUT", status);
        
        if (!id) {
            return errorResponse('Booking id is required.', 400);
        }

        if (!status || typeof status !== 'string') {
            return errorResponse('Status is required.', 400);
        }

        const normalizedStatus = status.toUpperCase();
        const allowedStatuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCEL'];

        if (!allowedStatuses.includes(normalizedStatus)) {
            return errorResponse('Invalid booking status.', 400);
        }

        const existingBooking = await prisma.task.findUnique({
            where: { id },
        });

        if (!existingBooking) {
            return errorResponse('Booking not found.', 404);
        }

        const result = await prisma.task.update({
            where: { id },
            data: {
                status: normalizedStatus,
            },
            select: {
                id: true,
                title: true,
                description: true,
                startDate: true,
                endDate: true,
                status: true,
                isActive: true,
                assignedToId: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        res.json({
            status: {
                code: '200',
                message: 'Booking status updated successfully.',
            },
            result,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};
