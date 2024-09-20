import Task from "../model/createTaskModel.js";

export const deleteTask = async(req,res) =>{
    const { id } = req.params;
    try {
      const deletedTask = await Task.findByIdAndDelete(id);
  
      if (!deletedTask) {
        return res.status(404).json({ error: 'Task not found' });
      }
  
      return res.status(200).json({
        message: "Task deleted successfully!",
        statusCode: 200,
      });

    } catch (error) {
      res.status(500).json({ error: 'Error deleting task' });
    }
}