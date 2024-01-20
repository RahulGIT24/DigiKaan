import { myCache } from "../app.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";
import { calculatePercentage } from "../utils/features.js";
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
            categories
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
            Product.distinct("category")
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
        const categoriesCountPromise = categories.map(category => Product.countDocuments({ category }))
        const categoriesCount = await Promise.all(categoriesCountPromise);
        const categoryCount: Record<string, number>[] = []
        categories.forEach((category, i) => categoryCount.push({
            [category]: Math.round((categoriesCount[i] / productCount) * 100)
        }))

        stats = {
            thisMonthRevenue: calculatePercentage(thisMonthRevenue, lastMonthRevenue),
            user: calculatePercentage(thisMonthUsers.length, lastMonthUsers.length),
            order: calculatePercentage(thisMonthOrders.length, lastMonthOrders.length),
            product: calculatePercentage(thisMonthProducts.length, lastMonthProducts.length),
            count, chart, categoryCount
        }

        myCache.set("admin-stats", JSON.stringify(stats))
    }

    return res.status(200).json({
        success: true,
        stats,
    });
});

export const getPieCharts = TryCatch(async () => { });
export const getBarCharts = TryCatch(async () => { });
export const getLineCharts = TryCatch(async () => { });
