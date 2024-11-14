const validateQuestion = (req, res, next) => {
    const { title, description, category } = req.body;
  
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }
  
    if (typeof title !== "string") {
      return res.status(400).json({ message: "Title must be a string" });
    }
  
    if (description && typeof description !== "string") {
      return res.status(400).json({ message: "Description must be a string" });
    }
  
    if (category && typeof category !== "string") {
      return res.status(400).json({ message: "Category must be a string" });
    }
  
    next(); 
  };

  export default validateQuestion