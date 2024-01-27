const express =require('express');
const mongoose = require('mongoose');
const cors= require('cors');
const port =8084
const app= express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/mern_crud',
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

var db = mongoose.connection

db.once('open',()=>{
    console.log('database started')
})

const ItemSchema = new mongoose.Schema({
 name:String,
 description:String

})

const Item= mongoose.model('Data',ItemSchema)

app.get('/',(req,res)=>{
  res.send('<h1>welcome to api </h1>')
})

app.get('/api/items', async (req, res) => {
    try {
      const items = await Item.find();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  

  app.post('/api/items', async (req, res) => {
    const { name, description } = req.body;
    const item = new Item({ name, description });
  
    try {
      await item.save();
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  
  app.put('/api/items/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
  
    try {
      const item = await Item.findById(id);
  
      if (!item) return res.status(404).json({ message: 'Item not found' });
  
      item.name = name;
      item.description = description;
  
      await item.save();
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


  app.delete('/api/items/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const item = await Item.findById(id);
  
      if (!item) {
        return res.status(404).json({ message: 'Item not found' });
      }
  
      await item.deleteOne(); // Use deleteOne() instead of remove()
  
      res.json({ message: 'Item deleted successfully' });
    } catch (error) {
      console.error('Error deleting item:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });


app.listen(port,()=>{
    console.log('Server Started')
})