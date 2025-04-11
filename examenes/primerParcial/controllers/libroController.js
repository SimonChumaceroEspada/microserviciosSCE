const { ObjectId } = require("mongodb");

const getAllLibros = async (req, res) => {
  try {
    const libroRepository = req.app.locals.dataSource.getRepository("Libro");
    const libros = await libroRepository.find();
    res.status(200).json(libros);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los libros', error: error.message });
  }
};

const createLibro = async (req, res) => {
  try {
    const libroRepository = req.app.locals.dataSource.getRepository("Libro");
    const nuevoLibro = libroRepository.create(req.body);
    const libroGuardado = await libroRepository.save(nuevoLibro);
    res.status(201).json(libroGuardado);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el libro', error: error.message });
  }
};


const updateLibro = async (req, res) => {
  try {
    const id = req.params.id;
    const libroRepository = req.app.locals.dataSource.getRepository("Libro");
    
    const libro = await libroRepository.findOneBy({ _id: new ObjectId(id) });
    
    if (!libro) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }
    
    await libroRepository.update({ _id: new ObjectId(id) }, req.body);
    
    const libroActualizado = await libroRepository.findOneBy({ _id: new ObjectId(id) });
    
    res.json(libroActualizado);
  } catch (error) {
    console.error("Error al actualizar libro:", error);
    res.status(500).json({ message: "Error al actualizar el libro", error: error.message });
  }
};


const deleteLibro = async (req, res) => {
  try {
    const libroRepository = req.app.locals.dataSource.getRepository("Libro");
    const id = req.params.id;
    
    const libro = await libroRepository.findOneBy({ _id: new ObjectId(id) });
    
    if (!libro) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }
    
    await libroRepository.delete({ _id: new ObjectId(id) });
    
    res.status(200).json({ message: 'Libro eliminado correctamente' });
  } catch (error) {
    console.error("Error al eliminar libro:", error);
    res.status(500).json({ message: 'Error al eliminar el libro', error: error.message });
  }
};

module.exports = {
  getAllLibros,
  createLibro,
  updateLibro,
  deleteLibro
};
