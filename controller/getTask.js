import Task from "../model/createTaskModel.js";
import { paginate } from "../utils/helper.js";

export const getTask = async (req, res) => {
    const { status, priority, dueDate } = req.query;
    if (!status && !priority && !dueDate) {
        return res.status(400).json({
            message: "Missing required fields",
            statusCode: 400,
            data: null
        });
    }
    const query = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if(dueDate) query.dueDate = dueDate
    try {
        const tasks = await Task.find(query);
        if(tasks){
            return res.status(200).json({
                message : "",
                statusCode : 200,
                data : tasks
            })
        }else{
            return res.status(200).json({
                message : "data not found",
                statusCode : 200,
                data : []
            })
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching tasks' });
    }
}

export const getTaskById = async (req,res) =>{
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({
            message: "Missing required fields",
            statusCode: 400,
            data: null
        });
    }
    try{
        const getTask = await Task.findById({_id : id})
        if(getTask){
            return res.status(200).json({
                message: "",
                statusCode: 200,
                data: getTask
            });
        }else{
            return res.status(200).json({
                message: "data not found",
                statusCode: 200,
                data: []
            });
        }
    }catch(err){
        res.status(500).json({ error: 'Error while getting task' });
    }
}

export const getTaskByPage = async (req, res) => {
    const { page , limit } = req.query;
    try {
        if (!page || !limit) {
            return res.status(400).json({
                message: "Missing required fields",
                statusCode: 400,
                data: null
            });
        }
        const tasks = await Task.find(); // Get all tasks
        const paginatedTasks = await paginate(tasks, Number(limit), Number(page)); 

        const totalTasks = tasks.length; 
        const totalPages = Math.ceil(totalTasks / Number(limit));

        return res.status(200).json({
            message: "",
            statusCode: 200,
            data: paginatedTasks,
            pagination: {
                totalTasks,
                totalPages,
                currentPage: Number(page),
                limit: Number(limit),
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching tasks' });
    }
};
