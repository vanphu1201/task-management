const Task = require("../models/task.model");

const paginationHelper = require("../../../helper/pagination");

// [GET] /api/v1/tasks
module.exports.index = async (req, res) => {
    const find = {
        deleted: false
    };

    if (req.query.status) {
        find.status = req.query.status;
    }

    // Pagination
    let initPagination = {
        currentPage: 1,
        limitItems: 2
    };
    const countTask = await Task.countDocuments(find);
    const objectPagination = paginationHelper(
        initPagination,
        req.query,
        countTask
    );
    // End Pagination

    // Search
    let keyword = req.query.keyword;
    if (keyword){
        const regex = new RegExp(keyword, "i");
        find.title = regex;
    }
    // End Search


    const sort = {};

    if (req.query.sortKey && req.query.sortValue) {
        find[sortKey] = sortValue;
    }

    const tasks = await Task.find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip)

    res.json(tasks)
}

// [GET] /api/v1/tasks/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;

        const task = await Task.findOne({
            _id: id,
            deleted: false
        })

        res.json(task)
    } catch (error) {
        res.json("Khoong tim thay")
    }
}