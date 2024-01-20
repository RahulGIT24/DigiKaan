import { myCache } from "../app.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";
import { calculatePercentage, getInventories } from "../utils/features.js";
import { TryCatch } from "../utils/utility-class.js";

export const getDashBoardStats = TryCatch(async (req, res, next) => {
    let stats;
    if (myCache.has("admin-stats"))
        stats = JSON.parse(myCache.get("admin-stats") as string);
    else {
        const today = new Date(); // it is also the end of this month
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

        // Current month
        const thisMonth = {
            start: new Date(today.getFullYear(), today.getMonth(), 1),
            end: today,
        };

        // Last Month
        const lastMonth = {
            start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
            end: new Date(today.getFullYear(), today.getMonth(), 0),
        };

        // Products which are created this month
        const thisMonthProductsPromise = Product.find({
            createdAt: {
                $gte: thisMonth.start,
                $lte: thisMonth.end,
            },
        });
        // Products which are created last month
        const lastMonthProductsPromise = Product.find({
            createdAt: {
                $gte: lastMonth.start,
                $lte: lastMonth.end,
            },
        });

        // Users which are created this month
        const thisMonthUsersPromise = User.find({
            createdAt: {
                $gte: thisMonth.start,
                $lte: thisMonth.end,
            },
        });
        // Users which are created last month
        const lastMonthUsersPromise = User.find({
            createdAt: {
                $gte: lastMonth.start,
                $lte: lastMonth.end,
            },
        });

        // Orers which are created this month
        const thisMonthOrdersPromise = Order.find({
            createdAt: {
                $gte: thisMonth.start,
                $lte: thisMonth.end,
            },
        });
        // Orers which are created last month
        const lastMonthOrdersPromise = Order.find({
            createdAt: {
                $gte: lastMonth.start,
                $lte: lastMonth.end,
            },
        });

        const lastSixMonthOrdersPromise = Order.find({
            createdAt: {
                $gte: sixMonthsAgo,
                $lte: today,
            },
        });

        const [
            thisMonthOrders,
            thisMonthUsers,
            thisMonthProducts,
            lastMonthOrders,
            lastMonthUsers,
            lastMonthProducts,
            lastSixMonthOrders,
            productCount,
            userCount,
            orderCount,
            categories,
            femaleUsers,
            latestTransactions
        ] = await Promise.all([
            thisMonthOrdersPromise,
            thisMonthUsersPromise,
            thisMonthProductsPromise,
            lastMonthOrdersPromise,
            lastMonthUsersPromise,
            lastMonthProductsPromise,
            lastSixMonthOrdersPromise,
            Product.countDocuments(),
            User.countDocuments(),
            Order.find({}).select("total"),
            Product.distinct("category"),
            User.countDocuments({ gender: "female" }),
            Order.find({}).select(["orderItems", "discount", "total", "status"]).limit(4)
        ]);


        // this month's total revenue
        let thisMonthRevenue = 0, lastMonthRevenue = 0, totalRevenue = 0;

        for (let index = 0; index < thisMonthOrders.length; index++) {
            thisMonthRevenue += thisMonthOrders[index].total;
        }
        for (let index = 0; index < lastMonthOrders.length; index++) {
            lastMonthRevenue += thisMonthOrders[index].total;
        }

        // Total revenue
        for (let index = 0; index < orderCount.length; index++) {
            totalRevenue += orderCount[index].total;
        }

        const count = {
            totalRevenue,
            productCount, orderCount: orderCount.length, userCount
        }

        // Last six months stats
        const orderMonthCounts = new Array(6).fill(0);
        const orderMontlyRevenue = new Array(6).fill(0);
        lastSixMonthOrders.forEach((order) => {
            const creationDate = order.createdAt
            const monthDifference = today.getMonth() - creationDate.getMonth();
            if (monthDifference < 6) {
                // 0 based indexing so 6-1
                orderMonthCounts[6 - 1 - monthDifference] += 1;
                orderMontlyRevenue[6 - 1 - monthDifference] += order.total;
            }
        })
        const chart = {
            order: orderMonthCounts,
            revenue: orderMontlyRevenue
        }

        // Inventory
        const categoryCount: Record<string, number>[] = await getInventories({ categories, productCount })

        // Male female Ratio
        const userRatio = {
            male: userCount - femaleUsers,
            female: femaleUsers
        }

        // Modifying latest transaction
        const modifiedLatestTransaction = latestTransactions.map((i) => ({
            _id: i._id,
            discount: i.discount,
            total: i.total,
            status: i.status,
            quantity: i.orderItems.length
        }))

        stats = {
            thisMonthRevenue: calculatePercentage(thisMonthRevenue, lastMonthRevenue),
            user: calculatePercentage(thisMonthUsers.length, lastMonthUsers.length),
            order: calculatePercentage(thisMonthOrders.length, lastMonthOrders.length),
            product: calculatePercentage(thisMonthProducts.length, lastMonthProducts.length),
            count, chart, categoryCount, userRatio, latestTransactions: modifiedLatestTransaction
        }

        myCache.set("admin-stats", JSON.stringify(stats))
    }

    return res.status(200).json({
        success: true,
        stats,
    });
});

export const getPieCharts = TryCatch(async (req, res, next) => {
    let charts;
    if (myCache.has("admin-pie-chart")) charts = JSON.parse(myCache.get("admin-pie-chart") as string);
    else {
        const [
            procesingOrder,
            shippedOrder,
            deliveredOrder,
            categories,
            productCount,
            productsOutOfStock,
            allOrders,
            allUsersDOB,
            admins,
            customers
        ] = await Promise.all([
            Order.countDocuments({ status: "Processing" }),
            Order.countDocuments({ status: "Shipped" }),
            Order.countDocuments({ status: "Delivered" }),
            Product.distinct("category"),
            Product.countDocuments(),
            Product.countDocuments({ stock: 0 }),
            Order.find({}).select(["total", "discount", "subtotal", "tax", "shippingCharges"]),
            User.find({}).select(["dob"]),
            User.countDocuments({ role: "admin" }),
            User.countDocuments({ role: "user" })
        ])

        // for processing, shipped and delivered
        const orderFullFillMent = {
            processing: procesingOrder,
            shipped: shippedOrder,
            delivered: deliveredOrder
        }

        // For categories
        const categoryCount: Record<string, number>[] = await getInventories({ categories, productCount })

        // For stock availability
        const stockAvailability = {
            inStock: productCount - productsOutOfStock,
            outOfStock: productsOutOfStock
        }

        // Revenue distribution
        const grossIncome = allOrders.reduce((prev, order) => prev + (order.total || 0), 0)
        const discount = allOrders.reduce((prev, order) => prev + (order.discount || 0), 0)
        const productionCost = allOrders.reduce((prev, order) => prev + (order.shippingCharges || 0), 0)
        const burn = allOrders.reduce((prev, order) => prev + (order.tax || 0), 0)
        const marketingCost = Math.round(grossIncome * (20 / 100));
        const netMargin = grossIncome - discount - productionCost - burn - marketingCost;
        const revenueDistribution = {
            netMargin,
            productionCost,
            burn,
            marketingCost,
            discount
        };

        // Customers and admins count
        const adminCustomer = {
            admin: admins,
            customers
        }

        // User age group
        const usersAgeGroup = {
            teen: allUsersDOB.filter((i) => i.age < 20).length,
            adult: allUsersDOB.filter((i) => i.age >= 20 && i.age < 40).length,
            old: allUsersDOB.filter((i) => i.age >= 40).length,
        }

        charts = { orderFullFillMent, productCategories: categoryCount, productCount, stockAvailability, revenueDistribution, adminCustomer, usersAgeGroup }
        myCache.set("admin-pie-chart", JSON.stringify(charts));
    }
    return res.status(200).json({
        success: true,
        charts,
    });
});

export const getBarCharts = TryCatch(async () => { });
export const getLineCharts = TryCatch(async () => { });
