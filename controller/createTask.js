import { sign } from "../middelware/auth.js";
import Task from "../model/createTaskModel.js";

export const creatTask = async (req, res) => {
  try {
    const { data } = req.body;
    // Validate that `data` exists and contains `title` and `priority`
    if (!data || !data.title || !data.priority) {
      return res.status(400).json({
        message: "Title and Priority fields are required!",
        statusCode: 400,
      });
    }
    // Create new Task
    const newTask = await Task.create({
      title: data.title,
      description: data.description,
      priority: data.priority,
      dueDate: data.dueDate
    });

    return res.status(201).json({
      message: "Task created successfully!",
      statusCode: 201,
      data: newTask,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        message: "Validation Error: " + err.message,
        statusCode: 400,
        error: err.errors,
      });
    }

    // Handle any other server errors
    return res.status(500).json({
      message: "An error occurred while creating the task.",
      statusCode: 500,
      error: err.message,
    });
  }
};
