import Task from "../model/createTaskModel.js";

export const updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, status, priority, dueDate } = req.body;
    if (!title && !description && !status && !priority && !dueDate) {
        return res.status(400).json({
            message: "Missing required fields",
            statusCode: 400,
            data: null
        });
    }
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            {
                title,
                description,
                status,
                priority,
                dueDate: status === 'completed' ? null : dueDate
            },
            { new: true, runValidators: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ error: 'Task not found' });
        }

        // --------------------------or else we use this approach also-----------------------------------
        // if (updatedTask.status === 'completed') {
        //     await Task.updateOne(
        //         { _id: id },
        //         { $set: { dueDate: null } }
        //     );
        // }

        return res.status(200).json({
            message: "Task Updated Successfully",
            statusCode: 200,
            data: updatedTask
        });
    } catch (error) {
        console.log('error: ', error);
        res.status(500).json({ error: 'Error updating task' });
    }
};

