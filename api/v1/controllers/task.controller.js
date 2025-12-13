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

// [PATCH] /api/v1/tasks/change-status/:id
module.exports.changeStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const status = req.body.status;

        await Task.updateOne({_id: id}, {status: status});
        

        res.json({
            code: 200,
            message: "Cập nhập trạng thái thành công"
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "Không tồn tại"
        })
    }
}


// [PATCH] /api/v1/tasks/change-multi
module.exports.changeMulti = async (req, res) => {
    try {
        const { ids, key, value} = req.body;

        switch (key) {
            case "status":
                    await Task.updateMany({
                        _id: {$in: ids}
                    }, {
                        status: value
                    });
                    res.json({
                        code: 200,
                        message: "Cập nhập thành công"
                    })
                break;
        
            default:
                res.json({
                    code: 400,
                    message: "Không tồn tại"
                })
                break;
        }

        
    } catch (error) {
        res.json({
            code: 400,
            message: "Không tồn tại"
        })
    }
}

// [POST] /api/v1/tasks/create
module.exports.create = async (req, res) => {
    try {
        const newTask = new Task(req.body);
        const data = await newTask.save();

        res.json({
            code: 200,
            message: "Tạo mới nhiệm vụ thành công",
            data: data
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Lỗi tạo mới"
        });
    }
}


// [PATCH] /api/v1/tasks/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        await Task.updateOne({_id: id}, req.body);

        res.json({
            code: 200,
            message: "Cập nhập nhiệm vụ thành công!"
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "Lỗi cập nhập nhiệm vụ !"
        })
    }
}